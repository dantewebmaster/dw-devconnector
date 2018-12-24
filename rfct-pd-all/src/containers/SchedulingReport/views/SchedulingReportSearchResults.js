import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
// ICONS
import SubjectIcon from '@material-ui/icons/Subject';
import InfoIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
// UTILS
import formatDate from 'Utils/formatDate';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tableHeader: {
    backgroundColor: theme.palette.grey['100'],
    marginTop: theme.spacing.unit * 2,
    fontSize: '10px',
  },
  tableHeaderTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
  },
});

const schedulingReportSearchResults = ({ classes, onExport, data, queryType, page, rowsPerPage, count, onChangePage, rowsPerPageOptions
}) => {
  const mountTooltip = (cell, item) => {
    if (!item.cancelDetail && !item.cancelDescription) {
      return cell;
    } else if (item.cancelDetail) {
      return (
        <Tooltip title={item.cancelDetail} placement="left">
          {cell}
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={item.cancelDescription} placement="left">
          {cell}
        </Tooltip>
      );
    }
  };

  return (
    <Card style={{ marginTop: '16px' }}>
      <CardContent className={classes.cardHeader} style={{ paddingBottom: '16px' }}>
        <Typography component="h2">
          <FormattedMessage
            id="common.search_results"
            defaultMessage="Resultados da busca"
            description="Rótulo comum - Resultados da busca"
          />
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onExport}
        >
          <SubjectIcon className={classes.leftIcon} />
          <FormattedMessage
            id="common.export"
            defaultMessage="Exportar"
            description="Rótulo do botão - Exportar"
          />
        </Button>
      </CardContent>
      <CardContent>
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ minWidth: '1024px' }}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.cn_code"
                      defaultMessage="Código CN"
                      description="Rótulo comum - Código CN"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.cn_name"
                      defaultMessage="Nome CN"
                      description="Rótulo comum - Nome CN"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.level"
                      defaultMessage="Nível"
                      description="Rótulo comum - Nível"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.origin_structure_code"
                      defaultMessage="Código Estr. Origem"
                      description="Rótulo comum - Código Estr. Origem"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.origin_structure_name"
                      defaultMessage="Nome Estr. Origem"
                      description="Rótulo comum - Nome Estr. Origem"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.origin_cycle"
                      defaultMessage="Ciclo Origem"
                      description="Rótulo comum - Ciclo Origem"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.destination_cycle"
                      defaultMessage="Ciclo Destino"
                      description="Rótulo comum - Ciclo Destino"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.destination_structure_code"
                      defaultMessage="Código Estr. Destino"
                      description="Rótulo comum - Código Estr. Destino"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.destination_structure_name"
                      defaultMessage="Nome Estr. Destino"
                      description="Rótulo comum - Nome Estr. Destino"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.priority"
                      defaultMessage="Prioridade"
                      description="Rótulo comum - Prioridade"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    {queryType === 0 ?
                      <FormattedMessage
                        id="common.schedule_date"
                        defaultMessage="Data de Agendamento"
                        description="Rótulo comum - Data de Agendamento"
                      /> : queryType === 1 ? <FormattedMessage
                        id="common.effective_date"
                        defaultMessage="Data de Efetivação"
                        description="Rótulo comum - Data de Efetivação"
                      /> : <FormattedMessage
                          id="common.cancelled_date"
                          defaultMessage="Data de Cancelamento"
                          description="Rótulo comum - Data de Cancelamento"
                        />}
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.user"
                      defaultMessage="Usuário"
                      description="Rótulo comum - Usuário"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.personCode}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.personName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.gpLevelDescription}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.sourceStructureCode}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.sourceStructureName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.sourceCycle}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.destinationCycle}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.destinationStructureCode}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.destinationStructureName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.priority}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">{
                      mountTooltip(
                        <Typography variant="caption" style={{ display: 'flex' }}>
                          {formatDate(item.scheduleAt)}
                          {item.cancelDescription && item.cancelDescription !== ''
                            || item.cancelDetail && item.cancelDetail !== '' ? <InfoIcon style={{ fontSize: 16, marginLeft: '5px' }} /> : null}
                        </Typography>, item
                      )}
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">
                        {item.createdByName || item.scheduleBy}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          page={page}
          onChangePage={onChangePage}
          labelDisplayedRows={({ from, to, count }) => {
            return (
              <FormattedMessage
                id="pagination.displayed_rows"
                defaultMessage="{from} - {to} de {count}"
                description="Rótulo de paginação"
                values={{ from, to, count }}
              />
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

schedulingReportSearchResults.propTypes = {
  classes: PropTypes.object.isRequired,
  onExport: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  rowsPerPageOptions: PropTypes.array,
  queryType: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
};

export default withStyles(styles)(schedulingReportSearchResults);
