import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SubjectIcon from '@material-ui/icons/Subject';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
// UTILS
import formatDate from 'Utils/formatDate';

// STYLES
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
  },
});

const searchResults = ({ classes, onExport, data }) => {
  return (
    <Card style={{ marginTop: '16px', width: 'auto' }}>
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
            description="Rótulo comum - Exportar"
          />
        </Button>
      </CardContent>

      <CardContent>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Typography component="p">
                    <FormattedMessage
                      id="common.user_code"
                      defaultMessage="Código do Usuário"
                      description="Rótulo comum - Código do Usuário"
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
                <TableCell padding="checkbox">
                  <Typography component="p">
                    <FormattedMessage
                      id="common.commercial_structure_code"
                      defaultMessage="Código da Estrutura"
                      description="Rótulo comum - Código da Estrutura"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p">
                    <FormattedMessage
                      id="common.structure_name"
                      defaultMessage="Nome da Estrutura"
                      description="Rótulo comum - Nome da Estrutura"
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
                      <Typography variant="caption">{item.name}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.structureCode}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.structureName}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.startCycle}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{item.endCycle || '--'}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{formatDate(item.startDate)}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography variant="caption">{formatDate(item.endDate)}</Typography>
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

searchResults.propTypes = {
  classes: PropTypes.object.isRequired,
  onExport: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(searchResults);
