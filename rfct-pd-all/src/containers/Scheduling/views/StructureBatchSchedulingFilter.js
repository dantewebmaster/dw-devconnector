import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
// ICONS
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
// CUSTOM COMPONENTS
import ActionDialog from 'Components/ActionDialog';
import AutoComplete from 'Components/AutoComplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  fieldsetRoot: {
    width: '100%',
    padding: 0,
  },
  radioGroupRoot: {
    flexDirection: 'row',
  },
  actions: {
    marginTop: 0,
  },
  formTitle: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2,
    fontWeight: 700,
    color: theme.palette.grey['600'],
    marginBottom: theme.spacing.unit * 3,
  },

  currentStructure: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 3,
    minHeight: '350px',
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
  },
  structureHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 3,
  },
  listItem: {
    paddingLeft: '12px',
    paddingBottom: '5px',
    paddingTop: '5px',
  },
  listBullet: {
    backgroundColor: theme.palette.grey['400'],
    borderRadius: '100%',
    display: 'block',
    height: '8px',
    width: '8px',
  },
  listDotsLine: {
    display: 'block',
    height: '40px',
    marginLeft: '14px',
    borderLeft: `2px dotted ${theme.palette.grey['400']}`,
    '&:last-child': {
      display: 'none',
    },
  },
});

