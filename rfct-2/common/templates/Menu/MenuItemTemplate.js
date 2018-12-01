import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

const MenuItemTemplate = ({ classes, linkTo, icon, menuText, isSubmenu }) => {
  return (
    <Link
      to={linkTo}
      className={classes.menuItem}
      activeClassName="selected"
    >
      <ListItem
        button className={classes.menuLink}
        style={{ ...(isSubmenu ? { paddingLeft: '80px', minHeight: 'none' } : {}) }}
      >
        {icon &&
          <ListItemIcon className={classes.icon}>{icon && icon}</ListItemIcon>}

        {menuText &&
          <ListItemText classes={{ primary: classes.primary }}>{menuText}</ListItemText>}
      </ListItem>
    </Link>
  );
};

MenuItemTemplate.propTypes = {
  linkTo: PropTypes.string,
  menuText: PropTypes.node.isRequired,
  icon: PropTypes.node,
  classes: PropTypes.object,
  isSubmenu: PropTypes.bool,
};

export default withStyles(styles)(MenuItemTemplate);
