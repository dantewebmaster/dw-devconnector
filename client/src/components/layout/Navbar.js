import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';

// MU Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
  title: {
    fontSize: '18px',
    fontWeight: '300',
    flexGrow: 1,
    textDecoration: 'none',
  },
  avatar: {
    marginRight: '8px',
    marginLeft: '8px',
  },
  leftIcon: {
    marginRight: '16px',
  },
  appBar: {
    backgroundColor: 'transparent',
    padding: 16,
  },
};

class Navbar extends Component {
  state = {
    anchorEl: null,
  }

  onLogoutClick = e => {
    e.preventDefault();
    const { logoutUser, clearCurrentProfile } = this.props;
    clearCurrentProfile();
    logoutUser();
    this.handleClose();
  };

  onOpenUserMenu = e => this.setState({ anchorEl: e.currentTarget })

  handleClose = () => this.setState({ anchorEl: null });

  render() {
    const { classes, auth: { isAuthenticated, user } } = this.props;

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const authLinks = (
      <React.Fragment>
        <Button component={Link} to="/feed" color="inherit">Feed</Button>
        <Avatar alt={user.name} src={user.avatar} className={classes.avatar} />
        <div>
          <IconButton
            color="inherit"
            aria-label="User menu"
            aria-owns={open ? 'user-menu' : null}
            aria-haspopup="true"
            onClick={this.onOpenUserMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.onLogoutClick}>
              <ExitToAppIcon className={classes.leftIcon} /> Sair
            </MenuItem>
            <MenuItem component={Link} to="/dashboard" onClick={this.handleClose}>
              <SettingsIcon className={classes.leftIcon} /> Dashboard
            </MenuItem>
          </Menu>
        </div>
      </React.Fragment>
    );

    const guestLinks = (
      <React.Fragment>
        <Button component={Link} to="/register" color="inherit">Register</Button>
        <Button component={Link} to="/login" color="inherit">Login</Button>
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.title}
            // component={Link}
            // to="/"
            >
              DevConnector
            </Typography>
            <Button component={Link} to="/profiles" color="inherit">Developpers</Button>
            {isAuthenticated ? authLinks : guestLinks}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps, { logoutUser, clearCurrentProfile }
)(withStyles(styles)(Navbar));
