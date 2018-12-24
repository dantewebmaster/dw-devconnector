import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
// VIEWS
import ChangeByType from './ChangeByType';
import NotFound from 'Components/NotFound';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';

const SchedulingView = ({ fields, lists, handlers }) => {

  const disabledTab = lists.bulkScheduleQueue !== null &&
    ((lists.bulkScheduleQueue.length > 0 && lists.bulkScheduleQueue[0].isCompleted) ||
      lists.bulkScheduleQueue.length === 0);

  return (
    <React.Fragment>
      <Typography variant="subtitle1" component="h1" style={{ padding: '0 0 1.5rem' }}>
        <FormattedMessage
          id="page.scheduling"
          defaultMessage="Agendamentos"
          description="Título da página - Agendamentos"
        />
      </Typography>

      <Card style={{ overflow: 'visible', marginBottom: '16px' }}>
        <ChangeByType
          currentTab={fields.currentTab}
          tabContent={handlers.renderTab(fields.currentTab)}
          handlers={handlers}
          disabledTab={!disabledTab}
        />
      </Card>

      {handlers.renderView(fields.currentTab)}

      {isEmptyObject(fields.originValues) && !isEmptyObject(fields.selectedPerson) &&
        <NotFound
          buttonAction={handlers.handleCancel}
          text={<FormattedMessage
            id="message.structure_not_found"
            defaultMessage="Pessoa não possui estrutura associada"
            description="Mensagem quando não encontrar estrutura"
          />}
          buttonLabel={<FormattedMessage
            id="common.new_search"
            defaultMessage="Nova Pesquisa"
            description="Rótulo do botão - Nova Pesquisa"
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
  isCompleted: PropTypes.bool,
};

export default SchedulingView;
