import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
// CUSTOM COMPONENTS
import CardTemplate from 'Components/common/templates/CardTemplate';
import StructureChangeRules from './views/StructureChangeRules';
import ParametersList from './views/ParametersList';
import ActionDialog from '../../components/ActionDialog';
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from "Components/HighOrderComponents/withMessages";
import Settings from './views/Settings/Settings';
// ACTIONS
import * as parametersActions from './actions/parametersActions';

const styles = theme => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabRoot: {
    minWidth: 160,
    marginRight: theme.spacing.unit * 4,
    fontWeight: 700,
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
  },
});

class Parameters extends Component {
  state = {
    currentTab: 0,
    open: false,
    exceptionUid: '',
    confirmModal: {
      open: false,
      parameterToDelete: null,
    },
    suggestions: [],
    selectedStructure: '',
  };

  handleOpenModalDeleteException = (exceptionUid) => () => {
    this.setState({ ...this.state, open: true, exceptionUid: exceptionUid });
  };

  handleRemoveException = () => {
    const { actions, handlers } = this.props;
    const { exceptionUid } = this.state;
    this.closeModal();
    actions.removeException(exceptionUid)
      .then(() => {
        this.props.actions.clearFields();
        this.props.actions.getParameters();
        this.props.actions.getHierarchyLevel();
        this.props.actions.getSettings();
        handlers.showSnackbar({ key: 'EXCEPTION_DELETE_SUCCESS' });
      })
      .catch(() => handlers.showSnackbar({ key: 'EXCEPTION_DELETE_ERROR' }));
  };

  handleSetUpdateException = (order, settingUid, exception) => () => {
    {
      order === 1 ? this.props.actions.setException1(settingUid, exception) :
        order === 2 ? this.props.actions.setException2(settingUid, exception) :
          this.props.actions.setException3(settingUid, exception);
    }
  };

  handleAddException = (selectExceptionUid, payload) => () => {
    const { handlers, actions } = this.props;
    selectExceptionUid === '' ?
      actions.addException(payload)
        .then(() => {
          actions.clearFields();
          actions.getParameters();
          actions.getHierarchyLevel();
          actions.getSettings();
          handlers.showSnackbar({ key: 'EXCEPTION_ADD_SUCCESS' });
        }).catch(() => handlers.showSnackbar({ key: 'EXCEPTION_ADD_ERROR' })) :
      actions.updateException(selectExceptionUid, payload)
        .then(() => {
          actions.clearFields();
          actions.getParameters();
          actions.getHierarchyLevel();
          actions.getSettings();
          handlers.showSnackbar({ key: 'EXCEPTION_UPDATE_SUCCESS' });
        }).catch(() => handlers.showSnackbar({ key: 'EXCEPTION_UPDATE_ERROR' }));
  };

  handleSuggestionsFetchRequested = ({ value }) => this.setState({ suggestions: value });

  handleSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  handleChangeStructure1 = (event, { newValue }) => {
    const { actions } = this.props;
    this.setState({ selectedStructure: newValue },
      () => actions.setField({ field: 'selectStructureName1', value: newValue })
    );
  };

  handleChangeStructure2 = (event, { newValue }) => {
    const { actions } = this.props;
    this.setState({ selectedStructure: newValue },
      () => actions.setField({ field: 'selectStructureName2', value: newValue })
    );
  };

  handleChangeStructure3 = (event, { newValue }) => {
    const { actions } = this.props;
    this.setState({ selectedStructure: newValue },
      () => actions.setField({ field: 'selectStructureName3', value: newValue })
    );
  };

  handleFieldChange = field => event => {
    const value = event.target.value;
    this.props.actions.setField({ field, value });
  };

  handleStructureChange = (code, name) => () => this.props.actions.setStructure({ code, name });

  handleAddParameter = (group) => {
    const { parameters, actions, handlers } = this.props;

    const bodyRequest = {
      groupParameterUid: group,
      priority: parseInt(parameters.fields.priority),
      cycleOpen: parameters.fields.cycleOpen,
      originStructureLevelId: parameters.fields.originStructureLevelId,
      destinationStructureLevelId: parameters.fields.destinationStructureLevelId,
    };

    actions.addParameter(bodyRequest)
      .then(() => {
        handlers.showSnackbar({ key: 'ADD_PARAMETER' });
        this.props.actions.getStructureChangeRules({ cache: false });
        this.props.actions.clearFields();
      });
  };

