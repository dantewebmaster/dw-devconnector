import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import DeviceIcon from '@material-ui/icons/DeviceHubOutlined';
import HistoryIcon from '@material-ui/icons/LibraryBooksOutlined';

import ActionDialog from 'Components/ActionDialog';
import AssociateStructureForm from './AssociateStructureForm';

import formatDate from 'Utils/formatDate';

const styles = theme => ({
  stack: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: `${theme.palette.grey['400']} !important`,
    fontSize: '0.8em',
  },
  info: {
    fontSize: '1em',
  },
  tableHeader: {
    marginTop: theme.spacing.unit * 2,
    fontSize: '10px',
  },
  tableHeaderTitle: {
    fontSize: '10px',
    fontWeight: 'bold',
  },
  tableItemText: {
    fontSize: '12px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    margin: '20px 0'
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
    marginTop: -3,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const AssociationResponsibleView = ({ classes, fields, lists, dialogOpen, handlers }) => {
  return (
    <React.Fragment>
      <Card style={{ overflow: 'visible', marginBottom: '16px' }}>
        <CardContent>
          <Grid container spacing={40} justify="center">
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.commercial_structure_code"
                    defaultMessage="Código da estrutura comercial"
                    description="Rótulo do comum - Código da estrutura comercial"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography>{fields.structureCode}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.structure_name"
                    defaultMessage="Nome da estrutura"
                    description="Rótulo comum - Nome da estrutura"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography>{fields.structureName}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.person_code"
                    defaultMessage="Código da pessoa"
                    description="Rótulo comum - Código da pessoa"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography>{fields.personCode}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.person"
                    defaultMessage="Pessoa"
                    description="Rótulo comum - Pessoa"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography>{fields.personName}</Typography>
                </div>
              </div>
            </Grid>
            {fields.functions && fields.functions.length > 0 &&
              <Grid item xs={4}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.role_function"
                    defaultMessage="Papel / Função"
                    description="Rótulo comum - Papel / Função"
                  />
                </Typography>
                <Typography>
                  {fields.functions.map(item => `${item.functionName} / ${item.roleName}`)}
                </Typography>
              </Grid>}
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={40} justify="center">
            <Grid item md={4}>
              <div className={classes.stack}>
                <header className={classes.header}>
                  <DeviceIcon className={classes.icon} />
                  <Typography style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage
                      id="common.commercial_structure"
                      defaultMessage="Estrutura Comercial"
                      description="Rótulo comum - Estrutura Comercial"
                    />
                  </Typography>
                </header>
                <article>
                  <div className={classes.center}>
                    <div className={classes.stack}>
                      {fields.hasStructure === true ?
                        <React.Fragment>
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                          >
                            <FormattedMessage
                              id="common.unassign"
                              defaultMessage="Remover Atribuição"
                              description="Rótulo comum - Remover Atribuição"
                            />
                          </Button>
                        </React.Fragment> :
                        <React.Fragment>
                          <Typography style={{
                            textTransform: 'uppercase', marginTop: '24px', marginBottom: '24px'
                          }}>
                            <FormattedMessage
                              id="labels.fields.person_not_associated"
                              defaultMessage="Pessoa não está associada a estrutura"
                              description="Rótulo do campo - Pessoa não está associada a estrutura"
                            />
                          </Typography>
                          <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => handlers.openDialog()}
                          >
                            <FormattedMessage
                              id="common.assign"
                              defaultMessage="Atribuir"
                              description="Rótulo comum - Atribuir"
                            /> - E
                          </Button>
                        </React.Fragment>
                      }
                    </div>
                  </div>
                </article>
              </div>
            </Grid>
            <Grid item md={8}>
              <header className={classes.header}>
                <HistoryIcon className={classes.icon} />
                <Typography style={{ textTransform: 'uppercase' }}>
                  <FormattedMessage
                    id="common.history"
                    defaultMessage="Histórico"
                    description="Rótulo comum - Histórico"
                  />
                </Typography>
              </header>
              <article>
                <div style={{ overflowX: 'auto', padding: '24px' }}>
                  <Table style={{ minWidth: '800px' }}>
                    <TableHead className={classes.tableHeader}>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Typography component="p">
                            <FormattedMessage
                              id="common.commercial_structure"
                              defaultMessage="Estrutura Comercial"
                              description="Rótulo comum - Estrutura Comercial"
                            />
                          </Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Typography component="p">
                            <FormattedMessage
                              id="common.starting_date"
                              defaultMessage="Data Início"
                              description="Rótulo comum - Data Início"
                            />
                          </Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Typography component="p">
                            <FormattedMessage
                              id="common.ending_date"
                              defaultMessage="Data Fim"
                              description="Rótulo comum - Data Fim"
                            />
                          </Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Typography component="p">
                            <FormattedMessage
                              id="common.start_cycle"
                              defaultMessage="Ciclo Início"
                              description="Rótulo comum - Ciclo Início"
                            />
                          </Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Typography component="p">
                            <FormattedMessage
                              id="common.end_cycle"
                              defaultMessage="Ciclo Fim"
                              description="Rótulo comum - Ciclo Fim"
                            />
                          </Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Typography component="p">
                            <FormattedMessage
                              id="common.status"
                              defaultMessage="Status"
                              description="Rótulo comum - Status"
                            />
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lists.responsibleHistory.length > 0
                        && lists.responsibleHistory.map((item, index) => {
                          return (
                            <TableRow key={index} className={classes.tableItem}>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">
                                  {item.originStructureName === 'STRUCTURE_NOT_FOUND' ?
                                    <FormattedMessage
                                      id="common.structure_unavailable"
                                      defaultMessage="Estrutura indisponível"
                                      description="Rótulo comum - Estrutura indisponível"
                                    /> :
                                    `${item.originStructureLevelName} - ${item.originStructureName}`}
                                </Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{formatDate(item.startDate)}</Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{item.endDate ? formatDate(item.endDate) : '--'}</Typography>
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
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </article >
            </Grid >
          </Grid >
        </CardContent >
      </Card >
      <ActionDialog
        open={dialogOpen}
        onCancel={() => handlers.closeDialog(1)}
        iconType="info"
        title={<FormattedMessage
          id="modal.title.association_responsible"
          defaultMessage="Relacionar responsável a estrutura"
          description="Rótulo do botão - Relacionar responsável a estrutura"
        />}
        confirmMode={false}
        customForm={
          <AssociateStructureForm fields={fields} lists={lists} handlers={handlers} />
        }
      />
    </React.Fragment >
  );
};

AssociationResponsibleView.propTypes = {
  fields: PropTypes.object.isRequired,
  handlers: PropTypes.object,
  classes: PropTypes.object,
  lists: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
};

export default withStyles(styles)(AssociationResponsibleView);
