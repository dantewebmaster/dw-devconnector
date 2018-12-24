import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  tableHeader: {
    backgroundColor: theme.palette.grey['200'],
    marginTop: theme.spacing.unit * 2,
  },
});

const tableItemsHeader = props => {
  const { classes } = props;
  return (
    <TableHead className={classes.tableHeader} style={{ fontWeight: 'bold' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Typography component="p">
            <FormattedMessage
              id="common.cycle"
              defaultMessage="Ciclo"
              description="Rótulo comum - Ciclo"
            />
          </Typography>
        </TableCell>
        <TableCell padding="checkbox">
          <Typography component="p" align="center">
            <FormattedMessage
              id="common.priority"
              defaultMessage="Prioridade"
              description="Rótulo comum - Prioridade"
            />
          </Typography>
        </TableCell>
        <TableCell padding="checkbox">
          <Typography component="p" align="center">
            <FormattedMessage
              id="common.origin"
              defaultMessage="Origem"
              description="Rótulo da coluna - Origem"
            />
          </Typography>
        </TableCell>
        <TableCell padding="checkbox">
          <Typography component="p" align="center">
            <FormattedMessage
              id="common.destination"
              defaultMessage="Destino"
              description="Rótulo comum - Destino"
            />
          </Typography>
        </TableCell>
        <TableCell padding="checkbox">
          <Typography component="p" align="center">
            <FormattedMessage
              id="common.actions"
              defaultMessage="Ações"
              description="Rótulo comum - Ações"
            />
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

tableItemsHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(tableItemsHeader);
