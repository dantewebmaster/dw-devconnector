import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import EnhancedTable from 'Components/EnhancedTable/EnhancedTable';
import ActionDialog from 'Components/ActionDialog';
import NotFound from 'Components/NotFound';
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
    lists.peopleByStructure.length > 0 &&
    Object.keys(lists.peopleByStructure[0]).map((item, index) => {
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
            order: 1,
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
            order: 2,
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
            order: 3,
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
            order: 4,
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
            order: 5,
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
            order: 6,
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
            order: 7,
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
            order: 8,
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
            order: 9,
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
  return <React.Fragment>
    <Grid container spacing={40} style={{ padding: '40px 0 16px' }} justify="center" alignItems="flex-start">
      <Grid item xs>
        {columns && columns.length > 0 &&
          <EnhancedTable
            data={tableData}
            columns={columns}
            onRowSelect={handlers.rowSelect('schedulingByStructureSelectedPeople')}
            onDelete={handlers.handleSetCancelSchedule}
          />}
      </Grid>
    </Grid>

    {lists.notFound &&
      <NotFound
        text={<FormattedMessage
          id="message.structure_not_found.text"
          defaultMessage="Nenhuma movimentação encontrada"
          description="Mensagem quando não encontrar movimentações"
        />}
        buttonLabel={<FormattedMessage
          id="common.new_search"
          defaultMessage="Nova Pesquisa"
          description="Rótulo comum - Nova pesquisa"
        />}
      />}

    <ActionDialog
      open={state.open}
      iconType="info"
      title={<FormattedMessage
        id="modal.cancelModal.title"
        defaultMessage="Cancelar Agendamento"
        description="Título do modal - Cancelar Agendamento"
      />}
      desc={<FormattedMessage
        id="message.CANCEL_SCHEDULE"
        defaultMessage="Deseja cancelar o agendamento?"
        description="Descrição do modal - Cancelar Agendamento"
      />}
      confirmMode
      onCancel={handlers.handleCloseDialog}
      onConfirm={handlers.handleDeleteSchedules(state.scheduleUid)}
      reason={fields.reason}
      onReasonChange={handlers.fieldChange('reason')}
    />
  </React.Fragment>;
};

StructureBatchSchedulingResults.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  classes: PropTypes.object,
  state: PropTypes.object.isRequired,
};

export default withStyles(styles)(StructureBatchSchedulingResults);
