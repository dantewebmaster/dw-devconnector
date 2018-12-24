import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
// CUSTOM COMPONENTS
import CardTemplate from 'Components/common/templates/CardTemplate';
import PersonInformation from 'Components/PersonInformation';
import PersonHistoryTable from './views/PersonHistoryTable';
import ActionDialog from '../../components/ActionDialog';
// HIGH ORDER COMPONENTS
import withMessages from "Components/HighOrderComponents/withMessages";
import withHandlers from "Components/HighOrderComponents/withHandlers";
// ACTIONS
import * as statusActions from './actions/statusActions';

class PersonRelationshipStatus extends Component {
  state = {
    confirmModal: {
      open: false,
    },
    bodyRequest: {},
    personCode: '',
  };

  componentDidMount() {
    this.props.actions.clearStatus();
  }

  componentDidUpdate(prevProps) {
    const { actions, status: { selectedPerson } } = this.props;
    if (selectedPerson.personCode && selectedPerson.personCode !== prevProps.status.selectedPerson.personCode) {
      actions.getPersonHistory(selectedPerson.personCode);
    }

    if (selectedPerson.personCode && selectedPerson.personCode !== prevProps.status.selectedPerson.personCode && selectedPerson.structureLevelId !== '' && selectedPerson.structureCode !== '') {
      actions.getCurrentCycle(selectedPerson.structureLevelId, selectedPerson.structureCode);
    }
  }

  handlePersonCodeChange = e => this.setState({ personCode: e.target.value });

  handleEnterKeyPress = (e) => {
    const { actions } = this.props;
    if (e.key === 'Enter') {
      actions.getPersonInformation(this.state.personCode);
      actions.getCeaseTypes();
    }
  };

  handleOpenModal = (personCode, personStatus) => {
    const { status: { selectedPerson } } = this.props;
    const { bodyRequest, confirmModal } = this.state;

    this.setState({
      ...this.state,
      confirmModal: {
        ...confirmModal,
        open: true,
      },
      bodyRequest: {
        ...bodyRequest,
        personCode,
        role: selectedPerson.role,
        function: selectedPerson.function,
        personStatus,
      },
    }, personStatus === 4 ? this.setState({ ...this.state, bodyRequest: { ...bodyRequest, personStatus: 3 } }) :
        this.setState({ ...this.state, bodyRequest: { ...bodyRequest, personStatus: 4 } })
    );
  };

  closeModal = () => this.setState({ ...this.state, confirmModal: { open: false }, bodyRequest: {} });

  handlerReasonSelect = event => this.setState({ bodyRequest: { ...this.state.bodyRequest, reasonUid: event.target.value } });

  handleCeasePersonStatus = () => {
    const { handlers, actions } = this.props;
    const { personCode, bodyRequest } = this.state;
    actions.ceasePerson(bodyRequest)
      .then(() => {
        actions.getPersonInformation(personCode);
        actions.getPersonHistory(personCode);
        handlers.showSnackbar({ key: 'STATUS_CEASE_SUCCESS' });
      });
    this.closeModal();
  }

  handleReactivatePersonStatus = () => {
    const { handlers, actions } = this.props;
    const { personCode, bodyRequest } = this.state;
    actions.reactivatePerson(bodyRequest)
      .then(() => {
        actions.getPersonInformation(personCode);
        actions.getPersonHistory(personCode);
        handlers.showSnackbar({ key: 'STATUS_REACTIVATE_SUCCESS' });
      });
    this.closeModal();
  }

  handleClearStatus = () => {
    this.props.actions.clearStatus();
    this.setState({ personCode: '', bodyRequest: {} });
  };

  render() {
    const { status: { selectedPerson, personHistory, parameters } } = this.props;
    const { bodyRequest, confirmModal } = this.state;

    return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h1" style={{ padding: '0 0 1.5rem' }}>
          <FormattedMessage
            id="titles.page.person_relationship_status"
            defaultMessage="Cessação/Reativação Online"
            description="Título da página - Cessação/Reativação Online"
          />
        </Typography>
        <CardTemplate>
          <PersonInformation
            personCode={this.state.personCode}
            onPersonCodeChange={this.handlePersonCodeChange}
            onEnterKeyPress={this.handleEnterKeyPress}
            selectedPerson={selectedPerson}
          />
        </CardTemplate>

        {personHistory.length > 0 &&
          <PersonHistoryTable
            historyData={_.cloneDeep(personHistory).reverse()}
            setUpdate={this.handleOpenModal}
            onClearStatus={this.handleClearStatus}
          />}

        <ActionDialog
          open={confirmModal.open}
          title={bodyRequest.personStatus === 4 ?
            <FormattedMessage
              id="modal.reactivate.title"
              defaultMessage="Deseja reativar a relação desta pessoa?"
              description="Título do modal - Reativar pessoa"
            /> : <FormattedMessage
              id="modal.cessation.title"
              defaultMessage="Deseja encerrar a relação desta pessoa?"
              description="Título do modal - Cessar pessoa"
            />
          }
          iconType={bodyRequest.personStatus === 4 ? 'info' : null}
          confirmMode
          onCancel={this.closeModal}
          onConfirm={bodyRequest.personStatus === 4 ? this.handleReactivatePersonStatus : this.handleCeasePersonStatus}
          parameters={parameters || null}
          selectHandler={bodyRequest.personStatus !== 4 ? this.handlerReasonSelect : null}
          selectValue={bodyRequest.reasonUid}
        />
      </React.Fragment>
    );
  }
}

PersonRelationshipStatus.propTypes = {
  actions: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    status: state.status
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...statusActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
)(PersonRelationshipStatus);
