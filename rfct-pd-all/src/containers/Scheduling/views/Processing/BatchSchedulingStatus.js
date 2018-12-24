import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  defineMessages, injectIntl, intlShape,
  // FormattedMessage
} from 'react-intl';
import _ from "lodash";
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// MATERIAL UI ICONS
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Assignment from '@material-ui/icons/Assignment';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
// CUSTOM COMPONENTS
import EnhancedTable from 'Components/EnhancedTable/EnhancedTable';
import ActionDialog from 'Components/ActionDialog/index';
import apiErrors from 'Containers/SnackbarMessages/messages/apiErrors';
import formatDate from 'Utils/formatDate';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  cardHeader: {
    background: theme.palette.background.default,
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeaderTypography: {
    alignItems: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    fontSize: theme.typography.pxToRem(15),
    '& > svg': {
      marginRight: theme.spacing.unit,
    },
    textTransform: 'uppercase',
  },
  cardHeaderTypographyWithInconsistency: {
    alignItems: 'center',
    color: theme.palette.secondary.main,
    display: 'flex',
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    '& > svg': {
      marginRight: theme.spacing.unit,
    },
  },
  cardHeaderAction: {
    marginTop: 0,
  },
  cardContentRoot: {
    paddingLeft: 1,
    paddingRight: 1,
  },
  cardActionsRoot: {
    justifyContent: 'space-between',
    paddingLeft: 1,
    paddingRight: 1,
  },
  cardActionsAction: {
    margin: 0,
  },
});

const generalStatus = defineMessages({
  'complete': {
    id: 'message.completed',
    defaultMessage: 'Processamento finalizado sem erros',
    description: 'Mensagem de processo finalizado sem erros',
  },
  'incomplete': {
    id: 'message.processing',
    defaultMessage: 'Processo em andamento',
    description: 'Mensagem de processo em andamento',
  },
  'with_inconsistencies': {
    id: 'message.quantity_inconsistencies',
    defaultMessage: 'Foram encontradas {qty} inconsistências',
    description: 'Mensagem informando a quantidade de inconsistências',
  },
});

class BatchSchedulingStatus extends PureComponent {
  state = {
    expanded: true,
    openBatchScheduleConfirmationModal: false,
    openCancelBatchScheduleModal: false,
  };

  handleChange = () => this.setState({ expanded: !this.state.expanded });

  handleExportLog = () => this.props.handlers.handleExportBatchScheduleLog();

  handleConfirmBatchSchedule = (confirmed) => (event) => {
    const { lists } = this.props;
    const importUid = lists.bulkScheduleQueue &&
      lists.bulkScheduleQueue.length > 0 &&
      lists.bulkScheduleQueue[0].importUid;

    if (confirmed && importUid) {
      this.props.handlers.handleConfirmBatchSchedule(importUid)(event);
      this.setState({ openBatchScheduleConfirmationModal: false });
    } else
      this.setState({ openBatchScheduleConfirmationModal: !this.state.openBatchScheduleConfirmationModal });
  };

  handleCancelBatchSchedule = (confirmed) => () => {
    if (confirmed)
      this.props.handlers.handleCancelBatchSchedule();

    this.setState({ openCancelBatchScheduleModal: !this.state.openCancelBatchScheduleModal });
  };

  getCardHeaderTitle = (total, isProcessing) => {
    const { intl, classes } = this.props;

    if (isProcessing)
      return intl.formatMessage(generalStatus.incomplete);
    else if (!isProcessing && total === 0)
      return <Typography className={classes.cardHeaderTypography}>
        {intl.formatMessage(generalStatus.complete)}
      </Typography>;
    else if (!isProcessing && total > 0)
      return <React.Fragment>
        <ErrorOutline /><span>{intl.formatMessage(generalStatus.with_inconsistencies, { qty: total })}</span>
      </React.Fragment>;
  };

  getCardHeaderClasses = (hasData) => {
    const { classes } = this.props;
    const defaultClasses = {
      root: classes.cardHeader,
      action: classes.cardHeaderAction,
      title: classes.cardHeaderTypography
    };
    return hasData ? { ...defaultClasses, title: classes.cardHeaderTypographyWithInconsistency } : defaultClasses;
  };

