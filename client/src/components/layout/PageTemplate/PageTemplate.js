import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Parallax from '../../Parallax/Parallax';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: '-30px',
    position: 'relative',
    maxWidth: '860px',
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: '12',
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: '12',
    width: '100%',
  },
});

const PageTemplate = ({ classes, pageTitle, headerImage, children }) => {
  return (
    <div>
      <Parallax filter small image={headerImage}>
        <Typography component="h1" variant="display2" className={classes.headerTitle}>
          {pageTitle}
        </Typography>
      </Parallax>
      <Paper className={classes.root} elevation={1}>
        {children}
      </Paper>
    </div>
  )
}

PageTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
  pageTitle: PropTypes.string.isRequired,
  headerImage: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(PageTemplate);
