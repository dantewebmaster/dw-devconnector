import React from 'react';
import PropTypes from 'prop-types';
// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
// UTILS
import isEmptyObject from 'Utils/isEmptyObject';
import formatDate from 'Utils/formatDate';

const styles = theme => ({
  tableHeader: {
    backgroundColor: theme.palette.grey['100'],
  },
  tableHeadTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  tableItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginTop: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const schedulingList = ({ classes, scheduledRequests, onCancel, disableCancel }) => {
  return (
    !isEmptyObject(scheduledRequests) &&
    <Card className={classes.cardHeader}>
      <CardHeader
        title={<FormattedMessage
          id="common.scheduled_list"
          defaultMessage="Movimentações Agendadas"
          description="Rótulocomum - Movimentações Agendadas"
        />}
      />
      <Divider />
      <CardContent>
        <div className={classes.tableWrapper}>
          <Table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.origin_structure_code"
                      defaultMessage="Código Estr. Origem"
                      description="Rótulo comum - Código Estr. Origem"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.origin_structure_name"
                      defaultMessage="Nome Estr. Origem"
                      description="Rótulo comum - Nome Estr. Origem"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.cycle"
                      defaultMessage="Ciclo"
                      description="Rótulo comum - Ciclo"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.destination_structure_code"
                      defaultMessage="Código Estr. Destino"
                      description="Rótulo da coluna - Código Estr. Destino"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.destination_structure_name"
                      defaultMessage="Nome Estr. Destino"
                      description="Rótulo da coluna - Nome Estr. Destino"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle} align="center">
                    <FormattedMessage
                      id="common.priority"
                      defaultMessage="Prioridade"
                      description="Rótulo comum - Prioridade"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.schedule_date"
                      defaultMessage="Data de Agendamento"
                      description="Rótulo comum - Data de Agendamento"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.type"
                      defaultMessage="Tipo"
                      description="Rótulo comum - Tipo"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeadTitle}>
                    <FormattedMessage
                      id="common.user"
                      defaultMessage="Usuário"
                      description="Rótulo comum - Usuário"
                    />
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography align="center">
                    <FormattedMessage
                      id="common.delete"
                      defaultMessage="Excluir"
                      description="Rótulo comum - Excluir"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(scheduledRequests).map(key => {
                const schedule = scheduledRequests[key];
                return (
                  <TableRow key={schedule.schedulingUid}>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{schedule.originStructureCode}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{schedule.originStructureName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{schedule.destinationCycle}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{schedule.destinationStructureCode}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{schedule.destinationStructureName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption" align="center">{schedule.priority}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{formatDate(schedule.createdAt)}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">
                        {schedule.isCycleOpen === 0 ?
                          <FormattedMessage
                            id="common.closed"
                            defaultMessage="Fechado"
                            description="Rótulo comum - Fechado"
                          /> : <FormattedMessage
                            id="common.opened"
                            defaultMessage="Aberto"
                            description="Rótulo comum - Aberto"
                          />}
                      </Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{schedule.userName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox" align="center">
                      <IconButton disabled={disableCancel} onClick={() => onCancel(schedule.schedulingUid)}>
                        <IconDelete color="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

schedulingList.propTypes = {
  classes: PropTypes.object,
  scheduledRequests: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  disableCancel: PropTypes.bool,
};

export default withStyles(styles)(schedulingList);
