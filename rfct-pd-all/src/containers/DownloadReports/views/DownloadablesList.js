import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
// MATERIAL UI COMPONENTS
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// ICONS
import GetApp from '@material-ui/icons/GetApp';
import Refresh from '@material-ui/icons/Refresh';
// CUSTOM COMPONENTS
import EnhancedTable from 'Components/EnhancedTable/EnhancedTable';
import CardTemplate from 'Components/common/templates/CardTemplate';
import uiMessages from 'Containers/SnackbarMessages/messages/uiMessages';

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const DownloadablesList = ({ lists, handlers, classes, intl, rowsPerPage, pageList }) => {

  const hasData = _.has(lists, 'downloadables.rows') && lists.downloadables.rows.length > 0;

  const columns = hasData && Object.keys(lists.downloadables.rows[0]).map(item => {
    switch (item) {
      case 'reportExportUid':
        return {
          id: 'reportExportUid',
          mapKey: `EnhancedTableHead_#0`,
          rowKey: true,
          hidden: true,
        };
      case 'createdAt':
        return {
          id: 'createdAt',
          mapKey: `EnhancedTableHead_#1`,
          label: intl.formatMessage({
            id: "common.request_date",
            defaultMessage: "Data da solicitação",
            description: "Rótulo comum - Data da solicitação",
          }),
          order: 0,
        };
      case 'originType':
        return {
          id: 'originType',
          mapKey: `EnhancedTableHead_#2`,
          label: intl.formatMessage({
            id: "common.file",
            defaultMessage: "Arquivo",
            description: "Rótulo comum - Arquivo",
          }),
          order: 1,
        };
      case 'status':
        return {
          id: 'status',
          mapKey: `EnhancedTableHead_#3`,
          label: intl.formatMessage({
            id: "common.status",
            defaultMessage: "Status",
            description: "Rótulo comum - Status",
          }),
          order: 2,
        };
      case 'link':
        return {
          id: 'link',
          mapKey: `EnhancedTableHead_#4`,
          label: intl.formatMessage({
            id: "common.download",
            defaultMessage: "Download",
            description: "Rótulo comum - Download",
          }),
          order: 3,
        };

      default:
        return null;
    }
  }).filter(Boolean);

  const columnsOrder = columns && _.orderBy(columns, ['order']).map(col => col.id);

  const pickedData = hasData && lists.downloadables.rows;

  const tableData = (hasData && _.cloneDeep(pickedData).map((item) => {
    let newItem = {};

    Object.keys(item).forEach(key => {
      switch (key) {
        case 'createdAt':
          return newItem[key] = intl.formatDate(item[key], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
        case 'originType':
          return newItem[key] = intl.formatMessage(uiMessages[`${item[key]}_REPORT`]);
        case 'status':
          return newItem[key] = intl.formatMessage(uiMessages[`DOWNLOAD_PROCESSING_${item[key]}`]);
        case 'link':
          return newItem[key] = <Button href={item[key]} disabled={!item[key]}><GetApp /></Button>;
        default:
          return newItem[key] = item[key];
      }
    });

    return newItem;
  })) || [];

  return (
    <CardTemplate>
      <EnhancedTable
        data={tableData}
        total={(lists.downloadables && lists.downloadables.total) || 0}
        columns={columns}
        columnsOrder={columnsOrder}
        tableTitle={intl.formatMessage({
          id: "labels.table.title.download_reports_processing_queue",
          defaultMessage: "Fila de processamento para download de relatório",
          description: "Título da tabela - Fila de processamento para download de relatório"
        })}
        toolbarActions={
          <Button onClick={handlers.refreshQueue}>
            <Refresh className={classes.leftIcon} />
            {intl.formatMessage({
              id: "common.refresh_queue",
              defaultMessage: "Atualizar fila",
              description: "Rótulo comum - Atualizar fila"
            })}
          </Button>}
        page={pageList}
        rowsPerPage={rowsPerPage}
        selectable={false}
        onChangePage={handlers.changePage}
        serverPaging={true}
      />
    </CardTemplate>
  );
};

DownloadablesList.propTypes = {
  handlers: PropTypes.object.isRequired,
  intl: intlShape,
  lists: PropTypes.object.isRequired,
  classes: PropTypes.object,
  pageList: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default withStyles(styles)(injectIntl(DownloadablesList));
