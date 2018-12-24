import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// ICONS
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  expansionPanel: {
    backgroundColor: theme.palette.grey['100'],
    borderRadius: theme.spacing.unit * 0.5,
    marginTop: theme.spacing.unit * 2,
    padding: '0',
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    backgroundColor: '#fff',
    paddingTop: '0',
    border: `2px solid ${theme.palette.grey['100']}`,
    overflow: 'visible',
  },
  expansionPanelSummary: {
    display: 'block',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  expansionPanelDetails: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },
  tableHeader: {
    backgroundColor: theme.palette.grey['100'],
    marginTop: theme.spacing.unit * 2,
  },
  tableItem: {
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    paddingTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    marginTop: 27,
  },
  suggestionsContainerOpen: {
    backgroundColor: theme.palette.grey['100'],
    position: 'absolute',
    zIndex: 1,
    marginTop: '2px',
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: 240,
    marginTop: 10,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

const SettingsTable = props => {
  const { classes, settingUid, description, exceptions, setUpdateException, openModalDeleteException, order, disableEdit } = props;

  return (
    <React.Fragment>
      {exceptions.length > 0 ?
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ minWidth: '600px' }}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Typography component="p" align="left">
                    {description.includes('dias') ?
                      <FormattedMessage
                        id="common.quantity_days"
                        defaultMessage="Quantidade de Dias"
                        description="Rótulo comum - Quantidade de Dias"
                      /> :
                      <FormattedMessage
                        id="common.quantity_cycles"
                        defaultMessage="Quantidade de Ciclos"
                        description="Rótulo comum - Quantidade de Ciclos"
                      />}
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" align="left">
                    <FormattedMessage
                      id="common.commercial_structure"
                      defaultMessage="Estrutura Comercial"
                      description="Rótulo comum - Estrutura Comercial"
                    />
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <Typography component="p" align="left">
                    <FormattedMessage
                      id="common.actions"
                      defaultMessage="Ações"
                      description="Rótulo comum - Ações"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exceptions.map(exception => {
                return (
                  <TableRow key={exception.settingExceptionUid}>
                    <TableCell padding="checkbox">
                      <Typography align="left">{exception.settingExceptionValue}</Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Typography align="left">
                        {exception.structureCode} - {exception.structureName}
                      </Typography>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        onClick={setUpdateException(order, settingUid, exception)}
                        disabled={disableEdit}
                        className={classes.button}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        disabled={disableEdit}
                        className={classes.button}
                        onClick={openModalDeleteException(exception.settingExceptionUid)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div> : <Typography align="center">
          <FormattedMessage
            id="common.not_found"
            defaultMessage="Nada para mostrar"
            description="Rótulo comum - Nada para mostrar"
          />
        </Typography>
      }
    </React.Fragment>
  );
};

SettingsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  fields: PropTypes.object,
  lists: PropTypes.object,
  setting: PropTypes.object,
  state: PropTypes.object,
  order: PropTypes.number,
  settingUid: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  exceptions: PropTypes.array.isRequired,
  setUpdateException: PropTypes.func.isRequired,
  openModalDeleteException: PropTypes.func.isRequired,
  disableEdit: PropTypes.func.isRequired,
};

export default withStyles(styles)(SettingsTable);
