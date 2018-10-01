import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { container } from '../../styles/global-styles';

const styles = {
  container: {
    ...container,
    padding: 40,
  }
};

const Footer = ({ classes }) => {
  return (
    <footer className={classes.container}>
      <Typography variant="body2" align="center">Copyright &copy; {new Date().getFullYear()} DevConnector</Typography>
    </footer>
  )
}

export default withStyles(styles)(Footer);
