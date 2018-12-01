import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
// ICONS
import Apps from '@material-ui/icons/Apps';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// CUSTOM COMPONENTS
import MenuSidebar from './MenuSidebar/MenuSidebar';

class Template extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      anchorEl: null,
      anchorEl2: null,
      miniMenuOpen: false,
    };
  }

  handleDrawerClick = () => this.setState({ open: !this.state.open });

  handleLanguage = event => {
    this.props.onChangeLanguage(event.currentTarget.id);
    this.setState({ anchorEl2: null });
  };

  handleOpenMiniMenu = event => this.setState({ miniMenuOpen: event.currentTarget });

  handleClose = () => this.setState({ miniMenuOpen: null });

  render() {
    const { classes, user, locale, module } = this.props;
    const { open, miniMenuOpen } = this.state;

    return (
      <div className={classes.root}>
        {module &&
          <AppBar
            elevation={0}
            position="absolute"
            className={classNames(classes.appBar, open && classes.appBarShift)}
          >
            <header className={classNames(classes.background)} style={{ backgroundColor: `${module.color}` }} />
            <Toolbar
              disableGutters={!open}
              className={classNames(classes.toolbar, classes.borderBottom)}
            >
              <div className={classNames(classes.block, classes.blockLeft)}>
                {!open &&
                  <IconButton
                    aria-label="open drawer"
                    onClick={this.handleDrawerClick}
                    className={classNames(classes.menuButtonDrawer)}
                  >
                    <MenuIcon className={classNames(open && classes.hide)} />
                  </IconButton>}
                <Typography color="textSecondary">
                  {module.businessModel.businessModelName && module.businessModel.businessModelName}
                </Typography>
              </div>
              <div className={classNames(classes.typography)} style={{ backgroundColor: `${module.color}` }}>
                <div className={classNames(classes.row)}>
                  <div className={classes.divLeft} style={{ backgroundColor: `${module.color}` }} />
                  <header className={classNames(classes.title)}>
                    <Typography
                      noWrap
                      align="center"
                      variant="headline"
                      className={classNames(classes.titleH1)}
                    >
                      {module.name}
                    </Typography>
                  </header>
                  <div className={classes.divRight} style={{ backgroundColor: `${module.color}` }} />
                </div>
              </div>
              {window.innerWidth > 840 ?
                <div className={classNames(classes.block, classes.blockRight)}>
                  <TextField
                    id="select-language"
                    select
                    className={classes.textField}
                    value={locale}
                  >
                    <MenuItem
                      id="pt-BR"
                      key="pt-BR"
                      value="pt-BR"
                      onTouchTap={this.handleLanguage}
                      className={classes.textField}
                    >
                      <FormattedMessage
                        id="language.pt-BR"
                        defaultMessage="pt-BR"
                        description="language pt-BR"
                      />
                    </MenuItem>
                    <MenuItem
                      id="en"
                      key="en"
                      value="en"
                      onTouchTap={this.handleLanguage}
                      className={classes.textField}
                    >
                      <FormattedMessage
                        id="language.en"
                        defaultMessage="En"
                        description="language en"
                      />
                    </MenuItem>
                    <MenuItem
                      id="es"
                      key="es"
                      value="es"
                      onTouchTap={this.handleLanguage}
                      className={classes.textField}
                    >
                      <FormattedMessage
                        id="language.es"
                        defaultMessage="Es"
                        description="language es"
                      />
                    </MenuItem>
                  </TextField>
                  {module.country.code &&
                    <div className={classes.flags}>
                      <img
                        width="20"
                        height="20"
                        src={require(`../../assets/img/${module.country.code}.png`)}
                      />
                    </div>}
                  <IconButton
                    aria-haspopup="true"
                    className={classNames(classes.menuButton)}
                    onTouchTap={() => (window.location = process.env.BASE_URL)}
                  >
                    <Apps />
                  </IconButton>
                  <div className={classes.userName}>
                    <span className={classes.divider}>|</span>
                    <Typography>
                      {user.givenName.charAt(0).toUpperCase() + user.givenName.slice(1).toLowerCase()}
                    </Typography>
                  </div>
                </div> :
                <div>
                  <IconButton
                    aria-label="More"
                    aria-owns={miniMenuOpen ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleOpenMiniMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={miniMenuOpen}
                    open={Boolean(miniMenuOpen)}
                    onClose={this.handleClose}
                    PaperProps={{ style: { width: 200 } }}
                  >
                    <TextField
                      id="select-language"
                      select
                      className={classes.textField}
                      value={locale}
                    >
                      <MenuItem
                        id="pt-BR"
                        key="pt-BR"
                        value="pt-BR"
                        onTouchTap={this.handleLanguage}
                        className={classes.textField}
                      >
                        <FormattedMessage
                          id="language.pt-BR"
                          defaultMessage="pt-BR"
                          description="language pt-BR"
                        />
                      </MenuItem>
                      <MenuItem
                        id="en"
                        key="en"
                        value="en"
                        onTouchTap={this.handleLanguage}
                        className={classes.textField}
                      >
                        <FormattedMessage
                          id="language.en"
                          defaultMessage="En"
                          description="language en"
                        />
                      </MenuItem>
                      <MenuItem
                        id="es"
                        key="es"
                        value="es"
                        onTouchTap={this.handleLanguage}
                        className={classes.textField}
                      >
                        <FormattedMessage
                          id="language.es"
                          defaultMessage="Es"
                          description="language es"
                        />
                      </MenuItem>
                    </TextField>
                    {module.country.code &&
                      <div className={classes.flags}>
                        <img
                          width="20"
                          height="20"
                          src={require(`../../assets/img/${module.country.code}.png`)}
                        />
                      </div>}
                    <IconButton
                      aria-haspopup="true"
                      className={classNames(classes.menuButton)}
                      onTouchTap={() => (window.location = process.env.BASE_URL)}
                    >
                      <Apps />
                    </IconButton>
                  </Menu>
                </div>}
            </Toolbar>
          </AppBar>}
        <Drawer
          variant="permanent"
          classes={{ paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose) }}
          open={open}
        >
          <div className={classNames(classes.toolbar, classes.height)}>
            <img
              src={require('../../assets/img/logo-natura.png')}
              alt="Natura Logo"
              className={classes.logoNatura}
            />
            <IconButton onClick={this.handleDrawerClick} className={classNames(classes.menuButton)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <MenuSidebar
            sidebarOpen={open}
            submenuClick={this.handleDrawerClick}
            techParams={user.techParams}
          />
        </Drawer>
        <main className={classes.content} style={{ display: 'block', width: 'auto', overflow: 'auto' }}>
          {this.props.children}
        </main>
      </div>
    );
  }
}

Template.propTypes = {
  route: PropTypes.object,
  onChangeTheme: PropTypes.func,
  module: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  onChangeLanguage: PropTypes.func.isRequired,
};

export default withStyles(styles)(Template);
