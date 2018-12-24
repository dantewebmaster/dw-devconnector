import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// ICONS
import ArrowDropdownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropupIcon from '@material-ui/icons/ArrowDropUp';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

const MenuItemWithSubmenuTemplate = ({ classes, collapseHandler, isOpen, icon, menuText, children }) => {
  return (
    <div>
      <Link
        onClick={collapseHandler}
        className={classes.menuItem}
      >
        <ListItem button className={classes.menuLink}>

          {isOpen ?
            <ArrowDropupIcon className={classes.submenuArrow} /> :
            <ArrowDropdownIcon className={classes.submenuArrow} />}

          {icon &&
            <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>}
          <ListItemText
            primaryTypographyProps={{ variant: 'caption', component: 'li' }}
            classes={!isOpen ? { primary: classes.primary } : { primary: classes.submenuOpen }}
          >
            {menuText && menuText}
          </ListItemText>
        </ListItem>
      </Link>

      {children &&
        <Collapse in={isOpen} timeout={"auto"} unmountOnExit>{children}</Collapse>}
    </div>
  );
};

MenuItemWithSubmenuTemplate.propTypes = {
  collapseHandler: PropTypes.func.isRequired,
  children: PropTypes.node,
  menuText: PropTypes.node.isRequired,
  icon: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styles)(MenuItemWithSubmenuTemplate);
