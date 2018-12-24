import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Divider from '@material-ui/core/Divider';
// CUSTOM COMPONENTS
import StructureChange from 'Components/StructureChange';
import SchedulingActions from './SchedulingActions';
import SchedulingList from './SchedulingList';
import ActionDialog from 'Components/ActionDialog';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';

const personScheduling = ({ fields, lists, handlers }) => {
  return <React.Fragment>
    {!isEmptyObject(fields.originValues) &&
      <Card>
        <CardContent>
          <StructureChange
            disabledInput={true}
            structureLevels={lists.structureLevels}
            originValues={fields.originValues}
            destinationValues={fields.destinationValues}
            onDestinationChange={handlers.handleDestinationChange}
          />
        </CardContent>
        <Divider />
        <SchedulingActions
          disabledButton={!handlers.hasAccess('scheduling/schedule') || !handlers.handleCanSchedule()}
          onCancel={handlers.handleCancel}
          onSchedule={handlers.handleScheduleValidation(null, null, null)}
        />
      </Card>}

    {!isEmptyObject(fields.selectedPerson) && !isEmptyObject(lists.scheduledRequests) &&
      <SchedulingList
        disableCancel={!handlers.hasAccess('scheduling/cancel')}
        scheduledRequests={lists.scheduledRequests}
        onCancel={handlers.handleSetCancelSchedule}
      />}

    <ActionDialog
      open={fields.getCycleModal.open}
      iconType="info"
      title={<FormattedMessage
        id="modal.confirm_movement.title"
        defaultMessage="Confirmar o agendamento de: {cn}?"
        description="Título do modal - Agendar Pessoa"
        values={{ cn: fields.selectedPerson.name }}
      />}
      desc={<FormattedMessage
        id="VALIDATE_CYCLE"
        defaultMessage="Movimentação será realizada no fechamento do ciclo: {cycle}. Deseja continuar?"
        description="Mensagem do modal - Validar ciclo"
        values={fields.getCycleModal.values}
      />}
      confirmMode
      onCancel={handlers.handleCloseDialog}
      onConfirm={handlers.handlePostSchedule}
    />

    <ActionDialog
      open={fields.cancelModal.open}
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
};

export default personScheduling;
