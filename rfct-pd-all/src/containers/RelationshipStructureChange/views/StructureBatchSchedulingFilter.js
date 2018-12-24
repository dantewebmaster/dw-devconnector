import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import SelectStructureHierarchy from 'Components/StructureMoveCard/SelectStructureHierarchy';

const styles = () => ({
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
    marginTop: 0,
  },
});

const StructureBatchSchedulingFilter = ({ fields, lists, handlers, classes }) => {
  const structureChange = (field) => (structure) => {
    handlers.structureChange({ key: field, value: structure });
  };

  const findLowestLevelStructure = (field) => {
    return fields[ field ] && handlers.findLowestLevelStructure(fields[ field ]);
  };

  return <React.Fragment>
    <Grid container spacing={40} style={{ padding: '40px 0 16px' }} justify="center">
      <Grid item md={6} style={{ paddingTop: 0 }}>
        <Grid container>
          <Grid item xs>
            <SelectStructureHierarchy
              values={fields.schedulingByStructureOriginValues}
              structureLevels={lists.structureLevels}
              onChange={structureChange('schedulingByStructureOriginValues')}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <FormControl component="fieldset" classes={{ root: classes.fieldsetRoot }} required>
              <FormLabel component="legend">
                <FormattedMessage
                  id="labels.show"
                  defaultMessage="Exibir:"
                  description="Rótulo de parâmetro de pesquisa - Exibir"
                />
              </FormLabel>
              <RadioGroup
                aria-label="search for"
                name="schedulingByStructureQueryType"
                className={classes.radioGroupRoot}
                value={fields.schedulingByStructureQueryType.toString()}
                onChange={handlers.fieldChange('schedulingByStructureQueryType')}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label={<FormattedMessage
                    id="common.all"
                    defaultMessage="Todos"
                    description="Rótulo comum - Todos"
                  />}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label={<FormattedMessage
                    id="common.scheduled"
                    defaultMessage="Agendadas"
                    description="Rótulo comum - Agendadas"
                  />}
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label={<FormattedMessage
                    id="common.not_scheduled"
                    defaultMessage="Não agendadas"
                    description="Rótulo comum - Não agendadas"
                  />}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6} style={{ paddingTop: 0 }}>
        <Grid container>
          <Grid item xs>
            <SelectStructureHierarchy
              values={fields.schedulingByStructureDestinyValues}
              structureLevels={lists.structureLevels}
              onChange={structureChange('schedulingByStructureDestinyValues')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={6}>
        <Grid container justify="center" alignItems="flex-start" className={classes.actions}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!findLowestLevelStructure('schedulingByStructureOriginValues')}
              onClick={handlers.searchByStructure}
            >
              <FormattedMessage
                id="common.search"
                defaultMessage="Pesquisar"
                description="Rótulo comum - Pesquisar"
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container justify="center" alignItems="flex-start">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!findLowestLevelStructure('schedulingByStructureDestinyValues')}
              onClick={handlers.batchScheduleByStructure}
            >
              <FormattedMessage
                id="common.schedule"
                defaultMessage="Agendar"
                description="Rótulo comum - Agendar"
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
