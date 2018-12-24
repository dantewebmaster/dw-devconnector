import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4,
    width: '100%',
    'div': {
      margin: theme.spacing.unit * 1,
    },
  },
  text: {
    margin: theme.spacing.unit * 2,
  },
  icon: {
    margin: 0,
  },
});

const NotFound = ({ text, buttonLabel, buttonAction, classes }) => {
  return (
    <Paper className={classes.card}>
      <InfoIcon className={classes.icon} />
      <div>{text && <Typography className={classes.text}>{text}</Typography>}</div>
      {buttonLabel && buttonAction &&
        <div><Button variant="outlined" size="large" onClick={buttonAction}>{buttonLabel}</Button></div>}
    </Paper>
  );
};

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired,
  buttonLabel: PropTypes.object,
  buttonAction: PropTypes.func,
};

export default withStyles(styles)(NotFound);
