import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.grey['100'],
    textTransform: 'uppercase',
    '& p': {
      textTransform: 'uppercase',
    },
  },
});

class EnhancedTableHead extends PureComponent {
  createSortHandler = property => event => this.props.onRequestSort(event, property);

  render() {
    const { columns, onSelectAllClick, order, orderBy, numSelected, rowCount, selectable, classes } = this.props;
    return (
      <TableHead className={classes.root}>
        <TableRow>
          {selectable &&
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>}
          {_.orderBy(columns, ['order']).filter(col => !col.hidden).map(column => {
            return (
              <TableCell
                key={column.mapKey}
                numeric={column.numeric}
                padding="checkbox"
                sortDirection={orderBy === column.id ? order : false}
              >
                <Typography variant="body2" component="p">{column.label}</Typography>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object,
  columns: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  selectable: PropTypes.bool,
};

EnhancedTableHead.defaultProps = {
  selectable: false
};

export default withStyles(styles)(EnhancedTableHead);
