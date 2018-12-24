import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  tabsRoot: {
    paddingTop: theme.spacing.unit,
  },
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabRoot: {
    minWidth: 160,
    marginRight: theme.spacing.unit * 3,
    fontWeight: 700,
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
  },
});

const ChangeByType = ({ currentTab, tabContent, handlers, classes, disabledTab }) => {

  const disableByPerson = !handlers.hasAccess('scheduling');
  const disableByStructure = !handlers.hasAccess('scheduling/structure');
  const disableByFile = !handlers.hasAccess('scheduling/file');

  return (
    <React.Fragment>
      <CardContent>
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          onChange={handlers.tabChange}
        >
          <Tab
            label="Por CN"
            disabled={disableByPerson}
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
          <Tab
            disabled={disableByStructure || disabledTab}
            label="Por Estrutura"
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
          <Tab
            disabled={disableByFile || disabledTab}
            label="Por Arquivo"
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
          <Tab
            label="Processamentos"
            disabled={disableByStructure || disableByFile}
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          />
        </Tabs>
        <Divider />
      </CardContent>
      <CardContent>{tabContent}</CardContent>
    </React.Fragment>
  );
};

ChangeByType.propTypes = {
  currentTab: PropTypes.number.isRequired,
  tabContent: PropTypes.object.isRequired,
  handlers: PropTypes.object,
  classes: PropTypes.object,
  disabledTab: PropTypes.bool,
};

export default withStyles(styles)(ChangeByType);

