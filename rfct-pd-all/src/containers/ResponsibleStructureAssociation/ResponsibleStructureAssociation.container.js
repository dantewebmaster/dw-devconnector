import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
import ResponsibleStructureAssociationView from './views/ResponsibleStructureAssociationView';
import * as responsibleStructureAssociationActions from './actions/responsibleStructureAssociationActions';

class ResponsibleStructureAssociation extends Component {
  state = {
    view: 0,
    dialogOpen: false,
  };

  componentDidMount() {
    const { actions } = this.props;
    this.props.actions.getResponsibleStructureStatus();
    actions.getHierarchyLevel();

    const structure = JSON.parse(localStorage.getItem('structure'));
    if (structure) {
      this.setState({ view: 1 });
      this.props.actions.setField({ field: 'searchStructureCode', value: structure.structureCode });
      this.props.actions.setField({ field: 'searchStructureLevelId', value: structure.structureLevelId });
    }
  }

  componentDidUpdate(prevProps) {
    const { responsibleStructureAssociation: { fields: prevFields } } = prevProps;
    const { actions, responsibleStructureAssociation: { fields: thisFields } } = this.props;

    if (thisFields.searchStructureLevelId
      && thisFields.searchStructureLevelId !== ''
      && thisFields.searchStructureCode
      && thisFields.searchStructureCode !== ''
      && prevFields.searchStructureCode !== thisFields.searchStructureCode
    ) {
      actions.getStructuresByOrderSearch(thisFields.searchStructureLevelId, thisFields.searchStructureCode);
      this.handleGetCurrentSearchStructures();
    } else if (
      !thisFields.searchStructureCode
      && prevFields.searchStructureCode !== thisFields.searchStructureCode
    ) {
      actions.clearSearchStructure();
      actions.clearList('searchStructures');
    }

    // if (prevFields.searchStructureLevelId !== thisFields.searchStructureLevelId
    //   && thisFields.searchStructureLevelId !== ''
    //   && view === 3) {
    //   actions.filterStructure();
    // }
  }

  handleGetCurrentSearchStructures = () => {
    const { actions, responsibleStructureAssociation: { fields } } = this.props;
    typeof fields.searchStructureCode === 'number' && fields.searchStructureCode !== '' &&
      actions.fetchHierarchyStructure(fields.searchStructureLevelId, fields.searchStructureCode);
  }

  handleGetResponsibleSearchStructures = () => {
    const { actions, responsibleStructureAssociation: { fields } } = this.props;
    typeof fields.searchStructureCode === 'number' && fields.searchStructureCode !== '' &&
      actions.fetchResponsibleStructure(fields.searchStructureLevelId, fields.searchStructureCode);
  }

  handleAssignUnassign = () => {
    const { actions, responsibleStructureAssociation: { fields }, handlers } = this.props;

    const payload = {
      structureLevelId: fields.structureLevelId,
      structureCode: fields.structureCode,
      personId: fields.personId || undefined,
      personCode: fields.personCode,
      personName: fields.personName,
      function: fields.functionId,
      role: fields.roleId,
    };

    actions.associationResponsible(payload)
      .then(() => handlers.showSnackbar({ key: 'ASSIGNMENT_SUCCESSFULLY' }));
  }

  handleEnterKeyPress = e => {
    const { actions, responsibleStructureAssociation: { fields } } = this.props;
    if (e.key === 'Enter') {
      actions.getResponsiblePerson(fields.personCodeField);
      actions.getResponsiblePersonHistory(fields.personCodeField);
    }
  };

  handleEnterKeyPressModal = e => {
    const { actions, responsibleStructureAssociation: { fields } } = this.props;
    if (e.key === 'Enter') {
      actions.getResponsiblePerson(fields.personCodeModal);
      actions.getResponsiblePersonHistory(fields.personCodeModal);
    }
  };

  // handleSearchResponsibleWithoutStructure = e => {
  //   const { actions, responsibleStructureAssociation: { fields } } = this.props;
  //   e.key === 'Enter' &&
  //     actions.getResponsibleWithoutStructure(fields.personCode);
  // }

  handleViewSelect = view => {
    this.setState({ view });
    this.props.actions.clearAll();
  };

  handleCloseDialog = (enumAssociate) => {
    this.setState({ dialogOpen: false });
    if (enumAssociate === 1) {
      this.props.actions.clearSearchResponsible();
    } else if (enumAssociate === 2) {
      this.props.actions.clearSearchStructure();
    }
  };

  handleOpenDialog = row => {
    this.setState({ dialogOpen: true });
    if (row)
      this.props.actions.selectRow(row);
  };

  get handlers() {
    return {
      ...this.props.handlers,
      setField: this.props.actions.setField,
      viewSelect: this.handleViewSelect,
      assignUnassign: this.handleAssignUnassign,
      enterKeyPress: this.handleEnterKeyPress,
      openDialog: this.handleOpenDialog,
      closeDialog: this.handleCloseDialog,
      enterKeyPressModal: this.handleEnterKeyPressModal,
    };
  }

  render() {
    const { responsibleStructureAssociation: { fields, lists } } = this.props;
    const { view, dialogOpen } = this.state;

    return (
      <React.Fragment>
        <ResponsibleStructureAssociationView
          fields={fields}
          lists={lists}
          handlers={this.handlers}
          view={view}
          dialogOpen={dialogOpen}
        />
      </React.Fragment>
    );
  }
}

ResponsibleStructureAssociation.propTypes = {
  intl: intlShape,
  actions: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  responsibleStructureAssociation: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    responsibleStructureAssociation: state.responsibleStructureAssociation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...responsibleStructureAssociationActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  injectIntl,
)(ResponsibleStructureAssociation);
