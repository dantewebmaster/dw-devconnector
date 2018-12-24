import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 4,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
});

const SchedulingActions = props => {
  const { classes, onCancel } = props;

  return (<React.Fragment>
    <CardContent className={classes.cardActions}>
      <Button
        size="large"
        variant="outlined"
        onClick={onCancel}
      >
        <FormattedMessage
          id="common.cancel"
          defaultMessage="Cancelar"
          description="Rótulo comum - Cancelar"
        />
      </Button>
    </CardContent>
  </React.Fragment>);
};

SchedulingActions.propTypes = {
  classes: PropTypes.object,
  disabledButton: PropTypes.bool,
  onSchedule: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default withStyles(styles)(SchedulingActions);
