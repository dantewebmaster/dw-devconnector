import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginBottom: 0,
    paddingTop: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 7,
    paddingLeft: theme.spacing.unit * 5,
    borderRadius: theme.spacing.unit,
    backgroundImage: 'linear-gradient(to right, #ffaaaa, #ffaaaa)',
    backgroundOrigin: 'border-box',
    backgroundSize: '100% 7px',
    backgroundPosition: 'top left, top right, bottom right, 1rem',
    backgroundRepeat: 'no-repeat',
    minHeight: '250px',
    wordWrap: 'break-word',
  },
  cardLink: {
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.grey['600'],
      textDecoration: 'none',
      headerTitle: {
        textDecoration: 'none',
      },
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
  },
  headerTitle: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
    },
  },
  icon: {
    color: theme.palette.grey['600'],
    fontSize: '40px',
    marginRight: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },
  cardDesc: {
    lineHeight: 2,
  },
});

const HomeCard = props => {
  const {
    classes,
    title,
    desc,
    icon,
    linkTo,
  } = props;

  return (
    <Link to={linkTo && linkTo} className={classes.cardLink}>
      <Paper className={classes.root} elevation={2}>
        <div className={classes.cardHeader}>
          <i className={classes.icon}>{icon}</i>
          <Typography variant="headline" component="h3" className={classes.headerTitle}>{title}</Typography>
        </div>
        <Divider className={classes.divider} />
        <Typography component="p" className={classes.cardDesc}>{desc}</Typography>
      </Paper>
    </Link>
  );
};

HomeCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  desc: PropTypes.object.isRequired,
  icon: PropTypes.any,
  linkTo: PropTypes.string,
};

export default withStyles(styles)(HomeCard);