  handleSetUpdateParameter = (parameter, group) => {
    const parameterFields = { ...parameter, group };
    this.props.actions.setUpdateParameter(parameterFields);
  };

  handleUpdateParameter = () => {
    const { parameters, actions, handlers } = this.props;

    const bodyRequest = {
      groupParameterUid: parameters.fields.groupParameterUid,
      priority: parseInt(parameters.fields.priority),
      cycleOpen: parameters.fields.cycleOpen,
      originStructureLevelId: parameters.fields.originStructureLevelId,
      destinationStructureLevelId: parameters.fields.destinationStructureLevelId,
    };

    this.props.actions.updateParameter(parameters.fields.structureChangeRuleUid, bodyRequest)
      .then(() => {
        actions.getStructureChangeRules({ cache: false });
        handlers.showSnackbar({ key: 'UPDATED_SUCCESSFULLY' });
        actions.getStructureChangeRules({ cache: false });
        actions.clearFields();
      });
  };

  handleCancelUpdate = () => this.props.actions.clearFields();

  handleSetDeleteParameter = (structureChangeRuleUid) => {
    this.setState({ ...this.state, confirmModal: { open: true, parameterToDelete: structureChangeRuleUid } });
  };

  handleConfirmDeleteParameter = () => {
    const { actions, handlers } = this.props;
    this.closeModal();
    this.props.actions.deleteParameter(this.state.confirmModal.parameterToDelete)
      .then(() => {
        handlers.showSnackbar({ key: 'DELETED_SUCCESSFULLY' });
        actions.getStructureChangeRules({ cache: false });
      });
  };

  closeModal = () => this.setState({ ...this.state, open: false, confirmModal: { open: false } });

  handleChangeTab = (event, currentTab) => this.setState({ currentTab });

  componentDidMount() {
    this.props.actions.getStructureChangeRules({ cache: false });
    this.props.actions.getParameters();
    this.props.actions.getHierarchyLevel();
    this.props.actions.getSettings();
  }

