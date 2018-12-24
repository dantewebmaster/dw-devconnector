import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import EventIcon from '@material-ui/icons/Event';
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
    borderTop: `1px solid ${theme.palette.divider}`
  },
});

const SchedulingActions = (props) => {
  const { classes, disabledButton, onSchedule, onCancel, buttonLabel } = props;
  return (
    <CardContent className={classes.cardActions}>
      <Button
        size="large"
        variant="outlined"
        onClick={onCancel}>
        <FormattedMessage
          id="common.cancel"
          defaultMessage="Cancelar"
          description="Rótulo comum - Cancelar"
        />
      </Button>
      <Button
        variant="contained"
        size="large"
        color="primary"
        disabled={disabledButton}
        onClick={onSchedule}
      >
        <EventIcon className={classes.leftIcon} /> {buttonLabel}
      </Button>
    </CardContent>);
};

SchedulingActions.propTypes = {
  classes: PropTypes.object,
  disabledButton: PropTypes.bool,
  onSchedule: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  buttonLabel: PropTypes.object.isRequired,
};

export default withStyles(styles)(SchedulingActions);
