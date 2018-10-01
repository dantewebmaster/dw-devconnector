import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Parallax from '../Parallax/Parallax';

import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
  container: {
    zIndex: '12',
    padding: 32,
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: '4.2rem',
    fontWeight: '600',
  },
  headline: {
    color: '#D7D7D7',
    fontWeight: '300',
    marginBottom: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
  }
});

class Landing extends Component {

  componentDidMount() {
    const { auth: { isAuthenticated }, history } = this.props;
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Parallax filter image={require("../../img/showcase.jpg")}>
          <div className={classes.container}>
            <Typography component="h1" className={classes.title}>Developer Connector.</Typography>

            <Typography variant="headline" className={classes.headline}>
              Create a developer profile/portfolio, share posts and get help from other developers
            </Typography>

            <Button
              component={Link}
              to="/register"
              size="large"
              variant="extendedFab"
              color="primary"
              className={classes.button}
            >Sign Up</Button>

            <Button
              component={Link}
              to="/login"
              size="large"
              variant="extendedFab"
              color="secondary"
              className={classes.button}
            >Login</Button>
          </div>
        </Parallax>
      </React.Fragment>
    )
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(withStyles(styles)(Landing));
