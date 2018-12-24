import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
// ICONS
import SearchIcon from '@material-ui/icons/SearchOutlined';
import ContactsIcon from '@material-ui/icons/ContactsOutlined';
// CUSTOM COMPONENTS
import Grid from '@material-ui/core/Grid';
import CardTemplate from 'Components/common/templates/CardTemplate';
import StructureTree from 'Components/StructureTree';
import PersonInfo from 'Components/PersonInfo/PersonInfo';
import SearchField from 'Components/SearchField/SearchField';
// UTILS
import formatDate from 'Utils/formatDate';


const styles = (theme) => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  info: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing.unit * 4,
    padding: theme.spacing.unit,
    '& span': {
      marginBottom: theme.spacing.unit,
    },
    '& div': {
      flexGrow: '1',
    },
    '& div:first-child': {
      flexGrow: '0',
      marginRight: theme.spacing.unit * 3,
    },
    '& svg': {
      fontSize: '40px',
      maxWidth: '50px',
    },
  },
  statusIndicator: {
    width: '14px',
    height: '14px',
    borderRadius: '100%',
    backgroundColor: '#d7d7d7',
    display: 'block',
    float: 'left',
    marginLeft: '-24px',
    marginTop: '3px',
  },
  historyTable: {
    '& table': {
      minWidth: '720px',
    },
    '& thead': {
      textTransform: 'uppercase',
    },
    '& thead p': {
      lineHeight: '1',
    },
    overflowX: 'auto',
  },
  historyTableTitle: {
    marginLeft: '12px',
    marginBottom: '16px',
  },
});

const PersonInformationView = ({ fields, lists, handlers, classes }) => {
  return (
    <React.Fragment>
      <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.person_information"
          defaultMessage="Pessoas"
          description="Título da página - Pessoas"
        />
      </Typography>
      <CardTemplate
        icon={<SearchIcon />}
        title={<FormattedMessage
          id="common.search"
          defaultMessage="Pesquisar"
          description="Rótulo comum - Pesquisar"
        />}
      >
        <SearchField
          fieldLabel={<FormattedMessage
            id="common.person_code"
            defaultMessage="Código da Pessoa"
            description="Rótulo comum- Código da Pessoa"
          />}
          showClearButton={!isEmpty(fields.selectedPerson) && fields.personCode ? true : false}
          handlers={{
            onChange: handlers.textFieldChange('personCode'),
            onSearch: handlers.keyPress('Enter'),
            onClearSearch: handlers.clearSearch,
          }}
        />
      </CardTemplate>

      <Grid container spacing={8}>
        <Grid item xs={4}>
          {!isEmpty(fields.selectedPerson) &&
            <CardTemplate>
              <div>
                {/* person info */}
                {!isEmpty(fields.selectedPerson) &&
                  <PersonInfo
                    title={<FormattedMessage
                      id="common.person_info"
                      defaultMessage="Informações da Pessoa"
                      description="Rótulo comum - Informações da Pessoa"
                    />}
                    personData={{
                      personCode: fields.selectedPerson.personCode,
                      personName: fields.selectedPerson.name,
                      currentCycle: fields.selectedPerson.currentCycle,
                    }}
                  />}
                {/* person structure */}
                {lists.structureTree.length > 0 &&
                  <StructureTree
                    title={<FormattedMessage
                      id="common.commercial_structure"
                      defaultMessage="Estrutura Comercial"
                      description="Rótulo comum - Estrutura Comercial"
                    />}
                    structures={lists.structureTree}
                  />}
              </div>
            </CardTemplate>}
        </Grid>

        <Grid item xs={8}>
          {lists.personHistory.length > 0 &&
            lists.personHistory.map((group, index) => {
              const statusColor = ['#000000', '#ffb203', '#999999', '#43c596'];
              return (
                <CardTemplate key={index}>
                  <div className={classes.info}>
                    <div>
                      <ContactsIcon />
                    </div>
                    <div>
                      <Typography variant="caption">
                        <FormattedMessage
                          id="common.role_function"
                          defaultMessage="Papel / Função"
                          description="Rótulo comum - Papel / Função"
                        />
                      </Typography>
                      <Typography variant="button" component="p">
                        {group.role.description}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption">
                        <FormattedMessage
                          id="common.level"
                          defaultMessage="Nível"
                          description="Rótulo comum - Nível"
                        />
                      </Typography>
                      <Typography variant="button" component="p">
                        {group.gpLevelDescription || '--'}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption">
                        <FormattedMessage
                          id="common.status"
                          defaultMessage="Status"
                          description="Rótulo comum - Status"
                        />
                      </Typography>
                      <div>
                        <span
                          className={classes.statusIndicator}
                          style={{
                            backgroundColor: statusColor[group.status.statusCode],
                          }}
                        ></span>
                        <Typography variant="button" component="p">
                          {group.status.description}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Typography variant="caption" className={classes.historyTableTitle}>
                    <FormattedMessage
                      id="common.history"
                      defaultMessage="Histórico"
                      description="Rótulo da coluna - Histórico"
                    />
                  </Typography>
                  <div className={classes.historyTable}>
                    <Table>
                      <TableHead>
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
                                description="Rótulo da coluna - Ciclo Fim"
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
                          <TableCell padding="checkbox">
                            <Typography component="p">
                              <FormattedMessage
                                id="common.cease_reason"
                                defaultMessage="Motivo de Cessação"
                                description="Rótulo comum - Motivo de Cessação"
                              />
                            </Typography>
                          </TableCell>
                          <TableCell padding="checkbox">
                            <Typography component="p">
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
                        {group.history.map((item, index) => {
                          const structure = `${item.originStructureCode} - ${item.originStructureLevelName} ${item.originStructureName}`;
                          return (
                            <TableRow key={index} className={classes.tableItem}>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">
                                  {item.originStructureName === 'STRUCTURE_NOT_FOUND' ?
                                    <FormattedMessage
                                      id="common.structure_unavailable"
                                      defaultMessage="Estrutura indisponível"
                                      description="Rótulo comum - Estrutura indisponível"
                                    /> : structure}
                                </Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">
                                  {item.startDate ? formatDate(item.startDate) : '--'}
                                </Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">
                                  {item.endDate ? formatDate(item.endDate) : '--'}
                                </Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{item.startCycle}</Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{item.endCycle || '--'}</Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{item.status && item.status.description || '--'}</Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{item.ceaseDescription || '--'}</Typography>
                              </TableCell>
                              <TableCell padding="checkbox">
                                <Typography variant="caption">{item.userName || '--'}</Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardTemplate>
              );
            })}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

PersonInformationView.propTypes = {
  fields: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styles)(PersonInformationView);
