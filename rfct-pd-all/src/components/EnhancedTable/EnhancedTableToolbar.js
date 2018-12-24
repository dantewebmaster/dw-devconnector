import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light' ? {
      color: theme.palette.primary.main,
      backgroundColor: lighten(theme.palette.primary.light, 0.85),
    } : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: '0 0 auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const isRequiredByMissingProp = (missingPropName) => (props, propName, componentName) => {
  if (!props[missingPropName] && !props[propName])
    return new Error(
      `The prop '${missingPropName}' or '${propName}' is required in '${componentName}', ` +
      `but their values are '${missingPropName}': ${props[missingPropName]} and ` +
      `'${propName}': ${props[propName]}.`
    );
};

let EnhancedTableToolbar = ({ numSelected, classes, tableTitle, actions, showSelectedOnly, onDelete, onShowItems, disableDelete }) => {

  const getToolbarActions = () => {
    const actionsLabels = {
      "delete": <FormattedMessage
        id="common.delete"
        defaultMessage="Excluir"
        description="Rótulo comum - Excluir"
      />,
      "showSelectedOnly": <FormattedMessage
        id="common.show_selected"
        defaultMessage="Visualizar selecionados"
        description="Rótulo comum - Visualizar selecionados"
      />,
      "showAll": <FormattedMessage
        id="common.show_all"
        defaultMessage="Visualizar todos"
        description="Rótulo comum - Visualizar todos"
      />
    };

    return actions || (numSelected > 0 &&
      <React.Fragment>
        {!showSelectedOnly ?
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            aria-label={actionsLabels.showSelectedOnly}
            onClick={onShowItems}
          >
            <VisibilityOff className={classes.leftIcon} /> {actionsLabels.showSelectedOnly}
          </Button> :
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            aria-label={actionsLabels.showAll}
            onClick={onShowItems}
          >
            <Visibility className={classes.leftIcon} /> {actionsLabels.showAll}
          </Button>}
        {onDelete && <Button
          variant="contained"
          className={classes.button}
          color="secondary"
          aria-label={actionsLabels.delete}
          disabled={numSelected === 0 || disableDelete}
          onClick={onDelete}
        >
          <DeleteIcon className={classes.leftIcon} /> {actionsLabels.delete}
        </Button>}
      </React.Fragment>);
  };

  return (
    <Toolbar
      className={
        classNames(
          classes.root,
          { [classes.highlight]: numSelected > 0 },
          { [classes.spaceBetween]: !!actions }
        )
      }
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit">
            <FormattedMessage
              id="table.toolbar.selected_qty"
              defaultMessage="{numSelected} selecionado(s)"
              description="Rótulo de informação na barra de ferramentas de tabela - # selecionados"
              values={{ numSelected }}
            />
          </Typography>
        ) : (
            <Typography variant="button" id="tableTitle" style={{ fontWeight: 'bold' }}>
              {tableTitle}
            </Typography>
          )}
      </div>
      <div className={classes.actions}>{getToolbarActions()}</div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  actions: PropTypes.object,
  classes: PropTypes.object.isRequired,
  disableDelete: PropTypes.bool,
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  showSelectedOnly: PropTypes.bool,
  onDelete: PropTypes.oneOfType([
    isRequiredByMissingProp('actions'),
    PropTypes.func,
  ]),
  onShowItems: isRequiredByMissingProp('actions'),
};

export default withStyles(styles)(EnhancedTableToolbar);
