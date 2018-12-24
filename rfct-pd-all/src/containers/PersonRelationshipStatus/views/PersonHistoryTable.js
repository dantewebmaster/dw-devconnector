import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
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
    textTransform: 'uppercase',
  },
  tableItemHighlighted: {
    borderBottom: '2px solid #747474',
    color: '#000',
    fontWeight: 'bold',
    padding: theme.spacing.unit * 2,
  },
});

const personHistoryTable = ({ classes, historyData, setUpdate, onClearStatus }) => {
  return (
    <Card style={{ marginTop: '16px' }}>
      <CardContent className={classes.cardHeader} style={{ paddingBottom: '16px' }}>
        <Typography component="h2">
          <FormattedMessage
            id="status.history.title"
            defaultMessage="Histórico de Movimentações"
            description="Título do card - Histórico de Movimentações"
          />
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={onClearStatus}
        >
          <FormattedMessage
            id="common.back"
            defaultMessage="Voltar"
            description="Rótulo comum - Voltar"
          />
        </Button>
      </CardContent>
      <CardContent>
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ minWidth: '800px' }}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.commercial_structure"
                      defaultMessage="Estrutura Comercial"
                      description="Rótulo comum - Estrutura Comercial"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.starting_date"
                      defaultMessage="Data Início"
                      description="Rótulo comum - Data Início"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.ending_date"
                      defaultMessage="Data Fim"
                      description="Rótulo comum - Data Fim"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.start_cycle"
                      defaultMessage="Ciclo Início"
                      description="Rótulo comum - Ciclo Início"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.end_cycle"
                      defaultMessage="Ciclo Fim"
                      description="Rótulo comum - Ciclo Fim"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.status"
                      defaultMessage="Status"
                      description="Rótulo status - Status"
                    />
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
                <TableCell padding="checkbox">
                  <Typography component="p" className={classes.tableHeaderTitle}>
                    <FormattedMessage
                      id="common.cease_reason"
                      defaultMessage="Motivo de Cessação"
                      description="Rótulo comum - Motivo de Cessação"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((item, index) => {
                const firstIndex = index === 0 ? true : false;
                const statusCode = item.status.statusCode;
                return (
                  <TableRow key={index} className={firstIndex ? classes.tableItemHighlighted : classes.tableItem}>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">
                        {item.originStructureName === 'STRUCTURE_NOT_FOUND' ?
                          <FormattedMessage
                            id="common.structure_unavailable"
                            defaultMessage="Estrutura indisponível"
                            description="Rótulo comum - Estrutura indisponível"
                          /> : `${item.originStructureLevelName} - ${item.originStructureName}`}
                      </Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">
                        {item.startDate ? formatDate(item.startDate) : ''}
                      </Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">
                        {item.endDate ? formatDate(item.endDate) : ''}
                      </Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.startCycle}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.endCycle}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.status.description}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.userName || item.createdBy}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.ceaseDescription || '--'}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      {firstIndex &&
                        <Button
                          variant="contained"
                          size="small"
                          color={statusCode === 4 ? 'primary' : 'secondary'}
                          fullWidth
                          onClick={() => setUpdate(item.personCode, item.status.statusCode)}
                        >{statusCode === 4 ? <FormattedMessage
                          id="common.reactivate"
                          defaultMessage="Reativar"
                          description="Rótulo comum - Reativar"
                        /> : <FormattedMessage
                            id="common.cease"
                            defaultMessage="Encerrar"
                            description="Rótulo comum - Encerrar"
                          />}
                        </Button>}
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

personHistoryTable.propTypes = {
  classes: PropTypes.object.isRequired,
  historyData: PropTypes.array.isRequired,
  setUpdate: PropTypes.func.isRequired,
  onClearStatus: PropTypes.func.isRequired,
};

export default withStyles(styles)(personHistoryTable);
