import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
// CUSTOM COMPONENTS
import EnhancedTable from 'Components/EnhancedTable/EnhancedTable';
import ActionDialog from 'Components/ActionDialog';
import formatDate from 'Utils/formatDate';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  fieldsetRoot: {
    width: '100%',
  },
  actions: {
    marginTop: 0,
  },
});

const StructureBatchSchedulingResults = ({ fields, lists, handlers, state }) => {
  const columns = lists.peopleByStructure &&
    lists.peopleByStructure.length > 0 && Object.keys(lists.peopleByStructure[0]).map((item, index) => {
      switch (item) {
        case 'personCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.cn_code"
              defaultMessage="Código CN"
              description="Rótulo comum - Código CN"
            />,
            rowKey: true,
            order: 0,
          };
        case 'name':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.cn_name"
              defaultMessage="Nome CN"
              description="Rótulo comum - Nome CN"
            />,
            order: 2,
          };
        case 'gpLevelDescription':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.level"
              defaultMessage="Nível"
              description="Rótulo comum - Nível"
            />,
            order: 1,
          };
        case 'originCycle':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.cycle"
              defaultMessage="Ciclo"
              description="Rótulo comum - Ciclo"
            />,
            order: 3,
          };
        case 'originStructureCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.origin_structure_code"
              defaultMessage="Código Estr. Origem"
              description="Rótulo comum - Código Estr. Origem"
            />,
            order: 4,
          };
        case 'originStructureName':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.origin_structure_name"
              defaultMessage="Nome Estr. Origem"
              description="Rótulo comum - Nome Estr. Origem"
            />,
            order: 5,
          };
        case 'destinationStructureCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.destination_structure_code"
              defaultMessage="Código Estr. Destino"
              description="Rótulo comum - Código Estr. Destino"
            />,
            order: 6,
          };
        case 'destinationStructureName':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.destination_structure_name"
              defaultMessage="Nome Estr. Destino"
              description="Rótulo comum - Nome Estr. Destino"
            />,
            order: 7,
          };
        case 'priority':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.priority"
              defaultMessage="Prioridade"
              description="Rótulo comum - Prioridade"
            />,
            order: 8,
          };
        case 'createdAt':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.schedule_date"
              defaultMessage="Data de Agendamento"
              description="Rótulo comum - Data de Agendamento"
            />,
            order: 9,
          };
        case 'createdByName':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.user"
              defaultMessage="Usuário"
              description="Rótulo comum - Usuário"
            />,
            order: 10,
          };
        default:
          return null;
      }
    }).filter(Boolean);

  const orderedColumns = _.orderBy(columns, ['order', 'asc']);

  const tableData = lists.peopleByStructure && lists.peopleByStructure.map(item => {
    let newItem = {};
    orderedColumns.forEach(col => {
      const key = col.id;
      switch (key) {
        case 'createdAt':
          newItem[key] = formatDate(item[key]);
          break;
        default:
          newItem[key] = item[key];
          break;
      }
    }) || [];

    return newItem;
  });

  let canDelete = false;
  if (lists.peopleByStructure)
    canDelete = lists.peopleByStructure
      .filter(item => fields.schedulingByStructureSelectedPeople.includes(item.personCode))
      .every(item => item.schedulingUid);

  return (
    <React.Fragment>

      {columns && columns.length > 0 &&
        <EnhancedTable
          data={tableData}
          columns={columns}
          onRowSelect={handlers.rowSelect('schedulingByStructureSelectedPeople')}
          onDelete={handlers.handleSetCancelSchedule}
          disableDelete={!canDelete}
        />}

      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={handlers.handleCancelStructureScheduling}
        style={{ marginTop: '25px' }}
      >
        <FormattedMessage
          id="common.cancel"
          defaultMessage="Cancelar"
          description="Rótulo comum - Cancelar"
        />
      </Button>

      <ActionDialog
        open={state.open}
        iconType="info"
        title={<FormattedMessage
          id="modal.cancelModal.title"
          defaultMessage="Cancelamento de agendamento"
          description="Título do modal - Cancelamento de agendamento"
        />}
        desc={<FormattedMessage
          id="message.CANCEL_SCHEDULE"
          defaultMessage="Deseja cancelar o agendamento?"
          description="Descrição do modal - Cancelamento de agendamento"
        />}
        confirmMode
        onCancel={handlers.handleCloseDialog}
        onConfirm={handlers.handleDeleteSchedules(state.scheduleUid)}
        reason={fields.reason}
        onReasonChange={handlers.fieldChange('reason')}
      />
    </React.Fragment>
  );
};

StructureBatchSchedulingResults.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  classes: PropTypes.object,
  state: PropTypes.object,
};

export default withStyles(styles)(StructureBatchSchedulingResults);
