import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  cardHeaderTypography: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

const queueStatuses = defineMessages({
  1: {
    id: 'scheduling.batch.queue.status.validation_pending',
    defaultMessage: 'Validação pendente',
    description: 'Status de processamento do arquivo de agendamento em lote - Validação pendente'
  },
  2: {
    id: 'scheduling.batch.queue.status.validation_progress',
    defaultMessage: 'Validação em progresso',
    description: 'Status de processamento do arquivo de agendamento em lote - Validação em progresso'
  },
  3: {
    id: 'scheduling.batch.queue.status.validation_completed',
    defaultMessage: 'Validação completada',
    description: 'Status de processamento do arquivo de agendamento em lote - Validação completada'
  },
  4: {
    id: 'scheduling.batch.queue.status.validation_error',
    defaultMessage: 'Erro na validação',
    description: 'Status de processamento do arquivo de agendamento em lote - Erro na validação'
  },
  5: {
    id: 'scheduling.batch.queue.status.confirm_pending',
    defaultMessage: 'Confirmação pendente',
    description: 'Status de processamento do arquivo de agendamento em lote - Confirmação pendente'
  },
  6: {
    id: 'scheduling.batch.queue.status.confirm_progress',
    defaultMessage: 'Confirmação em progresso',
    description: 'Status de processamento do arquivo de agendamento em lote - Confirmação em progresso'
  },
  7: {
    id: 'scheduling.batch.queue.status.confirm_completed',
    defaultMessage: 'Confirmação completada',
    description: 'Status de processamento do arquivo de agendamento em lote - Confirmação completada'
  },
  8: {
    id: 'scheduling.batch.queue.status.confirm_error',
    defaultMessage: 'Erro na confirmação',
    description: 'Status de processamento do arquivo de agendamento em lote - Erro na confirmação'
  }
});

const generalStatus = defineMessages({
  'complete': {
    id: 'scheduling.batch.queue.status.completed',
    defaultMessage: 'Processamento finalizado',
    description: 'Status de processamento do arquivo de agendamento em lote - Processamento finalizado'
  },
  'incomplete': {
    id: 'scheduling.batch.queue.status.incomplete',
    defaultMessage: 'Processamento em andamento',
    description: 'Status de processamento do arquivo de agendamento em lote - Processamento em andamento'
  }
});

class BatchSchedulingQueue extends PureComponent {
  state = {
    expanded: true
  };

  handleChange = panel => (event, expanded) => this.setState({ expanded: expanded ? panel : false });

  handleConfirmBatchSchedule = (event) => {
    const { lists } = this.props;
    const importUid = lists.bulkScheduleQueue &&
      lists.bulkScheduleQueue.length > 0 &&
      lists.bulkScheduleQueue[0].importUid;

    if (importUid)
      this.props.handlers.handleConfirmBatchSchedule(importUid)(event);
  };

  render() {
    const { classes, lists, intl } = this.props;
    const { expanded } = this.state;

    return (
      <React.Fragment>
        {lists.bulkScheduleQueue &&
          lists.bulkScheduleQueue.map((item, index) => {
            return <ExpansionPanel
              key={`bulk_schedule_queue_#${index}`}
              expanded={expanded === `queue_panel_${index}`}
              onChange={this.handleChange(`queue_panel_${index}`)}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>#{index}</Typography>
                <Typography className={classes.cardHeaderTypography}>
                  {item.isCompleted ?
                    intl.formatMessage(generalStatus.complete) : intl.formatMessage(generalStatus.incomplete)}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  {Object.keys(queueStatuses).map((statusKey, index) => {
                    const status = item.status.filter(s => s.status === parseInt(statusKey)).pop();
                    return <Grid item md={3} key={`queue_status_#${index}`}>
                      <Typography>
                        {`${intl.formatMessage(queueStatuses[statusKey])}: ${status ? status.quantity : 0}`}
                      </Typography>
                    </Grid>;
                  })}
                </Grid>
              </ExpansionPanelDetails>
              {item.isCompleted &&
                <React.Fragment>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleConfirmBatchSchedule}
                    >{intl.formatMessage({
                      id: 'common.confirm',
                      defaultMessage: 'Confirmar',
                      description: 'Rótulo comum - Confirmar'
                    })}
                    </Button>
                  </ExpansionPanelActions>
                </React.Fragment>}
            </ExpansionPanel>;
          })}
      </React.Fragment>
    );
  }
}

BatchSchedulingQueue.propTypes = {
  classes: PropTypes.object,
  handlers: PropTypes.object,
  intl: intlShape,
  lists: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(BatchSchedulingQueue));
