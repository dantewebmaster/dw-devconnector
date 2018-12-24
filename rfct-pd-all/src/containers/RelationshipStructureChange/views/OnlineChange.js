import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import CardTemplate from 'Components/common/templates/CardTemplate';
import NotFound from 'Components/NotFound';
import ActionDialog from 'Components/ActionDialog';
import MessageDialog from 'Components/MessageDialog';
import StructureChange from 'Components/StructureChange';
import PersonInformation from 'Components/PersonInformation';
import SchedulingList from 'Containers/Scheduling/views/SchedulingList';
import SchedulingActions from './SchedulingActions';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';

const styles = theme => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

const OnlineChange = ({ fields, lists, handlers, classes }) => {
  return (
    <React.Fragment>
      <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.online_structure_change"
          defaultMessage="Movimentação Online"
          description="Título da página - Movimentação Online"
        />
      </Typography>

      <CardTemplate>
        <Grid container className={classes.content}>
          <Grid item md>
            <PersonInformation
              personCode={fields.personCode}
              selectedPerson={fields.selectedPerson}
              onEnterKeyPress={handlers.handleKeyPress('Enter')}
              onPersonCodeChange={handlers.handlePersonCodeChange}
            />

            {!isEmptyObject(fields.originValues) &&
              <React.Fragment>
                <StructureChange
                  disabledInput={true}
                  originValues={fields.originValues}
                  disableMovement={fields.isResponsible}
                  structureLevels={lists.structureLevels}
                  destinationValues={fields.destinationValues}
                  onOriginChange={handlers.handleDestinationChange}
                  onDestinationChange={handlers.handleDestinationChange}
                />
                <SchedulingActions
                  onCancel={handlers.onCancel}
                  disabledButton={!handlers.handleCanSchedule()}
                  onSchedule={handlers.handleScheduleValidation(fields.selectedPerson, fields.origin, fields.destination)}
                  buttonLabel={
                    <FormattedMessage
                      id="common.structure_change"
                      defaultMessage="Movimentar"
                      description="Rótulo comum - Movimentar"
                    />
                  }
                />
              </React.Fragment>}
          </Grid>
        </Grid>
      </CardTemplate>

      {isEmptyObject(fields.originValues) && !isEmptyObject(fields.selectedPerson) &&
        <NotFound
          buttonAction={handlers.onCancel}
          text={<FormattedMessage
            id="message.structure_not_found"
            defaultMessage="Pessoa não possui estrutura associada"
            description="Mensagem quando não encontrar estrutura"
          />}
          buttonLabel={<FormattedMessage
            id="common.new_search"
            defaultMessage="Nova Pesquisa"
            description="Rótulo comum - Nova pesquisa"
          />}
        />}

      {!isEmptyObject(fields.selectedPerson) && !isEmptyObject(lists.scheduledRequests) &&
        <SchedulingList
          disableCancel={!handlers.hasAccess('scheduling/cancel')}
          scheduledRequests={lists.scheduledRequests}
          onCancel={handlers.onSetCancelSchedule}
        />}

      <ActionDialog
        open={fields.getCycleModalOpen}
        iconType="info"
        title={<FormattedMessage
          id="page.online_structure_change"
          defaultMessage="Movimentação Online"
          description="Título da página - Movimentação Online"
        />}
        desc={<FormattedMessage
          id="modal.online_structure_change.desc"
          defaultMessage="Deseja movimentar CN: {cn} no ciclo {cycle}?"
          description="Descrição do modal - Validação de ciclo"
          values={{ cycle: fields.destinationCycle, cn: fields.selectedPerson.name }}
        />}
        confirmMode
        onCancel={handlers.onCloseDialog}
        onConfirm={handlers.handleSubmitScheduling}
      />

      <ActionDialog
        open={fields.cancelModalOpen}
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
        onCancel={handlers.onCloseDialog}
        onConfirm={handlers.onConfirmCancelSchedule}
        reason={fields.reason}
        onReasonChange={handlers.fieldChange('reason')}
      />

      <ActionDialog
        open={fields.confirmMovementModalOpen}
        iconType="info"
        title={<FormattedMessage
          id="modal.gap_overlap.title"
          defaultMessage="Essa movimentação ocasionará salto ou retrocesso"
          description="Essa movimentação ocasionará salto ou retrocesso"
        />}
        desc={<FormattedMessage
          id="modal.gap_overlap.desc"
          defaultMessage="Deseja movimentar CN: {cn} no ciclo {cycle}?"
          description="Descrição do modal - Movimentar com salto/retrocesso"
          values={{ cycle: fields.destinationCycle, cn: fields.selectedPerson.name }}
        />}
        confirmMode
        onCancel={handlers.onCloseDialog}
        onConfirm={handlers.handleSubmitScheduling}
      />

      <MessageDialog
        open={fields.isResponsibleModalOpen}
        iconType="info"
        title={<FormattedMessage
          id="page.online_structure_change"
          defaultMessage="Movimentação Online"
          description="Título da página - Movimentação Online"
        />}
        desc={<FormattedMessage
          id="modal.validate_roles"
          defaultMessage="{cn} possui papéis de responsável e não pode ser movimentada."
          description="Descrição do modal - Movimentação Online."
          values={{ cn: fields.selectedPerson.name }}
        />}
        confirmMode
        onCancel={handlers.onCloseDialog}
        onConfirm={handlers.onCloseDialog}
      />
    </React.Fragment>
  );
};

OnlineChange.propTypes = {
  classes: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
};

export default withStyles(styles)(OnlineChange);
