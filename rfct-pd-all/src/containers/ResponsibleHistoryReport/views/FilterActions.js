import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';
// import { CardActions } from '@material-ui/core';

const styles = theme => ({
  filterActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 4,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
});

const filterActions = props => {
  const { classes, disableSubmit, onCancel, onSubmit } = props;

  return (
    <CardActions className={classes.filterActions}>
      <Button
        variant="outlined"
        size="large"
        onClick={onCancel}
      >
        <FormattedMessage
          id="common.clear"
          defaultMessage="Limpar"
          description="Rótulo comum - Limpar"
        />
      </Button>
      <Button
        variant="contained"
        size="large"
        color="primary"
        disabled={disableSubmit}
        onClick={onSubmit}
      >
        <SearchIcon style={{ marginRight: '16px' }} />
        <FormattedMessage
          id="common.search"
          defaultMessage="Pesquisar"
          description="Rótulo comum - Pesquisar"
        />
      </Button>
    </CardActions>
  );
};

filterActions.propTypes = {
  classes: PropTypes.object.isRequired,
  disableSubmit: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(filterActions);