  render() {
    const { classes, intl, fields, lists, handlers } = this.props;
    const { expanded } = this.state;

    const hasData = _.has(lists, 'bulkScheduleLog.rows') && lists.bulkScheduleLog.rows.length > 0;

    const blockSubmit = !lists.bulkScheduleQueue[0].isCompleted || !lists.bulkScheduleQueue[0].status.some(item => item.status === 3);

    const columns = hasData && Object.keys(lists.bulkScheduleLog.rows[0]).map(item => {
      switch (item) {
        case 'schedulingImportUid':
          return {
            id: 'schedulingImportUid',
            mapKey: `EnhancedTableHead_#0`,
            rowKey: true,
            hidden: true,
          };
        case 'personCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#1`,
            label: intl.formatMessage({
              id: "labels.table.header.person_code",
              defaultMessage: "Código CN",
              description: "Rótulo de coluna de tabela - Código CN",
            }),
            order: 0,
          };
        case 'validationHistory':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#2`,
            label: intl.formatMessage({
              id: "labels.table.header.inconsistency_type",
              defaultMessage: "Tipo de inconsistência",
              description: "Rótulo de coluna de tabela - Tipo de inconsistência",
            }),
            order: 1,
          };
        case 'originStructureCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#3`,
            label: intl.formatMessage({
              id: "common.origin",
              defaultMessage: "Origem",
              description: "Rótulo comum - Origem",
            }),
            order: 2,
          };
        case 'destinationStructureCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#4`,
            label: intl.formatMessage({
              id: "labels.table.header.destination",
              defaultMessage: "Destino",
              description: "Rótulo de coluna de tabela - Destino",
            }),
            order: 3,
          };
        case 'createdAt':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#5`,
            label: intl.formatMessage({
              id: "labels.table.header.createdAt",
              defaultMessage: "Data da criação",
              description: "Rótulo de coluna de tabela - Data da criação",
            }),
            order: 4,
          };
        default:
          return null;
      }
    }).filter(Boolean);

    const columnsOrder = columns && _.orderBy(columns, ['order']).map(col => col.id);

    const pickedData = hasData && lists.bulkScheduleLog.rows;

    const tableData = (hasData && _.cloneDeep(pickedData).map((item) => {
      let newItem = {};

      Object.keys(item).forEach(key => {
        switch (key) {
          case 'destinationStructureCode':
            return newItem[key] = `${item[key]} - ${item.destinationStructureName || intl.formatMessage(apiErrors['STRUCTURE_NOT_FOUND'])}`;
          case 'originStructureCode':
            return newItem[key] = `${item[key]} - ${item.originStructureName || intl.formatMessage(apiErrors['STRUCTURE_NOT_FOUND'])}`;
          case 'validationHistory':
            return newItem[key] = (apiErrors[item[key]] && intl.formatMessage(apiErrors[item[key]])) ||
              intl.formatMessage(apiErrors['UNKNOWN']);
          case 'createdAt':
            return newItem[key] = formatDate(item[key]);
          default:
            return newItem[key] = item[key];
        }
      });

      return newItem;
    })) || [];

    return (
      <Card elevation={0} classes={{ root: classes.root }}>
        <CardHeader
          style={{ paddingTop: '8px', paddingBottom: '8px' }}
          classes={this.getCardHeaderClasses(hasData)}
          title={this.getCardHeaderTitle(lists.bulkScheduleLog.total, false)}
          action={<React.Fragment>
            <IconButton onClick={this.handleChange}>
              {expanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <IconButton disabled={lists.bulkScheduleLog && lists.bulkScheduleLog.total === 0} onClick={this.handleExportLog}>
              <Assignment />
            </IconButton>
          </React.Fragment>}
        />
        <Collapse in={expanded}>
          {tableData && tableData.length > 0 &&
            <CardContent classes={{ root: classes.cardContentRoot }}>
              <EnhancedTable
                data={tableData}
                total={(lists.bulkScheduleLog && lists.bulkScheduleLog.total) || 0}
                columns={columns}
                columnsOrder={columnsOrder}
                toolbar={false}
                selectable={false}
                onChangePage={handlers.handleBatchScheduleChangePage}
                serverPaging={true}
                page={fields.page}
                rowsPerPage={fields.rowsPerPage}
              />
            </CardContent>}

          <CardActions classes={{ root: classes.cardActionsRoot, action: classes.cardActionsAction }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleConfirmBatchSchedule(false)}
              disabled={blockSubmit}
            >{intl.formatMessage({
              id: 'actions.schedule',
              defaultMessage: 'Efetivar Agendamento',
              description: 'Rótulo de ação - Agendar'
            })}
            </Button>

            <ActionDialog
              open={this.state.openBatchScheduleConfirmationModal}
              iconType="info"
              title={intl.formatMessage({
                id: "scheduling.batch.schedule_for_valid_entries.title",
                defaultMessage: "Agendar movimentação",
                description: "Título do modal - Agendar movimentação"
              })}
              desc={intl.formatMessage({
                id: "scheduling.batch.schedule_for_valid_entries",
                defaultMessage: "Apenas os agendamentos sem inconsistências serão realizados. Deseja continuar?",
                description: "Confirmação para realizar agendamentos"
              })}
              confirmMode
              onCancel={this.handleConfirmBatchSchedule(false)}
              onConfirm={this.handleConfirmBatchSchedule(true)}
            />
          </CardActions>

        </Collapse>
      </Card>
    );
  }
}

BatchSchedulingStatus.propTypes = {
  classes: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  intl: intlShape,
  lists: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(BatchSchedulingStatus));
