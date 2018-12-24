import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// VIEWS
import ChangeByType from './ChangeByType';
import Card from '@material-ui/core/Card';
import NotFound from 'Components/NotFound';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';

const styles = () => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  content: {
    flexGrow: 1,
  },
});

const SchedulingView = ({ fields, lists, handlers, classes }) => {
  return (
    <React.Fragment>
      <Typography variant="subtitle1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.scheduling_cancel"
          defaultMessage="Cancelar Agendamentos"
          description="Título da página - Cancelar Agendamentos"
        />
      </Typography>
      <Card>
        <div className={classes.content}>
          <ChangeByType
            currentTab={fields.currentTab}
            tabContent={handlers.renderTab(fields.currentTab)}
            handlers={handlers}
          />
          {handlers.renderView(fields.currentTab)}
        </div>
      </Card>

      {isEmptyObject(lists.scheduledRequests)
        && !isEmptyObject(fields.selectedPerson)
        && fields.currentTab !== 1 &&
        <NotFound
          buttonAction={handlers.handleCancel}
          text={<FormattedMessage
            id="message.scheduling_not_found"
            defaultMessage="Pessoa não possui agendamentos"
            description="Mensagem quando não encontrar agendamentos"
          />}
          buttonLabel={<FormattedMessage
            id="common.new_search"
            defaultMessage="Nova Pesquisa"
            description="Rótulo comum - Nova pesquisa"
          />}
        />}
    </React.Fragment>
  );
};

SchedulingView.propTypes = {
  classes: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
};

export default withStyles(styles)(SchedulingView);
