import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import Excel from 'exceljs/dist/exceljs';
import FileSaver from 'file-saver';
import { Link } from 'react-router';
// ACTIONS
import * as schedulingActions from './actions/schedulingActions';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// CUSTOM COMPONENTS
import PersonInformation from 'Components/PersonInformation';
import Worker from 'worker-loader!Utils/batchScheduling.worker';
// VIEWS
import PersonScheduling from './views/PersonScheduling';
import BatchScheduling from './views/BatchScheduling/BatchScheduling';
import SchedulingView from './views/SchedulingView';
import StructureBatchSchedulingFilter from './views/StructureBatchSchedulingFilter';
import StructureBatchSchedulingResults from './views/StructureBatchSchedulingResults';
// HIGH ORDER COMPONENTS
import withMessages from 'Components/HighOrderComponents/withMessages';
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import Processing from './views/Processing/Processing';

const publicPath = process.env.PUBLIC_PATH;

const worker = new Worker();

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    paddingTop: theme.spacing.unit,
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
  snackbarAction: {
    color: theme.palette.primary.complementaryColor,
  },
});

class Scheduling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      cancelModal: this.props.scheduling.cancelModal,
      getCycleModal: this.props.scheduling.getCycleModal,
      selectedPerson: {},
      structureLevels: {},
      originValues: {},
      destinationValues: {},
      destination: {},
      personCode: '',
      source: {},
      processingFile: false,
      batchScheduleImportFile: null,
      getBulkScheduleLogFile: false,
      batchScheduleConfirmed: false,
      open: false,
      newSearch: false,
      page: 0,
      rowsPerPage: 10,
      isPaused: false,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.props.actions.clearSchedule();
    this.props.actions.getHierarchyLevel();
    this.fetchStatusQueue();
    // this.props.actions.getPlansLevels();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate(prevProps) {
    const { scheduling: { lists: prevLists, fields: prevFields } } = prevProps;
    const { actions, scheduling: { lists: thisLists, fields: thisFields }, handlers } = this.props;

    if (!_.isEqual(prevLists.bulkScheduleQueue, thisLists.bulkScheduleQueue)) {
      if (Array.isArray(thisLists.bulkScheduleQueue) && thisLists.bulkScheduleQueue.length > 0) {
        const latestQueue = thisLists.bulkScheduleQueue[0];

        if (latestQueue && latestQueue.isCompleted && latestQueue.status.some(item => item.status === 7)) {
          this.setState({ batchScheduleConfirmed: true });
        } else {
          this.setState({
            processingFile: !latestQueue.isCompleted,
            batchScheduleConfirmed: false,
          });

          if (latestQueue.isCompleted || latestQueue.length === 0) {
            clearInterval(this.timer);

          } else if (
            !this.state.processingFile && !latestQueue.isCompleted
          ) {
            this.timer = setInterval(() => this.fetchStatusQueue(), 10000);
          }
        }

        if (!thisLists.bulkScheduleLog)
          this.handleConfirmBatchSchedule(latestQueue.importUid);

      } else {
        clearInterval(this.timer);
        this.setState({ processingFile: false });
      }
    }

    if (this.props.scheduling.lists.peopleByStructure && this.props.scheduling.lists.peopleByStructure !== prevProps.scheduling.lists.peopleByStructure && this.props.scheduling.lists.peopleByStructure.length === 0) {
      handlers.showSnackbar({ key: 'STRUCTURE_HAS_NOT_PERSONS' });
    }

    if (thisFields.originStructureLevelId
      && thisFields.originStructureLevelId !== ''
      && thisFields.originStructureCode
      && thisFields.originStructureCode !== ''
      && prevFields.originStructureCode !== thisFields.originStructureCode
    ) {
      actions.getStructuresByOrderOrigin(thisFields.originStructureLevelId, thisFields.originStructureCode);
      this.handleGetCurrentOriginStructures();
    } else if (
      !thisFields.originStructureCode
      && prevFields.originStructureCode !== thisFields.originStructureCode
    ) {
      actions.clearOriginStructure();
      actions.clearList('originStructures');
    }

    if (thisFields.destStructureLevelId
      && thisFields.destStructureLevelId !== ''
      && thisFields.destStructureCode
      && thisFields.destStructureCode !== ''
      && prevFields.destStructureCode !== thisFields.destStructureCode
    ) {
      actions.getStructuresByOrderDest(thisFields.destStructureLevelId, thisFields.destStructureCode);
      this.handleGetCurrentDestStructures();
    } else if (
      !thisFields.destStructureCode
      && prevFields.destStructureCode !== thisFields.destStructureCode
    ) {
      actions.clearDestStructure();
      actions.clearList('destStructures');
    }

  }

  fetchStatusQueue = () => {
    this.props.actions.getBulkScheduleQueue({ cache: false, params: { 'last-import': true } })
      .then(res => {
        if (!res.value || (res.value && res.value.length === 0)) {
          clearInterval(this.timer);
        } else if (res.value && res.value.length > 0 && res.value[0].isCompleted) {
          clearInterval(this.timer);
          this.props.actions.getBulkScheduleLog({
            cache: false,
            params: {
              '_limit': 10,
              '_offset': 0,
            },
          });
        }
      }).catch(() => clearInterval(this.timer));
  };

  handleTabChange = (page, currentTab) => {
    this.setState({ currentTab }, () => this.handleCancel());

    if (this.state.currentTab !== 3 && currentTab === 3) {
      this.fetchStatusQueue();
      this.timer = setInterval(() => this.fetchStatusQueue(), 10000);
    } else if (this.state.currentTab === 3 && currentTab !== 3 || !this.state.processingFile) {
      clearInterval(this.timer);
    }
  };

  handlePersonCodeChange = event => this.setState({ personCode: event.target.value });

  handleEnterKeyPress = (e) => {
    if (e.key === 'Enter')
      this.props.actions.getPersonStatuses(this.state.personCode);
  };

  handleFindLowestLevelStructure = values => {
    const list = Object.keys(values).map(key => values[key])
      .filter(current => current.structureCode && current.structureCode !== '');

    return list.length > 0 ? list[list.length - 1] : null;
  };

  handleSearchByStructure = (config) => {
    const { actions, scheduling: { fields } } = this.props;
    actions.clearField('reason');

    const defaultConfig = {
      params: {
        'structure-level-id': fields.originStructureLevelId,
        'structure-code': fields.originStructureCode,
        'query-type': fields.schedulingByStructureQueryType,
        'gp-level': fields.schedulingByGpLevel,
      },
    };

    const mergedConfig = { ...defaultConfig, ...config };

    actions.getPeopleByStructure(mergedConfig);
  };

  handleRowSelect = field => payload => this.props.actions.setField({ field, value: payload, overwrite: true });

  handleScheduleValidation = (person, origin, destination) => () => {
    const { scheduling, actions } = this.props;

    actions.getCycle(
      person || scheduling.selectedPerson,
      origin || scheduling.origin,
      destination || scheduling.destination,
    );
  };

  handleBatchSchedulingByStructure = () => {
    const { actions, scheduling: { fields } } = this.props;

    const payload = fields.schedulingByStructureSelectedPeople.map(personCode => ({
      "originStructureCode": fields.originStructureCode,
      "destinationStructureCode": fields.destStructureCode,
      "originStructureLevelId": fields.originStructureLevelId,
      "destinationStructureLevelId": fields.destStructureLevelId,
      "personCode": personCode,
    }));

    actions.clearDialogs();
    this.props.actions.clearList('bulkScheduleLog');

    actions.bulkScheduling({ schedules: payload })
      .then(() => {
        this.fetchStatusQueue();
        this.setState({ currentTab: 3 });
      });
  };

  handleSetCancelSchedule = (schedulingUid) => {
    this.setState({
      ...this.state,
      open: true,
      scheduleUid: schedulingUid,
      cancelModal: {
        ...this.state.cancelModal,
        open: true,
        scheduleUid: schedulingUid,
      },
    });
  };

  // send cancel post to actions
  handleCancelSchedule = () => {
    const { actions, handlers, scheduling: { fields } } = this.props;

    actions.cancel({
      schedulingUids: [this.state.cancelModal.scheduleUid],
      reasonDetails: fields.reason
    }).then(() => {
      actions.clearField('reason');
      actions.getScheduledRequests(this.state.personCode);
      handlers.showSnackbar({ key: 'CANCELED_SUCCESSFULLY' });
    });

    this.handleCloseDialog();
  };

  handleCloseDialog = () => {
    this.setState({
      ...this.state, open: false, scheduleUid: [], cancelModal: { ...this.state.cancelModal, open: false },
      getCycleModal: { ...this.state.cancelModal, open: false }
    }, () => this.props.actions.clearDialogs());
  };

  handleCancel = () => {
    this.props.actions.clearSchedule();
    this.props.actions.clearStructureScheduling();
    this.props.actions.clearOriginStructure();
    this.props.actions.clearDestStructure();
    this.setState({ personCode: '' });
  };

  handleCancelStructureScheduling = () => this.props.actions.clearStructureScheduling();

  handleDestinationChange = (values) => {
    this.setState({
      ...this.state, destinationValues: values
    }, () => this.props.actions.changeDestinationStructure(values));
  };

  handlePostSchedule = () => {
    const { actions, scheduling, handlers } = this.props;
    actions.create({
      personCode: scheduling.selectedPerson.personCode,
      function: scheduling.selectedPerson.function,
      role: scheduling.selectedPerson.role,
      originStructureLevelId: scheduling.origin.structureLevelId,
      originStructureCode: scheduling.origin.structureCode,
      destinationStructureLevelId: scheduling.destination.structureLevelId,
      destinationStructureCode: scheduling.destination.structureCode
    }).then(() => {
      actions.getScheduledRequests(scheduling.selectedPerson.personCode);
      handlers.showSnackbar({ key: 'CREATED_SUCCESSFULLY' });
    });
  };

  handleCanSchedule = () => {
    const { destination, origin, selectedPerson } = this.fields;

    return destination &&
      destination.structureCode &&
      destination.structureCode !== origin.structureCode &&
      destination.hasPerson &&
      selectedPerson.personCode;
  };

  handleDeleteSchedules = (selected) => () => {
    const { actions, scheduling: { fields }, handlers } = this.props;
    const payload = this.lists.peopleByStructure
      .filter(item => selected.includes(item.personCode) && item.schedulingUid)
      .map(item => item.schedulingUid);

    if (Array.isArray(payload) && payload.length > 0)
      actions.cancel({
        schedulingUids: payload,
        reasonDetails: fields.reason
      }).then(() => {
        actions.clearField('reason');
        this.handleSearchByStructure();
        handlers.showSnackbar({ key: 'CANCELED_SUCCESSFULLY' });
      });

    this.handleCloseDialog();
  };

  handleChangeFile = field => event => this.setState({ [field]: event.target.files });

  handleBatchScheduleImport = (field, confirmed) => () => {
    const files = this.state[field];

    if (!confirmed)
      this.setState({ [field]: null });
    else {
      this.props.actions.clearList('bulkScheduleLog');

      if (this.state.batchScheduleConfirmed)
        this.props.actions.cancelBulkScheduling().
          then(() => this.handleXlsxRead(files[0]));
      else
        this.handleXlsxRead(files[0]);

      this.setState({ [field]: null });
      this.setState({ processingFile: true });

    }
  };

  handleXlsxRead = (file) => {
    const { actions } = this.props;

    const reader = new FileReader();

    reader.onloadstart = () => this.setState({ processingFile: true });

    reader.onload = (e) => {
      worker.postMessage(e.target.result);

      worker.onmessage = event => {
        if (event.data.payload) {
          this.setState({ processingFile: false });

          event.data.payload.length > 0
            ? actions.bulkScheduling({ schedules: event.data.payload })
              .then(() => {
                actions.getBulkScheduleQueue({ cache: false, params: { 'last-import': true, 'personCode': this.state.personCode } });
                this.setState({ currentTab: 3 });
              }) : this.resetLog();
        }
      };
    };

    reader.readAsArrayBuffer(file);
  };

  resetLog = () => {
    const { actions, handlers } = this.props;
    actions.cancelBulkScheduling()
      .then(() => {
        this.setState({ processingFile: false }, handlers.showSnackbar({ key: 'INVALID_EXCEL' }));
      });
  };

  handleConfirmBatchSchedule = (importUid) => () => {
    const { actions } = this.props;

    const payload = { importUid };

    this.props.actions.clearList('bulkScheduleLog');

    actions.confirmBulkScheduling(payload)
      .then(() => {
        actions.getBulkScheduleQueue({ cache: false, params: { 'last-import': true, 'personCode': this.state.personCode } });
      });
  };

  handleCancelBatchSchedule = () => {
    const { actions } = this.props;
    actions.cancelBulkScheduling()
      .then(() => this.fetchStatusQueue());
  };

  handleBatchScheduleChangePage = (page, rowsPerPage) => {
    const { actions } = this.props;

    this.setState({ page });

    const config = {
      cache: false,
      params: {
        '_limit': rowsPerPage,
        '_offset': page > 0 ? rowsPerPage * page : 0,
      }
    };
    actions.getBulkScheduleLog(config);
  };

  handleExportBatchScheduleLog = () => {
    const { actions, intl, classes } = this.props;

    const config = {
      params: {
        originType: 4
      }
    };

    const message = intl.formatMessage({
      id: "exports.processing_requested",
      defaultMessage: "Sua solicitação foi enviada para processamento",
      description: "Informa ao usuário que a exportação foi solicitada com sucesso",
    });

    const action = <Link to={publicPath + "downloads"} style={{ textDecoration: 'none' }}>
      <Button className={classes.snackbarAction}>
        {intl.formatMessage({
          id: "common.view_downloads",
          defaultMessage: "Ver downloads",
          description: "Rótulo comum - Ver downloads",
        })}
      </Button>
    </Link>;

    actions.exportReport(null, config).then(() => this.handlers.showSnackbar(message, action));
  };

  handleBatchSchedulingTemplateDownload = () => {
    const workbook = new Excel.Workbook();

    workbook.created = new Date();

    const worksheet = workbook.addWorksheet();

    worksheet.columns = [
      { header: 'CD_TIPO_ORIG' },
      { header: 'CD_EC_ORIG' },
      { header: 'CD_CONSULTORA' },
      { header: 'CD_TIPO_DEST' },
      { header: 'CD_EC_DEST' },
    ];

    // Iterate over all rows that have values in a worksheet
    worksheet.eachRow(function (row) {
      // Iterate over all non-null cells in a row
      row.eachCell(function (cell, colNumber) {
        const col = worksheet.getColumn(colNumber);
        if (cell.value && (!col.width || col.width < cell.value.toString().length))
          col.width = cell.value.toString().length * 1.3;
      });
    });

    workbook.xlsx.writeBuffer()
      .then(buffer => {
        FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'movimentacao-em-lote.xlsx');
      })
      .catch(error => {
        throw error;
      });
  };

  renderTabContent = (tabIndex) => {
    switch (tabIndex) {
      case 1:
        return <StructureBatchSchedulingFilter fields={this.fields} lists={this.lists} handlers={this.handlers} />;
      case 2:
        return <BatchScheduling fields={this.fields} lists={this.lists} handlers={this.handlers} />;
      case 3:
        return <Processing fields={this.fields} lists={this.lists} handlers={this.handlers} />;
      default:
        return <PersonInformation
          personCode={this.fields.personCode}
          onPersonCodeChange={this.handlePersonCodeChange}
          onEnterKeyPress={this.handleEnterKeyPress}
          selectedPerson={this.fields.selectedPerson}
        />;
    }
  };

  renderView = (tabIndex) => {
    switch (tabIndex) {
      case 1:
        return <StructureBatchSchedulingResults fields={this.fields} lists={this.lists} handlers={this.handlers} state={this.state} />;
      case 2:
        return null;
      case 3:
        return null;
      default:
        return <PersonScheduling fields={this.fields} lists={this.lists} handlers={this.handlers} />;
    }
  };

  get fields() {
    const {
      scheduling: {
        selectedPerson,
        originValues,
        destinationValues,
        origin,
        destination,
        getCycleModal,
        fields,
      }
    } = this.props;

    const { currentTab,
      cancelModal,
      personCode,
      batchScheduleImportFile,
      processingFile,
      batchScheduleConfirmed,
      page,
      rowsPerPage,
    } = this.state;

    return {
      ...fields,
      currentTab,
      personCode,
      selectedPerson,
      originValues,
      destinationValues,
      origin,
      destination,
      getCycleModal,
      cancelModal,
      batchScheduleImportFile,
      processingFile,
      batchScheduleConfirmed,
      page,
      rowsPerPage,
    };
  }

  get lists() {
    const {
      scheduling: {
        lists,
        structureLevels,
        scheduledRequests,
      }
    } = this.props;

    return {
      ...lists,
      structureLevels,
      scheduledRequests,
    };
  }

  handleGetCurrentOriginStructures = () => {
    const { actions, scheduling: { fields, selectedPerson } } = this.props;
    typeof fields.originStructureCode === 'number' && fields.originStructureCode !== '' &&
      actions.fetchHierarchyStructure(selectedPerson.structureLevelId, selectedPerson.structureCode);
  }
  handleGetCurrentDestStructures = () => {
    const { actions, scheduling: { fields } } = this.props;
    typeof fields.destStructureCode === 'number' && fields.destStructureCode !== '' &&
      actions.fetchDestHierarchyStructure(fields.destStructureLevelId, fields.destStructureCode);
  }

  get handlers() {
    return {
      ...this.props.handlers,
      handleSetField: this.props.actions.setField,

      tabChange: this.handleTabChange,
      renderTab: this.renderTabContent,
      renderView: this.renderView,
      structureChange: this.props.actions.changeDestinationStructure,
      handlePersonCodeChange: this.handlePersonCodeChange,
      handleEnterKeyPress: this.handleEnterKeyPress,
      searchByStructure: this.handleSearchByStructure,
      batchScheduleByStructure: this.handleBatchSchedulingByStructure,
      rowSelect: this.handleRowSelect,
      findLowestLevelStructure: this.handleFindLowestLevelStructure,
      handleDestinationChange: this.handleDestinationChange,
      handleCancel: this.handleCancel,
      handleCancelStructureScheduling: this.handleCancelStructureScheduling,
      handleCancelSchedule: this.handleCancelSchedule,
      handleCloseDialog: this.handleCloseDialog,
      handleScheduleValidation: this.handleScheduleValidation,
      handlePostSchedule: this.handlePostSchedule,
      handleCanSchedule: this.handleCanSchedule,
      handleSetCancelSchedule: this.handleSetCancelSchedule,
      handleDeleteSchedules: this.handleDeleteSchedules,
      handleChangeFile: this.handleChangeFile,
      handleBatchScheduleImport: this.handleBatchScheduleImport,
      handleConfirmBatchSchedule: this.handleConfirmBatchSchedule,
      handleCancelBatchSchedule: this.handleCancelBatchSchedule,
      handleBatchScheduleChangePage: this.handleBatchScheduleChangePage,
      handleExportBatchScheduleLog: this.handleExportBatchScheduleLog,
      handleBatchSchedulingTemplateDownload: this.handleBatchSchedulingTemplateDownload,
    };
  }

  render() {
    return <SchedulingView
      fields={this.fields}
      lists={this.lists}
      handlers={this.handlers}
    />;
  }
}

Scheduling.propTypes = {
  intl: intlShape,
  open: PropTypes.func,
  classes: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  selectedPerson: PropTypes.object,
  getCycleModal: PropTypes.object,
  scheduling: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    scheduling: state.scheduling
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...schedulingActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  withStyles(styles),
  injectIntl,
)(Scheduling);
