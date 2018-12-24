import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
// CUSTOM COMPONENTS
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';

const styles = () => ({
  root: {
    width: '100%',
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const omitColumns = ['id', 'order', 'label', 'mapKey', 'hidden', 'rowKey'];

class EnhancedTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      order: 'desc',
      orderBy: props.orderBy || props.columns.find(i => !i.hidden).id,
      selected: [],
      showSelectedOnly: false,
      data: [],
      fetchedPage: 0,
      page: props.page || 0,
      rowsPerPage: 10,
      rowsPerPageOptions: props.rowsPerPageOptions,
    };
  }

  componentDidMount() {
    const rowKey = _.find(this.props.columns, ['rowKey', true]).id;
    let data = _.unionBy(this.state.data, this.props.data, rowKey);

    this.setState({ data });
  }

  componentDidUpdate(prevProps) {
    const { onChangePage } = this.props;
    if (!_.isEqual(prevProps.data, this.props.data)) {
      if (onChangePage) {
        const data  = this.getDataFromState();

        let page = 0;
        if(this.props.page !== undefined)
          page = this.props.page;
        else
          page = this.state.page;

        this.setState({ data, page, fetchedPage: page });

        if (this.props.resetSelected) {
          this.setState({ selected: [] });
        }
      } else {
        const data  = this.getDataFromState();

        let page = 0;
        if(this.props.page !== undefined)
          page = this.props.page;
        else
          page = this.state.page;

        this.setState({ data, page, fetchedPage: page });
      }
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    const { columns, onRowSelect } = this.props;

    const rowKey = _.find(columns, ['rowKey', true]).id;

    if (checked) {
      this.setState({ selected: this.state.data.map(n => n[rowKey]) }, () => {
        if (onRowSelect)
          onRowSelect(this.state.selected);
      });
      return;
    }

    this.setState({ selected: [] }, () => {
      if (onRowSelect)
        onRowSelect(this.state.selected);
    });
  };

  handleClick = (id) => () => {
    const { selected } = this.state;
    const { onRowSelect, selectable } = this.props;

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    if (selectable)
      this.setState({ selected: newSelected }, () => {
        if (onRowSelect)
          onRowSelect(this.state.selected);
      });
  };

  handleChangePage = (event, page) => {
    const { onChangePage } = this.props;
    const { rowsPerPage } = this.state;

    if (onChangePage)
      this.setState({ page }, () => onChangePage(page, rowsPerPage));
    else
      this.setState({ page });
  };

  handleShowItems = () => this.setState({ showSelectedOnly: !this.state.showSelectedOnly });

  handleDelete = () => {
    const { onDelete } = this.props;
    const { selected } = this.state;

    if (onDelete && selected.length > 0) onDelete(selected);
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  getCellContent = (row) => {
    const { columns } = this.props;

    return Object.keys(row).map((key, colIndex) => {
      const column = columns.find(c => c.id === key);
      if (column && !column.hidden)
        return <TableCell
          key={`EnhancedTableCell_${_.uniqueId()}`}
          {..._.omit(columns[colIndex], omitColumns)}
          padding="checkbox"
          style={{ fontSize: '12px' }}
        >
          {row[key]}
        </TableCell>;

      return null;
    }).filter(Boolean);
  };

  getBodyContent = (payload) => {
    const { columns, selectable } = this.props;
    const { rowsPerPage, page } = this.state;

    const rowKey = _.find(columns, ['rowKey', true]).id;

    let slice = [];
    if (this.props.onChangePage) {
      slice = payload;
    } else {
      slice = payload.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }

    return slice.map((n, index) => {
      const isSelected = this.isSelected(n[rowKey]);
      return (
        <TableRow
          hover
          role="checkbox"
          aria-checked={isSelected}
          tabIndex={-1}
          key={`EnhancedTable_row_#${index}`}
          selected={isSelected}
        >
          {selectable &&
            <TableCell padding="checkbox">
              <Checkbox checked={isSelected} onClick={this.handleClick(n[rowKey])} />
            </TableCell>}
          {this.getCellContent(n)}
        </TableRow>
      );
    });
  };

  getDataFromState() {
    if (this.props.onChangePage) {
      return this.props.data;
    } else{
      const rowKey = _.find(this.props.columns, ['rowKey', true]).id;
      return _.unionBy(this.state.data, this.props.data, rowKey);
    }
  }

  render() {
    const { classes, columns, tableTitle, total, toolbar, toolbarActions, selectable, disableDelete } = this.props;
    const { order, orderBy, selected, rowsPerPage, rowsPerPageOptions, page, showSelectedOnly } = this.state;

    const data  = this.getDataFromState();
    const totalLength = total || data.length;

    const rowKey = _.find(columns, ['rowKey', true]).id;

    const filteredData = (showSelectedOnly && data.filter(item => this.isSelected(item[rowKey]))) || data;

    return (
      <Paper className={classes.root} elevation={1}>
        {toolbar &&
        <EnhancedTableToolbar
            actions={toolbarActions}
            tableTitle={tableTitle}
            numSelected={this.state.selected.length}
            showSelectedOnly={showSelectedOnly}
            onShowItems={this.handleShowItems}
            onDelete={this.props.hideDelete ? undefined : this.handleDelete}
            disableDelete={disableDelete}
          />}
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={filteredData.length}
              selectable={selectable}
            />
            <TableBody style={{ maxHeight: '600px', overflow: 'auto' }}>
              {this.getBodyContent(_.uniqBy(filteredData, rowKey))}
            </TableBody>
          </Table>
        </div>
        {totalLength >= rowsPerPageOptions[0] &&
          <TablePagination
            component="div"
            count={totalLength}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            page={page}
            labelDisplayedRows={({ from, to, count }) => {
              return <FormattedMessage
                id="pagination.displayed_rows"
                defaultMessage="{from} - {to} de {count}"
                description="Rótulo de paginação"
                values={{ from, to, count }}
              />;
            }}
            labelRowsPerPage={<FormattedMessage
              id="common.rows_per_page"
              defaultMessage="Linhas por página:"
              description="Rótulo comum - Linhas por página"
            />}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />}
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  selectable: PropTypes.bool,
  tableTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  total: PropTypes.number,
  toolbar: PropTypes.bool,
  toolbarActions: PropTypes.object,
  onRowSelect: PropTypes.func,
  onDelete: PropTypes.func,
  onChangePage: PropTypes.func,
  disableDelete: PropTypes.bool,
  hideDelete: PropTypes.bool,
  resetSelected: PropTypes.bool,
};

EnhancedTable.defaultProps = {
  selectable: true,
  toolbar: true,
  resetSelected: false,
  rowsPerPageOptions: [10],
};

export default withStyles(styles)(EnhancedTable);
