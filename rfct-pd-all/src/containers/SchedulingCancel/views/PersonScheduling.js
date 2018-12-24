import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// CUSTOM COMPONENTS
import SchedulingList from './SchedulingList';
import SchedulingActions from './SchedulingActions';
import ActionDialog from 'Components/ActionDialog';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';

const personScheduling = ({ fields, lists, handlers, state }) => {
  return <React.Fragment>
    {!isEmptyObject(fields.selectedPerson) &&
      <SchedulingList
        disableCancel={!handlers.hasAccess('scheduling/cancel')}
        scheduledRequests={lists.scheduledRequests}
        onCancel={handlers.handleSetCancelSchedule}
      />}

    {!isEmptyObject(fields.selectedPerson) && !isEmptyObject(lists.scheduledRequests) &&
      <SchedulingActions
        disabledButton={!handlers.hasAccess('scheduling/schedule') || !handlers.handleCanSchedule()}
        onCancel={handlers.handleCancel}
        onSchedule={handlers.handleScheduleValidation(null, null, null)}
      />}

    <ActionDialog
      open={state.open}
      iconType="info"
      title={<FormattedMessage
        id="modal.cancel_schedule.title"
        defaultMessage="Cancelar Agendamento"
        description="Título do modal - Cancelar Agendamento"
      />}
      desc={<FormattedMessage
        id="modal.cancel_schedule.desc"
        defaultMessage="Deseja cancelar o agendamento de: {cn}?"
        description="Mensagem do modal - Cancelar Agendamento"
        values={{ cn: fields.selectedPerson.name }}
      />}
      confirmMode
      onCancel={handlers.handleCloseDialog}
      onConfirm={handlers.handleCancelSchedule}
      reason={fields.reason}
      onReasonChange={handlers.fieldChange('reason')}
    />
  </React.Fragment>;
};

personScheduling.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  state: PropTypes.object,
};

export default personScheduling;
