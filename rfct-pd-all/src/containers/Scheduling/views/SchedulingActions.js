import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import EventIcon from '@material-ui/icons/Event';
// import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
// import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 4,
  },
});

const SchedulingActions = ({ classes, disabledButton, onSchedule, onCancel }) => {
  return (
    <CardContent className={classes.cardActions}>
      <Button
        variant="outlined"
        size="large"
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
        <EventIcon className={classes.leftIcon} />
        <FormattedMessage
          id="common.schedule"
          defaultMessage="Agendar"
          description="Rótulo comum - Agendar"
        />
      </Button>
    </CardContent>
  );
};

SchedulingActions.propTypes = {
  classes: PropTypes.object,
  disabledButton: PropTypes.bool,
  onSchedule: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default withStyles(styles)(SchedulingActions);
