import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import Excel from 'exceljs/dist/exceljs';
import FileSaver from 'file-saver';
import { Link } from 'react-router';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// VIEWS
import ChangeByType from './views/ChangeByType';
// CUSTOM COMPONENTS
import BulkReactivateByFile from './views/BulkReactivateByFile';
import BulkReactivateByStructure from './views/BulkReactivateByStructure';
import Processing from './views/Processing/Processing';
import CardTemplate from 'Components/common/templates/CardTemplate';
import withMessages from 'Components/HighOrderComponents/withMessages';
import withHandlers from 'Components/HighOrderComponents/withHandlers';
// ACTIONS
import * as bulkRelationshipActions from './actions/bulkRelationshipStatusActions';

const publicPath = process.env.PUBLIC_PATH;

const worker = new Worker();
import Worker from 'worker-loader!Utils/bulkReactivate.worker';

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
  snackbarAction: {
    color: theme.palette.primary.complementaryColor,
  },
});

class BulkRelationshipStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      processingFile: false,
      bulkReactivateImportFile: null,
      getBulkReactivateLogFile: false,
      bulkReactivateConfirmed: false,
      selectedStructures: [],
      selectedParentStructure: '',
      page: 0,
      searchPage: 0,
      rowsPerPage: 10,
      selectedDate: '',
    };
    this.timer = null;
  }

  componentDidMount() {
    this.fetchStatusQueue();
    this.handleGetClosingDates();
  }

  componentWillUnmount() {
    const { actions } = this.props;

    clearInterval(this.timer);
    actions.clearAll();
  }

  componentDidUpdate(prevProps) {
    const { bulkRelationshipStatus: { lists: prevLists, fields: prevFields } } = prevProps;
    const { bulkRelationshipStatus: { lists: thisLists, fields: thisFields } } = this.props;

    if (thisFields.selectedDate && prevFields.selectedDate !== thisFields.selectedDate) {
      this.props.actions.clearList('parentStructures');
    }

    if (!_.isEqual(prevLists.bulkReactivateQueue, thisLists.bulkReactivateQueue)) {
      if (Array.isArray(thisLists.bulkReactivateQueue) && thisLists.bulkReactivateQueue.length > 0) {
        const latestQueue = thisLists.bulkReactivateQueue[0];

        if (latestQueue && latestQueue.isCompleted && latestQueue.status.some(item => item.status === 3)) {
          this.setState({ bulkReactivateConfirmed: true });
        } else {
          this.setState({
            processingFile: !latestQueue.isCompleted,
            bulkReactivateConfirmed: false,
          });

          if (latestQueue.isCompleted) {
            clearInterval(this.timer);

          } else if (
            !this.state.processingFile && !latestQueue.isCompleted
          ) {
            clearInterval(this.timer);
            this.timer = setInterval(() => this.fetchStatusQueue(), 10000);
          }
        }

        if (!thisLists.bulkReactivateLog)
          this.handleConfirmBulkReactivate(latestQueue.importUid);

      } else {
        clearInterval(this.timer);
        this.setState({ processingFile: false });
      }
    }

    if (!_.isEqual(prevFields.selectedParentStructure, thisFields.selectedParentStructure)) {
      this.props.actions.setField({ field: 'selectedStructures', value: [], overwrite: true });
    }
  }

  fetchStatusQueue = () => {
    this.props.actions.getBulkReactivateQueue({ cache: false, params: { 'last-import': true } })
      .then(res => {
        if (!res.value || (res.value && res.value.length === 0)) {
          clearInterval(this.timer);
        } else if (res.value && res.value.length > 0 && res.value[0].isCompleted) {
          clearInterval(this.timer);
          this.props.actions.getBulkReactivateLog({
            cache: false,
            params: {
              '_limit': 10,
              '_offset': 0,
            },
          });
        }
      })
      .catch(() => clearInterval(this.timer));
  }

  handleClearStates = () => {
    this.props.actions.clearList('bulkReactivateLog');
    this.props.actions.clearList('bulkReactivateQueue');
    this.props.actions.clearList('structuresByDate');
    this.props.actions.setField({ field: 'selectedStructures', value: [], overwrite: true });
    this.setState({ selectedDate: '' });
  }

  handleTabChange = (page, currentTab) => {
    this.setState({ currentTab }, () => this.handleClearStates());

    if (currentTab === 2) {
      this.fetchStatusQueue();
      clearInterval(this.timer);
      this.timer = setInterval(() => this.fetchStatusQueue(), 10000);
    } else if (currentTab !== 2 || !this.state.processingFile) {
      clearInterval(this.timer);
    }
  };

  handleRowSelect = field => payload => this.props.actions.setField({ field, value: payload, overwrite: true });

  handleBulkReactivate = () => {
    const { actions, bulkRelationshipStatus: { fields } } = this.props;

    const personCodes = fields.personCodes.map(person => ({ personCode: person }));

    actions.bulkReactivate(personCodes)
      .then(() => this.handleImportByStructureSuccess());
  };

  handleChangeFile = field => event => this.setState({ [field]: event.target.files });

  handleBulkReactivateImport = (field, confirmed) => () => {
    const files = this.state[field];

    if (!confirmed)
      this.setState({ [field]: null });
    else {
      this.props.actions.clearList('bulkReactivateLog');
      this.handleXlsxRead(files[0]);
      this.setState({ [field]: null });
      this.setState({ processingFile: true });
    }
  };

  handleBulkReactivateSelected = () => {
    if (this.fields.selectedStructures.length > 0) {
      const structureKeys = this.fields.selectedStructures.map(key => {
        const keys = key.split('_');
        return {
          structureLevelId: Number(keys[0]),
          structureCode: Number(keys[1])
        };
      });

      const structures = this.lists.structuresByDate
        .filter(s => structureKeys.some(sk =>
          sk.structureLevelId === s.structureLevelId &&
          sk.structureCode === s.structureCode))
        .map(s => ({
          structureCode: s.structureCode,
          structureLevelId: s.structureLevelId,
          cycleCode: s.cycle
        }));

      this.props.actions.bulkReactivateStructures({
        selectedDate: this.fields.selectedDate, structures
      }).then(() => {
        this.handleTabChange(undefined, 2);
        this.setState({ processingFile: true });
      });
    }
  };

  handleXlsxRead = file => {
    const { actions } = this.props;

    const reader = new FileReader();

    reader.onloadstart = () => this.setState({ processingFile: true });

    reader.onload = (e) => {
      worker.postMessage(e.target.result);

      worker.onmessage = event => {
        if (event.data.payload) {
          this.setState({ processingFile: false });

          event.data.payload.length > 0 ?
            actions.bulkReactivate({ reactivates: event.data.payload })
              .then(() => {
                this.handleTabChange(undefined, 2);
              }) : this.resetLog();
        }
      };
    };

    reader.readAsArrayBuffer(file);
  };

  resetLog = () => {
    const { actions, handlers } = this.props;
    actions.cancelBulkReactivate().then(() => {
      handlers.showSnackbar({ key: 'INVALID_EXCEL' });
      this.setState({ processingFile: false });
    });
  }

  handleCancelBulkReactivate = () => {
    const { actions } = this.props;
    actions.cancelBulkReactivate().then(() => this.fetchStatusQueue());
  };

  handleBatchReactivateChangePage = (page, rowsPerPage) => {
    const { actions } = this.props;

    this.setState({ page });

    const config = {
      cache: false,
      params: {
        '_limit': rowsPerPage,
        '_offset': page > 0 ? rowsPerPage * page : 0,
      }
    };
    actions.getBulkReactivateLog(config);
  };

  handleExportBatchReactivateLog = () => {
    const { actions, intl, classes } = this.props;

    const config = {
      params: {
        originType: 5,
      },
    };

    const message = intl.formatMessage({
      id: "exports.processing_requested",
      defaultMessage: "Sua solicitação foi enviada para processamento",
      description: "Informa ao usuário que a exportação foi solicitada com sucesso"
    });

    const action = <Link to={publicPath + "downloads"} style={{ textDecoration: 'none' }}>
      <Button className={classes.snackbarAction}>
        {intl.formatMessage({
          id: "common.view_downloads",
          defaultMessage: "Ver downloads",
          description: "Rótulo comum - Ver downloads"
        })}
      </Button>
    </Link>;

    actions.exportReport(null, config).then(() => this.handlers.showSnackbar(message, action));
  };

  handleBatchReactivateTemplateDownload = () => {
    const workbook = new Excel.Workbook();

    workbook.created = new Date();

    const worksheet = workbook.addWorksheet();

    worksheet.columns = [
      { header: 'CD_CONSULTORA' }
    ];

    // Iterate over all rows that have values in a worksheet
    worksheet.eachRow(function(row) {
      // Iterate over all non-null cells in a row
      row.eachCell(function(cell, colNumber) {
        const col = worksheet.getColumn(colNumber);
        if (cell.value && (!col.width || col.width < cell.value.toString().length))
          col.width = cell.value.toString().length * 1.3;
      });
    });

    workbook.xlsx.writeBuffer()
      .then(buffer => {
        FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'reativacao-em-lote.xlsx');
      })
      .catch(error => {
        throw error;
      });
  };

  handleSearchStructuresByDate = () => {
    this.setState({ searchPage: 0 }, () => {
      const { selectedDate } = this.state;
      this.props.actions.getStructuresByDate({
        'date': selectedDate,
      });
    });
  }

  handleFieldChange = field => event => {
    const value = event.target.value;
    this.props.actions.setField({ field, value });
  };

  handleDateChange = event => {
    this.setState({ selectedDate: event.target.value });
    this.props.actions.setField({ field: 'selectedDate', value: event.target.value });
  }

  handleGetClosingDates() {
    let today = moment().format('YYYY-MM-DD');
    let dateSubtract = moment().subtract(45, 'day').format('YYYY-MM-DD');

    const config = {
      cache: false,
      params: {
        'date-end': today,
        'date-start': dateSubtract,
      },
    };

    this.props.actions.getClosingDates(config);
  }

  handleCancelReactivateByStructure = () => {
    this.props.actions.clearReactivateByStructure();
    this.setState({ selectedDate: "" });
  }

  get fields() {
    const { bulkRelationshipStatus: { fields } } = this.props;

    const {
      currentTab,
      selectedDate,
      bulkReactivateImportFile,
      processingFile,
      bulkReactivateConfirmed,
      page,
      searchPage,
      rowsPerPage,
    } = this.state;

    return {
      ...fields,
      selectedDate,
      searchPage,
      currentTab,
      bulkReactivateImportFile,
      processingFile,
      bulkReactivateConfirmed,
      page,
      rowsPerPage,
    };
  }

  get lists() {
    const { bulkRelationshipStatus: { lists } } = this.props;

    return {
      ...lists,
    };
  }

  get handlers() {
    return {
      ...this.props.handlers,
      tabChange: this.handleTabChange,
      renderTab: this.renderTabContent,
      rowSelect: this.handleRowSelect,
      handleCloseDialog: this.handleCloseDialog,
      handleChangeFile: this.handleChangeFile,
      handleBulkReactivateImport: this.handleBulkReactivateImport,
      handleCancelBulkReactivate: this.handleCancelBulkReactivate,
      handleBatchReactivateChangePage: this.handleBatchReactivateChangePage,
      handleExportBatchReactivateLog: this.handleExportBatchReactivateLog,
      handleBatchReactivateTemplateDownload: this.handleBatchReactivateTemplateDownload,
      handleSearchStructuresByDate: this.handleSearchStructuresByDate,
      handleDateChange: this.handleDateChange,
      handleSearchStructuresChangePage: this.handleSearchStructuresChangePage,
      handleBulkReactivateSelected: this.handleBulkReactivateSelected,
      handleBulkReactivateAll: this.handleBulkReactivateAll,
      handleParentStructureChange: this.handleFieldChange,
      handleCancelReactivateByStructure: this.handleCancelReactivateByStructure,
    };
  }

  renderTab = (tabIndex) => {
    switch (tabIndex) {
      case 2:
        return <Processing fields={this.fields} lists={this.lists} handlers={this.handlers} />;
      case 1:
        return <BulkReactivateByFile fields={this.fields} lists={this.lists} handlers={this.handlers} state={this.state} />;
      default:
        return <BulkReactivateByStructure fields={this.fields} lists={this.lists} handlers={this.handlers} />;
    }
  }

  isCompleted() {
    const { bulkRelationshipStatus: { lists } } = this.props;

    return lists.bulkReactivateQueue !== null &&
      ((lists.bulkReactivateQueue.length > 0 && lists.bulkReactivateQueue[0].isCompleted) ||
        lists.bulkReactivateQueue.length === 0);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
          <FormattedMessage
            id="page.bulk_reactivate"
            defaultMessage="Reativação em Lote"
            description="Título da página - Reativação em Lote"
          />
        </Typography>
        <CardTemplate>
          <ChangeByType
            currentTab={this.fields.currentTab}
            tabContent={this.renderTab(this.fields.currentTab)}
            handlers={this.handlers}
            disabledTab={!this.isCompleted()}
          />
        </CardTemplate>
      </React.Fragment>
    );
  }
}

BulkRelationshipStatus.propTypes = {
  intl: intlShape,
  open: PropTypes.func,
  classes: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  getCycleModal: PropTypes.object,
  bulkRelationshipStatus: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    bulkRelationshipStatus: state.bulkRelationshipStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...bulkRelationshipActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  withStyles(styles),
  injectIntl,
)(BulkRelationshipStatus);
