import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  filterActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 4,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
});

const ReportActions = ({ classes, disableSubmit, onCancel, onSubmit }) => {
  return (
    <CardContent className={classes.filterActions}>
      <Button
        size="large"
        variant="outlined"
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
    </CardContent>
  );
};

ReportActions.propTypes = {
  classes: PropTypes.object.isRequired,
  disableSubmit: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(ReportActions);
