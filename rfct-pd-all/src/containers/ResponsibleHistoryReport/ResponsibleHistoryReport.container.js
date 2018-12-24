import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import _ from 'lodash';
// HIGH ORDER COMPONENTS
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
// MATERIAL UI COMPONENTS
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import ResponsibleReportSearchResults from './views/ResponsibleReportSearchResults';
import ResponsibleReportSearchFilter from './views/ResponsibleReportSearchFilter';
// ACTIONS
import * as responsibleHistoryReportActions from './actions/responsibleHistoryReportActions';

const publicPath = process.env.PUBLIC_PATH;

const styles = theme => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 4,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  formItem: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 5,
  },
  snackbarAction: {
    color: theme.palette.primary.complementaryColor,
  },
});

class ResponsibleHistoryReport extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.getHierarchyLevel();
    actions.cancelReport();
  }

  componentWillReceiveProps(nextProps) {
    const { responsibleHistoryReport: { fields: nextFields } } = nextProps;
    const { actions, responsibleHistoryReport: { fields: thisFields } } = this.props;
    if (!_.isEqual(nextFields.structureFilterValues, thisFields.structureFilterValues)) {
      actions.resetResults();
    }
  }

  handleFindLowestLevelStructure = values => {
    const list = Object.keys(values).map(key => values[key])
      .filter(current => current.structureCode && current.structureCode !== '');

    return list.length > 0 ? list[list.length - 1] : null;
  };

  handleGetResponsibleReport = () => {
    const { actions, handlers, responsibleHistoryReport: { fields } } = this.props;

    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);

    const config = {
      cache: false,
      params: {
        'structure-code': structure.structureCode,
        'structure-level-id': structure.structureLevelId,
      }
    };

    actions.getResponsibleReport(config)
      .then(res => res.value.rows.length === 0 && handlers.showSnackbar({ key: 'HISTORY_NOT_FOUND' }));
  }

  handleExportReport = () => {
    const { intl, classes, actions, handlers, responsibleHistoryReport: { fields } } = this.props;
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

    const config = {
      cache: false,
      params: {
        'originType': 3
      }
    };
    const payload = {
      'structureCode': structure.structureCode,
      'structureLevelId': structure.structureLevelId,
    };
    actions.exportReport(payload, config)
      .then(() => handlers.showSnackbar(message, action));
  };

  handleCanSubmit = () => {
    const { responsibleHistoryReport: { fields } } = this.props;
    const structure = this.handleFindLowestLevelStructure(fields.structureFilterValues);
    return structure && structure.hasLeadership;
  };

  get handlers() {
    return {
      ...this.props.handlers,
      structureChange: this.props.actions.changeFilterStructure,
      findLowestLevelStructure: this.handleFindLowestLevelStructure,
      getResponsibleReport: this.handleGetResponsibleReport,
      canSubmit: this.handleCanSubmit,
      cancelReport: this.handleCancelReport,
    };
  }

  handleCancelReport = () => this.props.actions.cancelReport();

  render() {
    const { responsibleHistoryReport: { fields, lists }, classes } = this.props;

    return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
          <FormattedMessage
            id="page.responsible_report"
            defaultMessage="Relatório de Vigência de Responsável"
            description="Título da página - Relatório de Vigência de Responsável"
          />
        </Typography>
        <Card>
          <ResponsibleReportSearchFilter
            fields={fields}
            lists={lists}
            handlers={this.handlers}
          />
        </Card>
        {lists.searchResults.length > 0 &&
          <ResponsibleReportSearchResults
            data={lists.searchResults}
            onExport={this.handleExportReport}
          />}
      </React.Fragment>
    );
  }
}

ResponsibleHistoryReport.propTypes = {
  intl: intlShape,
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  responsibleHistoryReport: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    responsibleHistoryReport: state.responsibleHistoryReport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...responsibleHistoryReportActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  withStyles(styles),
  injectIntl,
)(ResponsibleHistoryReport);
