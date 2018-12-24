import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    overflow: 'visible',
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    maxWidth: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit,
  },
  title: {
    marginLeft: theme.spacing.unit * 2,
  },
  icon: {
    '& > svg': {
      fontSize: '32px',
      marginLeft: theme.spacing.unit,
    },
  },
  content: {
    padding: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 3,
  },
});

const CardTemplate = props => {
  const { title, icon, classes } = props;
  return (
    <Paper className={classes.card} elevation={0}>
      {icon || title ?
        <div className={classes.header}>
          {icon &&
            <div className={classes.icon}>{icon}</div>}
          {title &&
            <Typography variant="h6" component="h3" className={classes.title}>
              {props.title}
            </Typography>}
        </div> : null}
      {title || icon ? <Divider /> : null}
      <div className={classes.content}>{props.children}</div>
    </Paper>
  );
};

CardTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.node,
  classes: PropTypes.object,
};

export default withStyles(styles)(CardTemplate);
