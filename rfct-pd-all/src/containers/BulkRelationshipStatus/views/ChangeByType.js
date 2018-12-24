import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  tabContent: {
    marginTop: theme.spacing.unit * 6,
  },
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabRoot: {
    minWidth: 160,
    marginRight: theme.spacing.unit * 4,
    fontWeight: 700,
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
  },
});

const ChangeByType = ({ currentTab, tabContent, handlers, classes, disabledTab }) => {
  const disableByDate = !handlers.hasAccess('bulk-relationship-status');
  const disableByFile = !handlers.hasAccess('bulk-relationship-status/file');

  return (
    <React.Fragment>
      <Tabs
        value={currentTab}
        indicatorColor="primary"
        textColor="primary"
        classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        onChange={handlers.tabChange}
      >
        <Tab
          disabled={disableByDate || disabledTab}
          label={<FormattedMessage
            id="common.by_end_date"
            defaultMessage="Por Data de Fechamento"
            description="Rótulo comum - Por Data de Fechamento"
          />}
          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
        />
        <Tab
          disabled={disableByFile || disabledTab}
          label={<FormattedMessage
            id="common.by_file"
            defaultMessage="Por Arquivo"
            description="Rótulo comum - Por Arquivo"
          />}
          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
        />
        <Tab
          label={<FormattedMessage
            id="common.processing"
            defaultMessage="Processamentos"
            description="Rótulo comum - Processamentos"
          />}
          disabled={disableByDate || disableByFile}
          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
        />
      </Tabs>
      <Divider />
      <div className={classes.tabContent}>{tabContent}</div>
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