  componentWillReceiveProps(nextProps) {
    const { parameters: { fields: nextFields, lists: nextLists } } = nextProps;
    const { actions, parameters: { fields: thisFields, lists: thisLists } } = this.props;

    if ((nextFields.selectStructureLevelId1 !== '' && thisFields.selectStructureLevelId1 !== '') && nextFields.selectStructureLevelId1 !== thisFields.selectStructureLevelId1) {
      const orderLevel = this.findLevelOrderByStructureLevelId(nextFields.selectStructureLevelId1);
      actions.getStructuresByOrder(orderLevel, thisFields.selectStructureName1, 1);
    }
    if ((nextFields.selectStructureLevelId1 !== '' && thisFields.selectStructureLevelId1 !== '') && nextFields.selectStructureName1 !== thisFields.selectStructureName1) {
      const orderLevel = this.findLevelOrderByStructureLevelId(nextFields.selectStructureLevelId1);
      actions.getStructuresByOrder(orderLevel, nextFields.selectStructureName1, 1);
    }

    if ((nextFields.selectStructureLevelId2 !== '' && thisFields.selectStructureLevelId2 !== '') && nextFields.selectStructureLevelId2 !== thisFields.selectStructureLevelId2) {
      const orderLevel = this.findLevelOrderByStructureLevelId(nextFields.selectStructureLevelId2);
      actions.getStructuresByOrder(orderLevel, thisFields.selectStructureName2, 2);
    }
    if ((nextFields.selectStructureLevelId2 !== '' && thisFields.selectStructureLevelId2 !== '') && nextFields.selectStructureName2 !== thisFields.selectStructureName2) {
      const orderLevel = this.findLevelOrderByStructureLevelId(nextFields.selectStructureLevelId2);
      actions.getStructuresByOrder(orderLevel, nextFields.selectStructureName2, 2);
    }

    if ((nextFields.selectStructureLevelId3 !== '' && thisFields.selectStructureLevelId3 !== '') && nextFields.selectStructureLevelId3 !== thisFields.selectStructureLevelId3) {
      const orderLevel = this.findLevelOrderByStructureLevelId(nextFields.selectStructureLevelId3);
      actions.getStructuresByOrder(orderLevel, thisFields.selectStructureName3, 3);
    }
    if ((nextFields.selectStructureLevelId3 !== '' && thisFields.selectStructureLevelId3 !== '') && nextFields.selectStructureName3 !== thisFields.selectStructureName3) {
      const orderLevel = this.findLevelOrderByStructureLevelId(nextFields.selectStructureLevelId3);
      actions.getStructuresByOrder(orderLevel, nextFields.selectStructureName3, 3);
    }

    if (!_.isEqual(nextLists.structures1, thisLists.structures1)) {
      this.setState({ suggestions: nextLists.structures1 });
    }
    if (!_.isEqual(nextLists.structures2, thisLists.structures2)) {
      this.setState({ suggestions: nextLists.structures2 });
    }
    if (!_.isEqual(nextLists.structures3, thisLists.structures3)) {
      this.setState({ suggestions: nextLists.structures3 });
    }

    if (nextLists.structures1.length === 1 && (thisFields.selectStructureCode1 === '' ||
      nextLists.structures1[0].structureCode !== thisFields.selectStructureCode1)) {
      actions.setField({ field: 'selectStructureCode1', value: nextLists.structures1[0].structureCode });
    }

    if (nextLists.structures2.length === 1 && (thisFields.selectStructureCode2 === '' ||
      nextLists.structures2[0].structureCode !== thisFields.selectStructureCode2)) {
      actions.setField({ field: 'selectStructureCode2', value: nextLists.structures2[0].structureCode });
    }

    if (nextLists.structures3.length === 1 && (thisFields.selectStructureCode3 === '' ||
      nextLists.structures3[0].structureCode !== thisFields.selectStructureCode3)) {
      actions.setField({ field: 'selectStructureCode3', value: nextLists.structures3[0].structureCode });
    }

    if (nextFields.selectStructureName1 !== thisFields.selectStructureName1 &&
      nextFields.selectStructureName1 === '' && thisFields.selectStructureCode1 !== '') {
      actions.setField({ field: 'selectStructureCode1', value: '' });
    }

    if (nextFields.selectStructureName2 !== thisFields.selectStructureName2 &&
      nextFields.selectStructureName2 === '' && thisFields.selectStructureCode2 !== '') {
      actions.setField({ field: 'selectStructureCode2', value: '' });
    }

    if (nextFields.selectStructureName3 !== thisFields.selectStructureName3 &&
      nextFields.selectStructureName3 === '' && thisFields.selectStructureCode3 !== '') {
      actions.setField({ field: 'selectStructureCode3', value: '' });
    }

    if (nextFields.selectStructureLevelId1 !== '' && nextFields.selectStructureLevelId1 !== thisFields.selectStructureLevelId1) {
      const level = thisFields.structureLevels.filter(item => item.structureLevel.structureLevelId === nextFields.selectStructureLevelId1);
      actions.setField({ field: 'selectStructureLevelName1', value: level[0].structureLevel.structureLevelName });
    }

    if (nextFields.selectStructureLevelId2 !== '' && nextFields.selectStructureLevelId2 !== thisFields.selectStructureLevelId2) {
      const level = thisFields.structureLevels.filter(item => item.structureLevel.structureLevelId === nextFields.selectStructureLevelId2);
      actions.setField({ field: 'selectStructureLevelName2', value: level[0].structureLevel.structureLevelName });
    }

    if (nextFields.selectStructureLevelId3 !== '' && nextFields.selectStructureLevelId3 !== thisFields.selectStructureLevelId3) {
      const level = thisFields.structureLevels.filter(item => item.structureLevel.structureLevelId === nextFields.selectStructureLevelId3);
      actions.setField({ field: 'selectStructureLevelName3', value: level[0].structureLevel.structureLevelName });
    }
  }

  findLevelOrderByStructureLevelId(structureLevelId) {
    const structureLevel = this.props.parameters.fields.structureLevels.find(level => level.structureLevel.structureLevelId === structureLevelId);
    return structureLevel.orderLevel;
  }

