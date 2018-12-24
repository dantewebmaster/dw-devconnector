import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
// VIEWS
import OnlineChange from './views/OnlineChange';
// HIGH ORDER COMPONENTS
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
// ACTIONS
import * as relationshipStructureActions from './actions/relationshipStructureActions';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
});

class RelationshipStructureChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      selectedPerson: {},
      personStructures: [],
      structureLevels: {},
      destination: {},
      personCode: '',
      source: {},
      cancelModal: {
        open: false,
        scheduleUid: ''
      },
      getCycleModal: {
        open: false,
        destinationCycle: '',
      },
      confirmMovementModal: {
        open: false,
        gapOrOverlap: '',
      },
      messageIsResponsible: {
        open: false,
      },
    };
  }

  componentDidMount() {
    this.props.actions.clearMovement();
    this.props.actions.getHierarchyLevel();
  }

  componentDidUpdate(prevProps) {
    const { movement: { fields } } = this.props;
    if (
      fields.destinationCycle &&
      fields.destinationCycle !== prevProps.movement.fields.destinationCycle
    ) {
      this.setState({ ...this.state, getCycleModal: { open: true, destinationCycle: fields.destinationCycle } });
    }
    if (
      fields.gapOrOverlap !== '' &&
      fields.gapOrOverlap !== prevProps.movement.fields.gapOrOverlap
    ) {
      this.setState({ ...this.state, confirmMovementModal: { open: (fields.gapOrOverlap) || false, gapOrOverlap: fields.gapOrOverlap } });
    }
    if (
      fields.isResponsible !== '' &&
      fields.isResponsible !== prevProps.movement.fields.isResponsible
    ) {
      this.setState({ ...this.state, messageIsResponsible: { open: fields.isResponsible } });
    }
  }

  handlePersonCodeChange = (e) => this.setState({ personCode: e.target.value });

  handleKeyPress = (keyName) => (e) => {
    const { actions } = this.props;
    if (e.key === keyName) {
      actions.getPersonInformation(e.target.value);
      actions.getScheduledRequests(e.target.value);
    }
  };

  onRequest = () => {
    this.props.actions.getCycle(this.props.user, this.props.movement.selectedPerson, this.props.movement.destination);
  };

  handleSubmitScheduling = () => {
    const { handlers, actions, movement: { selectedPerson, destination, origin } } = this.props;

    const body = {
      personCode: selectedPerson.personCode,
      originStructureCode: origin.structureCode,
      destinationStructureCode: destination.structureCode,
      originStructureLevelId: origin.structureLevelId,
      destinationStructureLevelId: destination.structureLevelId,
      function: selectedPerson.function,
      role: selectedPerson.role,
    };

    actions.create(body).then(() => handlers.showSnackbar({ key: 'MOVED_SUCCESSFULLY' }));
    this.handleCloseDialog();
  };

  handleSearchByStructure = () => {
    const { actions, movement: { fields } } = this.props;

    if (!isEmptyObject(fields.schedulingByStructureOriginValues))
      actions.changeDestinationStructure({
        key: 'schedulingByStructureDestinyValues',
        value: fields.schedulingByStructureOriginValues
      });

    const structure = this.handleFindLowestLevelStructure(fields.schedulingByStructureOriginValues);

    const config = {
      params: {
        'structure-level-id': structure.structureLevelId,
        'structure-code': structure.structureCode,
        queryType: fields.schedulingByStructureQueryType
      }
    };

    actions.getPeopleByStructure(config);
  };

  handleRowSelect = (field) => (payload) => {
    this.props.actions.setField({ field, value: payload, overwrite: true });
  };

  handleFindLowestLevelStructure = values => {
    const list = Object.keys(values).map(key => values[key])
      .filter(current => current.structureCode && current.structureCode !== '');

    return list.length > 0 ? list[list.length - 1] : null;
  };

  handleDestinationChange = (values) => {
    this.setState({
      ...this.state,
      destinationValues: values
    }, () => this.props.actions.changeStructure(values));
  };

  handleCanSchedule = () => {
    const { destination, origin, selectedPerson } = this.fields;

    return destination &&
      destination.structureCode &&
      destination.structureCode !== origin.structureCode &&
      destination.hasPerson &&
      selectedPerson.personCode;
  };

  handleCancel = () => {
    this.props.actions.clearMovement();
    this.setState({ personCode: '' });
  };

  handleScheduleValidation = (person, origin, destination) => () => {
    const { movement, actions } = this.props;

    actions.getCycle(
      person || movement.selectedPerson,
      origin || movement.origin,
      destination || movement.destination
    );
  };

  handleSetCancelSchedule = (scheduleUid) => {
    this.setState({ ...this.state, cancelModal: { ...this.state.cancelModal, open: true, scheduleUid } });
  };

  // send cancel post to actions
  handleConfirmCancelSchedule = () => {
    const { actions, handlers, movement: { fields } } = this.props;
    actions.cancel({
      schedulingUids: [this.state.cancelModal.scheduleUid],
      reasonDetails: fields.reason
    }).then(() => {
      actions.getScheduledRequests(this.state.personCode);
      handlers.showSnackbar({ key: 'CANCELED_SUCCESSFULLY' });
    });
    this.handleCloseDialog();
  };

  handleCloseDialog = () => {
    this.setState({
      ...this.state,
      cancelModal: { ...this.state.cancelModal, open: false, scheduleUid: '' },
      messageIsResponsible: { ...this.state.messageIsResponsible, open: false },
      getCycleModal: { ...this.state.getCycleModal, open: false, destinationCycle: '' },
      confirmMovementModal: { ...this.state.confirmMovementModal, open: false, gapOrOverlap: '' },
    });
  }

  get fields() {
    const { movement: { selectedPerson, originValues, destinationValues, fields } } = this.props;

    return {
      ...fields,
      originValues,
      selectedPerson,
      destinationValues,
      personCode: this.state.personCode,
      cancelModalOpen: this.state.cancelModal.open,
      getCycleModalOpen: this.state.getCycleModal.open,
      isResponsibleModalOpen: this.state.messageIsResponsible.open,
      confirmMovementModalOpen: this.state.confirmMovementModal.open,
      origin: this.handleFindLowestLevelStructure(originValues),
      destination: this.handleFindLowestLevelStructure(destinationValues),
    };
  }

  get lists() {
    const { movement: { structureLevels, personStructures, lists, scheduledRequests } } = this.props;
    return { ...lists, structureLevels, personStructures, scheduledRequests };
  }

  get handlers() {
    return {
      ...this.props.handlers,
      onRequest: this.onRequest,
      onCancel: this.handleCancel,
      rowSelect: this.handleRowSelect,
      handleKeyPress: this.handleKeyPress,
      onCloseDialog: this.handleCloseDialog,
      handleCanSchedule: this.handleCanSchedule,
      searchByStructure: this.handleSearchByStructure,
      onSetCancelSchedule: this.handleSetCancelSchedule,
      structureChange: this.props.actions.changeStructure,
      handleSubmitScheduling: this.handleSubmitScheduling,
      handlePersonCodeChange: this.handlePersonCodeChange,
      handleDestinationChange: this.handleDestinationChange,
      handleScheduleValidation: this.handleScheduleValidation,
      onConfirmCancelSchedule: this.handleConfirmCancelSchedule,
      findLowestLevelStructure: this.handleFindLowestLevelStructure,
    };
  }

  render = () => {
    return <OnlineChange fields={this.fields} lists={this.lists} handlers={this.handlers} state={this.state} />;
  };
}

RelationshipStructureChange.propTypes = {
  open: PropTypes.func,
  user: PropTypes.object,
  movement: PropTypes.object,
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    structures: state.structures,
    movement: state.movement,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...relationshipStructureActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  withStyles(styles),
)(RelationshipStructureChange);
