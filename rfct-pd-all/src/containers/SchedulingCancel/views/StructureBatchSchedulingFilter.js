import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import StructureHierarchy from './StructureHierarchy';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  fieldsetRoot: {
    width: '100%',
  },
  radioGroupRoot: {
    flexDirection: 'row',
  },
  actions: {
    marginTop: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 4,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
});

const StructureBatchSchedulingFilter = ({ fields, lists, handlers, classes }) => {
  const structureChange = field => structure => handlers.structureChange({ key: field, value: structure });

  const findLowestLevelStructure = field => fields[field] && handlers.findLowestLevelStructure(fields[field]);

  const lowestLevel = findLowestLevelStructure('schedulingByStructureOriginValues');

  return <React.Fragment>
    <Grid container spacing={0} style={{ padding: '40px 0' }} justify="flex-start" alignContent="center">
      <StructureHierarchy
        values={fields.schedulingByStructureOriginValues}
        structureLevels={lists.structureLevels}
        onChange={structureChange('schedulingByStructureOriginValues')}
      />
    </Grid>
    <Divider />
    <Grid container spacing={40}>
      <Grid item xs={3} style={{ margin: '40px 0 30px 0' }}>
        <Typography variant="caption">
          <FormattedMessage
            id="scheduling.structure.cycle"
            defaultMessage="Ciclo"
            description="Ciclo"
          />
        </Typography>
        <Select
          fullWidth
          value={fields.selectCycle}
          onChange={handlers.fieldChange('selectCycle')}
          disabled={lists.cycles.length === 0}
        >
          {lists.cycles.map(cycle => <MenuItem key={cycle.cycleCode} value={cycle.cycleCode}>{cycle.cycleCode}</MenuItem>)}
        </Select>
      </Grid>
    </Grid>
    <Divider />
    <Grid container justify="space-between" alignItems="center" className={classes.actions}>
      <Button
        size="large"
        variant="outlined"
        onClick={handlers.handleCancel}
      >
        <FormattedMessage
          id="common.cancel"
          defaultMessage="Cancelar"
          description="Rótulo comum - Cancelar"
        />
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!lowestLevel || fields.selectCycle === ''}
        onClick={handlers.searchByStructure}
      >
        <FormattedMessage
          id="common.search"
          defaultMessage="Pesquisar"
          description="Rótulo comum - Pesquisar"
        />
      </Button>
    </Grid>

  </React.Fragment>;
};

StructureBatchSchedulingFilter.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(styles)(StructureBatchSchedulingFilter);
