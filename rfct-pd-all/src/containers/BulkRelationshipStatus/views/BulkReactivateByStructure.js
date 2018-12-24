import React from 'react';
import PropTypes from 'prop-types';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import SearchFilter from './ReactivateByStructure/SearchFilter';
import SearchResults from './ReactivateByStructure/SearchResults';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit,
    '&:first-child': {
      marginLeft: 0,
    },
  },
  input: {
    display: 'none',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
  },
  progressLoader: {
    margin: theme.spacing.unit * 2,
  },
  progressLabel: {
    fontWeight: 'bold',
  },
});

const bulkReactivateByStructure = ({ fields, lists, handlers }) => {
  return (
    <React.Fragment>
      <SearchFilter fields={fields} lists={lists} handlers={handlers} />
      <SearchResults fields={fields} lists={lists} handlers={handlers} />
    </React.Fragment>
  );
};

bulkReactivateByStructure.propTypes = {
  classes: PropTypes.object,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default withStyles(styles)(bulkReactivateByStructure);
