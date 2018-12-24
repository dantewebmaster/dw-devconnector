import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
// CUSTOM COMPONENTS
import EnhancedTable from 'Components/EnhancedTable/EnhancedTable';
import { Button } from '@material-ui/core';

const SearchResults = ({ fields, lists, handlers }) => {
  const columns = lists.structuresByDate && lists.structuresByDate &&
    lists.structuresByDate.length > 0 && Object.keys(lists.structuresByDate[0]).map((item, index) => {
      switch (item) {
        case 'key':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.id"
              defaultMessage="Id"
              description="Rótulo comum - Id"
            />,
            rowKey: true,
            hidden: true,
            order: 0,
          };
        case 'structureLevelId':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.strucutre_level_id"
              defaultMessage="Cód. Nível Estrutura"
              description="Rótulo comum - Cód. Nível Estrutura"
            />,
            rowKey: false,
            order: 1,
          };
        case 'structureLevelName':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.strucutre_level_name"
              defaultMessage="Nome do Nível da Estrutura"
              description="Rótulo comum - Nome do Nível da Estrutura"
            />,
            rowKey: false,
            order: 2,
          };
        case 'structureCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.commercial_structure_code"
              defaultMessage="Cód. Estrutura Comercial"
              description="Rótulo comum - Cód. Estrutura Comercial"
            />,
            order: 3,
          };
        case 'structureName':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="common.structure_name"
              defaultMessage="Nome da Estrutura"
              description="Rótulo comum - Nome da Estrutura"
            />,
            order: 4,
          };
        case 'parentStructureCode':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="labels.table.header.parent_structure_level_id"
              defaultMessage="Cód. Pai"
              description="Rótulo de coluna de tabela - Cód. Pai"
            />,
            order: 5,
          };
        case 'parentStructureName':
          return {
            id: item,
            mapKey: `EnhancedTableHead_#${index}`,
            label: <FormattedMessage
              id="labels.table.header.parent_structure_name"
              defaultMessage="Nome Pai"
              description="Rótulo de coluna de tabela - Nome do Pai"
            />,
            order: 5,
          };
        default:
          return null;
      }
    }).filter(Boolean);

  const orderedColumns = _.orderBy(columns, ['order', 'asc']);

  let tableData = lists.structuresByDate && lists.structuresByDate && lists.structuresByDate.map(item => {
    let newItem = {};
    orderedColumns.forEach(col => {
      newItem[col.id] = item[col.id];
    }) || [];

    return newItem;
  });

  if (fields.selectedParentStructure && fields.selectedParentStructure !== '')
    tableData = tableData.filter(item => item.parentStructureCode === fields.selectedParentStructure);

  return (
    <div style={{ marginTop: '24px' }}>
      {columns && columns.length > 0 &&
        <EnhancedTable
          data={tableData}
          columns={columns}
          onRowSelect={handlers.rowSelect('selectedStructures')}
          onChangePage={() => { }}
          hideDelete={true}
          resetSelected={true}
        />}
      <Button
        size="large"
        variant="outlined"
        onClick={handlers.handleCancelReactivateByStructure}
        style={{ marginTop: '25px' }}
      >
        <FormattedMessage
          id="common.cancel"
          defaultMessage="Cancelar"
          description="Rótulo comum - Cancelar"
        />
      </Button>
    </div>
  );
};

SearchResults.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  classes: PropTypes.object,
};

export default SearchResults;
