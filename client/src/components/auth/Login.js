import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/LockOutlined';
import { Typography } from '@material-ui/core';

import Parallax from '../Parallax/Parallax';

const styles = theme => ({
  layout: {
    zIndex: 12,
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
  };

  componentDidMount() {
    const { auth: { isAuthenticated }, history } = this.props;
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps) {
    const { errors, auth: { isAuthenticated }, history } = this.props;

    if (isAuthenticated && isAuthenticated === true) {
      history.push('/dashboard');
    }

    if (errors && errors !== prevProps.errors) {
      this.setState({ errors })
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    const userData = {
      email,
      password,
    };

    this.props.loginUser(userData);
  }

  render() {
    const { errors, email, password } = this.state;

    const { classes } = this.props;

    return (
      <Parallax filter image={require("../../img/showcase.jpg")}>
        <div className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="h4" gutterBottom>Log In</Typography>
            <Typography variant="subtitle2">Sign in to your DevConnector account</Typography>
            <form noValidate onSubmit={this.onSubmit} className={classes.form}>
              <TextFieldGroup
                label="Email Address"
                placeholder="Email Address"
                name="email"
                type="email"
                value={email}
                error={errors.email}
                onChange={this.onChange}
              />
              <TextFieldGroup
                label="Your Password"
                placeholder="Password"
                name="password"
                type="password"
                value={password}
                error={errors.password}
                onChange={this.onChange}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                fullWidth
              >
                Login
              </Button>
            </form>
          </Paper>
        </div>
      </Parallax>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps, { loginUser }
)(withStyles(styles)(Login));
