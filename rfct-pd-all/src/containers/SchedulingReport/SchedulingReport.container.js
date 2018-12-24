import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import moment from 'moment';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
import SchedulingReportSearchResults from './views/SchedulingReportSearchResults';
import TabSelect from 'Components/TabSelect/TabSelect';
import ReportByPerson from './views/ReportByPerson/ReportByPerson';
import ReportByStructure from './views/ReportByStructure/ReportByStructure';
// ACTIONS
import * as schedulingReportActions from './actions/schedulingReportActions';

const publicPath = process.env.PUBLIC_PATH;

const styles = theme => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  snackbarAction: {
    color: theme.palette.primary.complementaryColor,
  },
});

class SchedulingReport extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    currentTab: 0,
  };

  componentDidMount() {
    const { actions } = this.props;
    this.getCycles();
    actions.getHierarchyLevel();
    actions.cancelReport();
    // this.props.actions.getPlansLevels();
  }

  componentDidUpdate(prevProps) {
    const { actions, schedulingReport: { fields, lists } } = this.props;
    if (fields.queryType !== '' && fields.queryType !== prevProps.schedulingReport.fields.queryType) {
      actions.filterCycles(lists.cycles);
    }
  }

  handleChangePage = (event, page) => {
    const { rowsPerPage } = this.state;
    const { actions, schedulingReport: { fields } } = this.props;

    this.setState({ page });

    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const config = {
      cache: false,
      params: {
        'structure-code': structure.structureCode,
        'structure-level-id': structure.structureLevelId,
        'cycle': fields.cycle,
        'gp-level': fields.schedulingByGpLevel,
        '_limit': rowsPerPage,
        '_offset': page > 0 ? rowsPerPage * page : 0,
      }
    };
    fields.queryType === 0 ? actions.getRequestedReport(config) :
      fields.queryType === 1 ? actions.getProcessedReport(config) :
        actions.getInconsistenciesReport(config);
  };

  handleCanSubmit = () => {
    const { schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);
    if (structure && fields.cycle && structure.structureCode)
      return true;
  };

  handleCanSelect = () => {
    const { schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    return structure && structure.structureCode && structure.structureLevelId || fields.queryType !== '';
  }

  getCycles = () => {
    const { actions } = this.props;
    let today = moment().format('Y-MM-DD');
    const config = {
      cache: false,
      params: {
        'date-start': moment(today).subtract(1, 'year').format('Y-MM-DD'),
        'date-end': moment(today).add(1, 'year').format('Y-MM-DD'),
      },
    };
    actions.getCyclesList(config);
  }

  handleGetRequestedReport = () => {
    const { actions, handlers, schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const config = {
      cache: false,
      params: {
        'person-code': fields.personCode && fields.personCode || null,
        'structure-code': structure && structure.structureCode || null,
        'structure-level-id': structure && structure.structureLevelId || null,
        'cycle': fields.cycle || null,
        'gp-level': fields.schedulingByGpLevel,
        '_limit': this.state.rowsPerPage,
        '_offset': 0,
      }
    };
    actions.getRequestedReport(config)
      .then(res => res.value.rows.length === 0 && handlers.showSnackbar({ key: 'HISTORY_NOT_FOUND' }));
  }

  handleGetProcessedReport = () => {
    const { actions, handlers, schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const config = {
      cache: false,
      params: {
        'person-code': fields.personCode && fields.personCode || null,
        'structure-code': structure && structure.structureCode || null,
        'structure-level-id': structure && structure.structureLevelId || null,
        'cycle': fields.cycle || null,
        'gp-level': fields.schedulingByGpLevel,
        '_limit': this.state.rowsPerPage,
        '_offset': 0,
      }
    };
    actions.getProcessedReport(config)
      .then(res => res.value.rows.length === 0 && handlers.showSnackbar({ key: 'HISTORY_NOT_FOUND' }));
  }

  handleGetInconsistenciesReport = () => {
    const { actions, handlers, schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const config = {
      cache: false,
      params: {
        'person-code': fields.personCode && fields.personCode || null,
        'structure-code': structure && structure.structureCode || null,
        'structure-level-id': structure && structure.structureLevelId || null,
        'cycle': fields.cycle || null,
        'gp-level': fields.schedulingByGpLevel,
        '_limit': this.state.rowsPerPage,
        'flag-user-cancel': fields.queryType === 2 || false,
        '_offset': 0,
      }
    };
    actions.getInconsistenciesReport(config)
      .then(res => res.value.rows.length === 0 && handlers.showSnackbar({ key: 'HISTORY_NOT_FOUND' }));
  }

  handleCancelReport = () => this.props.actions.cancelReport();

  handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    this.props.actions.setField({ field, value });
  };

  handleFindLowestLevelStructure = values => {
    const list = Object.keys(values).map(key => values[key])
      .filter(current => current.structureCode && current.structureCode !== '');

    return list.length > 0 ? list[list.length - 1] : null;
  };

  handleExportRequestedReport = () => {
    const { intl, classes, actions, handlers, schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const message = intl.formatMessage({
      id: "exports.processing_requested",
      defaultMessage: "Sua solicitação foi enviada para processamento",
      description: "Informa ao usuário que a exportação foi solicitada com sucesso"
    });

    const action = <Link to={publicPath + "downloads"} style={{ textDecoration: 'none' }}>
      <Button color="secondary" size="small" className={classes.snackbarAction}>
        <FormattedMessage
          id="common.view_downloads"
          defaultMessage="Ver downloads"
          description="Rótulo comum - Ver downloads"
        />
      </Button>
    </Link>;

    const config = { cache: false, params: { 'originType': 1 } };
    const payload = {
      'personCode': fields.personCode && fields.personCode || undefined,
      'structureCode': structure && structure.structureCode || undefined,
      'structureLevelId': structure && structure.structureLevelId || undefined,
      'cycle': fields.cycle || undefined,
    };
    actions.exportReport(payload, config)
      .then(() => handlers.showSnackbar(message, action));
  };

  handleExportProcessedReport = () => {
    const { intl, classes, actions, handlers, schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const message = intl.formatMessage({
      id: "exports.processing_requested",
      defaultMessage: "Sua solicitação foi enviada para processamento",
      description: "Informa ao usuário que a exportação foi solicitada com sucesso"
    });

    const action = <Link to={publicPath + "downloads"} style={{ textDecoration: 'none' }}>
      <Button color="secondary" size="small" className={classes.snackbarAction}>
        <FormattedMessage
          id="common.view_downloads"
          defaultMessage="Ver downloads"
          description="Rótulo comum - Ver downloads"
        />
      </Button>
    </Link>;

    const config = { cache: false, params: { 'originType': 2 } };
    const payload = {
      'personCode': fields.personCode && fields.personCode || undefined,
      'structureCode': structure && structure.structureCode || undefined,
      'structureLevelId': structure && structure.structureLevelId || undefined,
      'cycle': fields.cycle || undefined,
    };
    actions.exportReport(payload, config)
      .then(() => handlers.showSnackbar(message, action));
  };

  handleExportInconsistenciesReport = () => {
    const { intl, classes, actions, handlers, schedulingReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const message = intl.formatMessage({
      id: "exports.processing_requested",
      defaultMessage: "Sua solicitação foi enviada para processamento",
      description: "Informa ao usuário que a exportação foi solicitada com sucesso"
    });

    const action = <Link to={publicPath + "downloads"} style={{ textDecoration: 'none' }}>
      <Button color="secondary" size="small" className={classes.snackbarAction}>
        <FormattedMessage
          id="common.view_downloads"
          defaultMessage="Ver downloads"
          description="Rótulo comum - Ver downloads"
        />
      </Button>
    </Link>;

    const config = { cache: false, params: { 'originType': 6 } };
    const payload = {
      'personCode': fields.personCode && fields.personCode || undefined,
      'structureCode': structure && structure.structureCode || undefined,
      'structureLevelId': structure && structure.structureLevelId || undefined,
      'cycle': fields.cycle || undefined,
      'flag-user-cancel': fields.queryType === 2 || false,
    };
    actions.exportReport(payload, config)
      .then(() => handlers.showSnackbar(message, action));
  }

  get handlers() {
    return {
      ...this.props.handlers,
      structureChange: this.props.actions.changeFilterStructure,
      fieldChange: this.handleFieldChange,
      getRequestedReport: this.handleGetRequestedReport,
      getProcessedReport: this.handleGetProcessedReport,
      getInconsistenciesReport: this.handleGetInconsistenciesReport,
      cancelReport: this.handleCancelReport,
      canSubmit: this.handleCanSubmit,
      canSelect: this.handleCanSelect,
    };
  }

  handleTabChange = (event, currentTab) => this.setState({ currentTab }, () => this.props.actions.cancelReport());

  renderTabContent = tabIndex => {
    switch (tabIndex) {
      case 1:
        return (
          <ReportByStructure
            fields={this.props.schedulingReport.fields}
            lists={this.props.schedulingReport.lists}
            handlers={this.handlers}
          />
        );
      default:
        return (
          <ReportByPerson
            fields={this.props.schedulingReport.fields}
            lists={this.props.schedulingReport.lists}
            handlers={this.handlers}
          />
        );
    }
  };

  render() {
    const { schedulingReport: { fields, lists }, classes } = this.props;
    const { rowsPerPage, page, currentTab } = this.state;

    return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
          <FormattedMessage
            id="page.scheduling_report"
            defaultMessage="Relatório de Movimentações"
            description="Título da página - Relatório de Movimentações"
          />
        </Typography>

        <TabSelect
          tabs={['Por CN', 'Por Estrutura']}
          currentTab={currentTab}
          tabContent={this.renderTabContent(currentTab)}
          tabChange={this.handleTabChange}
        />

        {lists.searchResults && lists.searchResults.length > 0 &&
          <SchedulingReportSearchResults
            data={lists.searchResults}
            queryType={fields.queryType}
            onExport={
              fields.queryType === 0 ? this.handleExportRequestedReport :
                fields.queryType === 1 ? this.handleExportProcessedReport :
                  this.handleExportInconsistenciesReport
            }
            count={fields.total}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            page={page}
            onChangePage={this.handleChangePage}
          />}
      </React.Fragment>
    );
  }
}

SchedulingReport.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape,
  actions: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  schedulingReport: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    schedulingReport: state.schedulingReport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...schedulingReportActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  withStyles(styles),
  injectIntl,
)(SchedulingReport);
