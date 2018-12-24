import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// CUSTOM COMPONENTS
import ActionDialog from 'Components/ActionDialog/index';
import CardTemplate from 'Components/common/templates/CardTemplate';

import formatDate from 'Utils/formatDate';

const styles = theme => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    display: 'flex',
    padding: theme.spacing.unit * 2,
    width: '100%',
    margin: 0,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    justifyContent: 'space-between',
    '& > div': {
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
    },
    '& button': {
      flex: '0 0 auto',
    },
  },
  typography: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  progressLoader: {
    margin: theme.spacing.unit * 2,
  },
});

class SearchDoneView extends PureComponent {

  state = {
    openCancelBatchScheduleModal: false
  };

  handleCancelBatchSchedule = (confirmed) => () => {
    if (confirmed)
      this.props.handlers.handleCancelBatchSchedule();

    this.setState({ openCancelBatchScheduleModal: !this.state.openCancelBatchScheduleModal });
  };

  render() {
    const { classes, intl } = this.props;

    return (
      <CardTemplate>
        <Paper elevation={0} classes={{ root: classes.root }}>
          <div style={{ padding: '0.3rem 0' }}>
            <Typography className={classes.typography}>
              {intl.formatMessage({
                id: "actions.processing_associate",
                defaultMessage: "Pesquisa concluída em: ",
                description: "Rótulo de ação - Pesquisa concluída em: "
              })}
              {formatDate(new Date())}
            </Typography>
          </div>
          <Button onClick={this.handleCancelBatchSchedule(false)}>
            {intl.formatMessage({
              id: 'common.clear',
              defaultMessage: 'Limpar',
              description: 'Rótulo comum - Limpar'
            })}
          </Button>
          <ActionDialog
            open={this.state.openCancelBatchScheduleModal}
            iconType="info"
            title={intl.formatMessage({
              id: "scheduling.batch.cancel_batch_associate.title",
              defaultMessage: "cancelar importação",
              description: "Título do modal - cancelar importação"
            })}
            desc={intl.formatMessage({
              id: "scheduling.batch.cancel_batch_schedule",
              defaultMessage: "Podem haver processamentos já efetuados. Deseja continuar?",
              description: "Confirmação para excluir importação de agendamentos mais recente"
            })}
            confirmMode
            onCancel={this.handleCancelBatchSchedule(false)}
            onConfirm={this.handleCancelBatchSchedule(true)}
          />
        </Paper>
      </CardTemplate>
    );
  }
}

SearchDoneView.propTypes = {
  classes: PropTypes.object,
  handlers: PropTypes.object,
  intl: intlShape,
};

export default withStyles(styles)(injectIntl(SearchDoneView));