const StructureBatchSchedulingFilter = ({ fields, lists, handlers, classes }) => {
  const options = lists.structureLevels || {};
  let result = Object.keys(options).map(key => options[key]);
  let filteredResult = result.filter(item => item.hasPerson === true);

  const canSchedule = () => {
    let allSelected = [];
    if (lists.peopleByStructure) {
      allSelected = lists.peopleByStructure
        .filter(item => fields.schedulingByStructureSelectedPeople.includes(item.personCode));
    }
    return fields.destStructureLevelId && fields.destStructureCode &&
      allSelected &&
      allSelected.length &&
      allSelected.every(p => !p.schedulingUid);
  };

  const resetInput = () => fields.resetFields;

  return <React.Fragment>
    <Grid container spacing={40} justify="center">
      <Grid item md={5} sm={12} style={{ paddingTop: 16 }}>
        <Typography className={classes.formTitle} variant="button" align="center">
          <FormattedMessage
            id="labels.fields.current_structure_select"
            defaultMessage="Estrutura Atual"
            description="Rótulo do campo - Estrutura Atual"
          />
        </Typography>

        <Typography variant="caption">Tipo</Typography>
        <AutoComplete
          field="originStructureLevelId"
          value="structureLevelId"
          label="structureLevelName"
          options={filteredResult}
          onChangeHandler={handlers.handleSetField}
          onInputChangeHandler={handlers.handleSetField}
          clearInput={resetInput()}
        />
        <Typography variant="caption">Estrutura</Typography>
        <AutoComplete
          field="originStructureCode"
          value="structureCode"
          label="structureName"
          options={lists.originStructures}
          onChangeHandler={handlers.handleSetField}
          onInputChangeHandler={handlers.handleSetField}
          disabledInput={!fields.originStructureLevelId}
          clearInput={resetInput() || !fields.originStructureLevelId}
        />

        {Object.keys(fields.originValues).length > 0 &&
          <div className={classes.currentStructure}>
            <div className={classes.structureHeader}>
              <DeviceHubIcon style={{ marginRight: '25px', fontSize: '30px' }} />
              <Typography variant="body2" style={{ textTransform: 'uppercase' }}>Estrutura comercial</Typography>
            </div>
            <List>
              {Object.keys(fields.originValues).map((key, idx) => {
                if (idx < Object.keys(fields.originValues).length - 1) {
                  const structureLevel = fields.originValues[key];
                  return (
                    <React.Fragment key={structureLevel.orderLevel}>
                      <ListItem className={classes.listItem}>
                        <span className={classes.listBullet}></span>
                        <ListItemText
                          primary={`${structureLevel.structureLevelName} - ${structureLevel.formattedStructure}`}
                        />
                      </ListItem>
                      <span className={classes.listDotsLine}></span>
                    </React.Fragment>
                  );
                } else return;
              })}
            </List>
          </div>}

        <FormControl component="fieldset" classes={{ root: classes.fieldsetRoot }} required>
          <Grid container spacing={40}>
            <Grid item sm={12} md={6}>
              <TextField
                select
                label="Exibir"
                value={fields.schedulingByStructureQueryType}
                onChange={handlers.fieldChange('schedulingByStructureQueryType')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={0}>
                  <FormattedMessage
                    id="common.all"
                    defaultMessage="Todos"
                    description="Rótulo comum - Todos"
                  />
                </MenuItem>
                <MenuItem value={1}>
                  <FormattedMessage
                    id="select.people_with_scheduling"
                    defaultMessage="Agendadas"
                    description="Rótulo de parâmetro de pesquisa - Agendadas"
                  />
                </MenuItem>
                <MenuItem value={2}>
                  <FormattedMessage
                    id="select.people_without_scheduling"
                    defaultMessage="Não agendadas"
                    description="Rótulo de parâmetro de pesquisa - Não agendadas"
                  />
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item sm={12} md={6}>
              <TextField
                select
                label={
                  <FormattedMessage
                    id="gp_level.list"
                    defaultMessage="Tipo de Nível"
                    description="Tipo de Nível"
                  />
                }
                value={fields.schedulingByGpLevel}
                onChange={handlers.fieldChange('schedulingByGpLevel')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value='0'>
                  <FormattedMessage
                    id="common.all"
                    defaultMessage="Todos"
                    description="Rótulo comum - Todos"
                  />
                </MenuItem>
                {lists.plansLevels.map(item => (
                  <MenuItem
                    key={item.sequence}
                    value={item.idLevel}
                  >
                    {item.levelName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </FormControl>
      </Grid>

      <Grid item md={2} sm={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {screen.width > 960 ? <KeyboardArrowRightIcon color="primary" style={{ fontSize: 52, opacity: 0.2 }} /> :
          <KeyboardArrowDownIcon color="primary" style={{ fontSize: 52, opacity: 0.2 }} />}
      </Grid>

      <Grid item md={5} sm={12} style={{ paddingTop: 16 }}>
        <Typography className={classes.formTitle} variant="button" align="center">
          <FormattedMessage
            id="labels.fields.move_structure_select"
            defaultMessage="Movimentar Para"
            description="Rótulo do campo - Movimentar para"
          />
        </Typography>

        <Typography variant="caption">Tipo</Typography>
        <AutoComplete
          field="destStructureLevelId"
          value="structureLevelId"
          label="structureLevelName"
          options={filteredResult}
          onChangeHandler={handlers.handleSetField}
          onInputChangeHandler={handlers.handleSetField}
          clearInput={resetInput()}
        />
        <Typography variant="caption">Estrutura</Typography>
        <AutoComplete
          field="destStructureCode"
          value="structureCode"
          label="structureName"
          options={lists.destStructures}
          onChangeHandler={handlers.handleSetField}
          onInputChangeHandler={handlers.handleSetField}
          disabledInput={!fields.destStructureLevelId}
          clearInput={resetInput() || !fields.destStructureLevelId}
        />
        {Object.keys(fields.destinationValues).length > 0 &&
          <div className={classes.currentStructure}>
            <div className={classes.structureHeader}>
              <DeviceHubIcon style={{ marginRight: '25px', fontSize: '30px' }} />
              <Typography variant="body2" style={{ textTransform: 'uppercase' }}>Estrutura comercial</Typography>
            </div>
            <List>
              {Object.keys(fields.destinationValues).map((key, idx) => {
                if (idx < Object.keys(fields.destinationValues).length - 1) {
                  const structureLevel = fields.destinationValues[key];
                  return (
                    <React.Fragment key={structureLevel.orderLevel}>
                      <ListItem className={classes.listItem}>
                        <span className={classes.listBullet}></span>
                        <ListItemText
                          primary={`${structureLevel.structureLevelName} - ${structureLevel.formattedStructure}`}
                        />
                      </ListItem>
                      <span className={classes.listDotsLine}></span>
                    </React.Fragment>
                  );
                } else return;
              })}
            </List>
          </div>}
      </Grid>
    </Grid>

    <Grid container spacing={40} justify="space-between" alignItems="center">
      <Grid item xs={5} align="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!fields.originStructureCode || !fields.originStructureLevelId}
          onClick={handlers.searchByStructure}
        >
          <FormattedMessage
            id="common.search"
            defaultMessage="Pesquisar"
            description="Rótulo comum - Pesquisar"
          />
        </Button>
      </Grid>
      <Grid item xs={5} align="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!canSchedule()}
          onClick={handlers.batchScheduleByStructure}
        >
          <FormattedMessage
            id="common.start_process"
            defaultMessage="Processar"
            description="Rótulo comum - Processar"
          />
        </Button>
      </Grid>
    </Grid>

    <ActionDialog
      open={fields.getCycleModal.open}
      iconType="info"
      title={<FormattedMessage
        id="modal.confirm_movement.title"
        defaultMessage="Confirmar o agendamento das pessoas nesta estrutura?"
        description="Título do modal - Agendar pessoas por estrutura"
      />}
      desc={<FormattedMessage
        id="VALIDATE_CYCLE"
        defaultMessage="Movimentação será realizada no fechamento do ciclo: {cycle}. Deseja continuar?"
        description="Mensagem do modal - Validar ciclo"
        values={fields.getCycleModal.values}
      />}
      confirmMode
      onCancel={handlers.handleCloseDialog}
      onConfirm={handlers.batchScheduleByStructure}
    />
  </React.Fragment >;
};

StructureBatchSchedulingFilter.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(styles)(StructureBatchSchedulingFilter);
