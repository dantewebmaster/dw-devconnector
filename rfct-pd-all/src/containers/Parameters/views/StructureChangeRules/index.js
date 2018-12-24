import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

// ICONS
import IconAdd from '@material-ui/icons/Add';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import IconDelete from '@material-ui/icons/Delete';
import IconModeEdit from '@material-ui/icons/Edit';

// CUSTOM COMPONENTS
import TableItemsHeader from './TableItemsHeader';

const styles = theme => ({
  expansionPanel: {
    backgroundColor: theme.palette.grey['100'],
    borderRadius: theme.spacing.unit * 0.5,
    marginTop: theme.spacing.unit * 2,
    padding: '0',
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    backgroundColor: '#fff',
    paddingTop: '0',
    border: `2px solid ${theme.palette.grey['100']}`,
  },
  expansionPanelSummary: {
    display: 'block',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  expansionPanelDetails: {
    display: 'block',
    marginBottom: theme.spacing.unit * 4,
  },
  form: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
});

const structureChangeRules = props => {
  const {
    classes,
    parameters,
    fields,
    seted,
    fieldChange,
    updateParameter,
    addParameter,
    setUpdateParameter,
    setDeleteParameter,
    cancelUpdate,
    group,
    disableEdit
  } = props;

  const canEdit = () => {
    return seted.cycleOpen === fields.cycleOpen &&
      seted.priority == fields.priority &&
      seted.originStructureLevelId == fields.originStructureLevelId &&
      seted.destinationStructureLevelId == fields.destinationStructureLevelId;
  };

  const canAdd = () => {
    return fields.cycleOpen === -1 ||
      fields.priority === '' || fields.priority == 0 ||
      fields.originStructureLevelId === -1 ||
      fields.destinationStructureLevelId === -1;
  };

  const structureLevelNamesById = fields.structureLevelsHasPerson.reduce((obj, current) => {
    obj[current.structureLevel.structureLevelId] = current.structureLevel.structureLevelName;
    return obj;
  }, {});

  return (
    <ExpansionPanel classes={{ expanded: classes.expanded, root: classes.expansionPanel }} elevation={0}>
      <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={<IconExpandMore />}>
        <Typography component="h3">
          <FormattedMessage
            id="common.movement_types"
            defaultMessage="Tipos de Movimentação"
            description="Rótulo comum - Tipos de Movimentação"
          />
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <Grid container spacing={40} className={classes.form}>
          <Grid item sm={6} md={2}>
            <TextField
              select
              label={<FormattedMessage
                id="common.cycle"
                defaultMessage="Ciclo"
                description="Rótulo comum - Ciclo"
              />}
              value={fields.cycleOpen}
              onChange={fieldChange('cycleOpen')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value={0}>
                <FormattedMessage
                  id="common.closed"
                  defaultMessage="Fechado"
                  description="Rótulo comum - Fechado"
                />
              </MenuItem>
              <MenuItem value={1}>
                <FormattedMessage
                  id="common.opened"
                  defaultMessage="Aberto"
                  description="Rótulo comum - Aberto"
                />
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item sm={6} md={2}>
            <TextField
              type="number"
              label={<FormattedMessage
                id="common.priority"
                defaultMessage="Prioridade"
                description="Rótulo comum - Prioridade"
              />}
              value={fields.priority}
              onChange={fieldChange('priority')}
              fullWidth
              inputProps={{ min: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item sm={6} md={2}>
            <TextField
              select
              label={<FormattedMessage
                id="common.origin"
                defaultMessage="Origem"
                description="Rótulo comum - Origem"
              />}
              value={fields.originStructureLevelId}
              onChange={fieldChange('originStructureLevelId')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            >
              {fields.structureLevelsHasPerson.map(level => {
                return (
                  <MenuItem
                    key={level.structureLevel.structureLevelId}
                    value={level.structureLevel.structureLevelId}
                  >
                    {level.structureLevel.structureLevelName}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item sm={6} md={2}>
            <TextField
              select
              label={<FormattedMessage
                id="common.destination"
                defaultMessage="Destino"
                description="Rótulo comum - Destino"
              />}
              value={fields.destinationStructureLevelId}
              onChange={fieldChange('destinationStructureLevelId')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            >
              {fields.structureLevelsHasPerson.map(level => {
                return (
                  <MenuItem
                    key={level.structureLevel.structureLevelId}
                    value={level.structureLevel.structureLevelId}
                  >
                    {level.structureLevel.structureLevelName}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item sm={12} md={4} align="right">
            {fields.structureChangeRuleUid ?
              <React.Fragment>
                <Button
                  onClick={cancelUpdate}
                  variant="outlined"
                  color="primary"
                  size="large"
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, width: '50%' }}
                >
                  <FormattedMessage
                    id="common.cancel"
                    defaultMessage="Cancelar"
                    description="Rótulo comum - Cancelar"
                  />
                </Button>
                <Button
                  onClick={() => updateParameter(parameters.parameterSeted)}
                  variant="contained"
                  color="primary"
                  disabled={canEdit()}
                  size="large"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '50%' }}
                >
                  <FormattedMessage
                    id="common.update"
                    defaultMessage="Atualizar"
                    description="Rótulo comum - Atualizar"
                  />
                </Button>
              </React.Fragment> :
              <Button
                onClick={() => addParameter(group)}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={disableEdit || canAdd()}
              >
                <IconAdd />
                <FormattedMessage
                  id="common.add"
                  defaultMessage="Adicionar"
                  description="Rótulo comum - Adicionar"
                />
              </Button>}
          </Grid>
        </Grid>
        {parameters.length > 0 ?
          <div style={{ overflowX: 'auto' }}>
            <Table style={{ minWidth: '600px' }}>
              <TableItemsHeader />
              <TableBody>
                {parameters.map(parameter => {
                  return (
                    <TableRow key={parameter.structureChangeRuleUid}>
                      <TableCell padding="checkbox">
                        <Typography variant="caption" align="left">
                          {parameter.cycleOpen === 1 ?
                            <FormattedMessage
                              id="common.opened"
                              defaultMessage="Aberto"
                              description="Rótulo comum - Aberto"
                            /> : <FormattedMessage
                              id="common.closed"
                              defaultMessage="Fechado"
                              description="Rótulo comum - Fechado"
                            />}
                        </Typography>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Typography variant="caption" align="center">
                          {parameter.priority}
                        </Typography>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Typography variant="caption" align="center">
                          <FormattedMessage
                            id="special.origin_structure_levelName"
                            defaultMessage="{originStructureLevelName}"
                            description="Rótulo especial - Nível da estrutura de origem"
                            values={{
                              originStructureLevelName: structureLevelNamesById[parameter.originStructureLevelId]
                            }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Typography variant="caption" align="center">
                          <FormattedMessage
                            id="special.destinationStructureLevelName"
                            defaultMessage="{destinationStructureLevelName}"
                            description="Rótulo especial - Nível da estrutura de destino"
                            values={{
                              destinationStructureLevelName: structureLevelNamesById[parameter.destinationStructureLevelId]
                            }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Typography align="center">
                          <IconButton
                            disabled={disableEdit}
                            onClick={() => setUpdateParameter(parameter, group)}
                          >
                            <IconModeEdit color="inherit" />
                          </IconButton>
                          <IconButton
                            disabled={disableEdit}
                            onClick={() => setDeleteParameter(parameter.structureChangeRuleUid)}
                          >
                            <IconDelete color="inherit" />
                          </IconButton>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div> :
          <Typography align="center" component="h3" style={{ marginTop: '3rem' }}>
            <FormattedMessage
              id="common.not_found"
              defaultMessage="Nada para mostrar"
              description="Rótulo comum - Nada para mostrar"
            />
          </Typography>}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

structureChangeRules.propTypes = {
  classes: PropTypes.object.isRequired,
  seted: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  fieldChange: PropTypes.func.isRequired,
  updateParameter: PropTypes.func.isRequired,
  cancelUpdate: PropTypes.func.isRequired,
  addParameter: PropTypes.func.isRequired,
  setDeleteParameter: PropTypes.func.isRequired,
  setUpdateParameter: PropTypes.func.isRequired,
  group: PropTypes.string.isRequired,
  disableEdit: PropTypes.bool.isRequired
};

export default withStyles(styles)(structureChangeRules);