  render() {
    const {
      parameters: {
        parametersLists,
        structureChangeRules,
        parameterSeted,
        fields,
        lists,
      },
      classes,
    } = this.props;

    const { currentTab } = this.state;

    const handlers = {
      ...this.props.handlers,
      fieldChange: this.handleFieldChange,
      updateParameter: this.handleUpdateParameter,
      addParameter: this.handleAddParameter,
      setUpdateParameter: this.handleSetUpdateParameter,
      setDeleteParameter: this.handleSetDeleteParameter,
      cancelUpdate: this.handleCancelUpdate,
      changeTab: this.handleChangeTab,
      structureChange: this.handleStructureChange,
      selectFieldChange: this.handleSelectFieldChange,
      suggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      suggestionsClearRequested: this.handleSuggestionsClearRequested,
      changeStructure1: this.handleChangeStructure1,
      changeStructure2: this.handleChangeStructure2,
      changeStructure3: this.handleChangeStructure3,
      addException: this.handleAddException,
      setUpdateException: this.handleSetUpdateException,
      removeException: this.handleRemoveException,
      openModalDeleteException: this.handleOpenModalDeleteException,
    };

    return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
          <FormattedMessage
            id="page.parameters"
            defaultMessage="Parametrização"
            description="Título da página - Parametrização"
          />
        </Typography>

        <CardTemplate>
          <AppBar position="static" elevation={0} style={{ marginBottom: '32px' }}>
            <Tabs
              value={currentTab} onChange={this.handleChangeTab}
              indicatorColor="primary"
              textColor="primary"
              classes={{ indicator: classes.tabsIndicator }}
            >
              <Tab
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                label={<FormattedMessage
                  id="common.general"
                  defaultMessage="Gerais"
                  description="Rótulo comum - Gerais"
                />}
              />
              <Tab
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                label={<FormattedMessage
                  id="common.by_structure"
                  defaultMessage="Por Estrutura"
                  description="Rótulo comum - Por Estrutura"
                />}
              />
            </Tabs>
            <Divider />
          </AppBar>

          {currentTab === 0 &&
            <div>
              {structureChangeRules.map(group => {
                return (
                  <StructureChangeRules
                    key={group.groupParameterUid}
                    parameters={group.structureChangeRules}
                    group={group.groupParameterUid}
                    seted={parameterSeted}
                    fields={fields}
                    {...handlers}
                    state={this.state}
                    disableEdit={!handlers.hasAccess('parameters/edit')}
                  />
                );
              })}
              {parametersLists && parametersLists.map(item => {
                return (
                  <ParametersList
                    key={item.groupParameterUid}
                    group={item.groupType}
                    parameters={item.parameters}
                  />
                );
              })}
            </div>}

          {currentTab === 1 && lists.settings.map((item, index) => {
            return <Settings
              key={item.settingUid}
              setting={item}
              lists={lists}
              fields={fields}
              handlers={handlers}
              state={this.state}
              order={index + 1}
            />;
          })}
        </CardTemplate>

        <ActionDialog
          open={this.state.confirmModal.open}
          title={<FormattedMessage
            id="modal.confirm_delete.title"
            defaultMessage="Deseja excluir?"
            description="Título do modal - Deseja excluir?"
          />}
          desc={<FormattedMessage
            id="modal.confirm_delete.desc"
            defaultMessage="Confirme para excluir definitivamente o item selecionado."
            description="Mensagem solicitando confirmação de exclusão do item"
          />}
          confirmMode
          onCancel={this.closeModal}
          onConfirm={this.handleConfirmDeleteParameter}
        />

        <ActionDialog
          open={this.state.open}
          title={<FormattedMessage
            id="modal.settings.exception"
            defaultMessage="Deseja excluir excesão?"
            description="Título do modal - Deseja excluir excesão?"
          />}
          desc={<FormattedMessage
            id="modal.confirm_delete.desc"
            defaultMessage="Confirme para excluir definitivamente o item selecionado."
            description="Mensagem solicitando confirmação de exclusão do item"
          />}
          confirmMode
          onCancel={this.closeModal}
          onConfirm={this.handleRemoveException}
        />
      </React.Fragment>
    );
  }
}

Parameters.propTypes = {
  actions: PropTypes.object.isRequired,
  parameters: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    parameters: state.parameters,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...parametersActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  withStyles(styles),
)(Parameters);
