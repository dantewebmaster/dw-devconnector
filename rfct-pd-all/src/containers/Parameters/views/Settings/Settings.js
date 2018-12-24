import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// ICONS
import IconExpandMore from '@material-ui/icons/ExpandMore';

import SettingsInput from './SettingsInputs';
import SettingsTable from './SettingsTable';

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
    overflow: 'visible',
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
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },
  tableHeader: {
    backgroundColor: theme.palette.grey['100'],
    marginTop: theme.spacing.unit * 2,
  },
  tableItem: {
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    paddingTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    marginTop: 27,
  },
  suggestionsContainerOpen: {
    backgroundColor: theme.palette.grey['100'],
    position: 'absolute',
    zIndex: 1,
    marginTop: '2px',
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: 240,
    marginTop: 10,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


const Settings = ({ classes, setting, fields, handlers, lists, order }) => {

  const canUpdate = (inputIndex) => {
    const {
      qtdyDays1,
      selectStructureCode1,
      // selectStructureLevelId1,
      qtdyDays2,
      selectStructureCode2,
      // selectStructureLevelId2,
      qtdyDays3,
      selectStructureCode3,
      // selectStructureLevelId3,
    } = fields;

    const {
      settedException1: { exception: setted1 },
      settedException2: { exception: setted2 },
      settedException3: { exception: setted3 }
    } = fields;

    if (setted1 || setted2 || setted3) {
      if (inputIndex === 1)
        return qtdyDays1 === '' || qtdyDays1 < 1 ||
          parseInt(qtdyDays1) === setted1.settingExceptionValue
          && selectStructureCode1 === setted1.structureCode;
      // && selectStructureLevelId1 === setted1.structureLevelId;

      else if (inputIndex === 2)
        return qtdyDays2 === '' || qtdyDays2 < 1 ||
          parseInt(qtdyDays2) === setted2.settingExceptionValue
          && selectStructureCode2 === setted2.structureCode;
      // && selectStructureLevelId2 === setted2.structureLevelId

      else if (inputIndex === 3)
        return qtdyDays3 === '' || qtdyDays3 < 1 ||
          parseInt(qtdyDays3) === setted3.settingExceptionValue
          && selectStructureCode3 === setted3.structureCode;
      // && selectStructureLevelId3 === setted3.structureLevelId;
    }
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justify="flex-start" alignContent="flex-start">
        <Grid item xs={3} sm={2}>
          <Grid container justify="center" alignContent="center" style={{ height: 95, alignItems: 'center', justifyContent: 'center' }}>
            {setting.settingDescription.includes('dias') ?
              <Typography variant="button" style={{ fontWeight: 'bold' }}>
                {setting.settingValue}
                <FormattedMessage
                  id="common.days"
                  defaultMessage="dias"
                  description="Rótulo comum - dias"
                />
              </Typography> :
              <Typography variant="button" style={{ fontWeight: 'bold' }}>
                {setting.settingValue}
                <FormattedMessage
                  id="common.cycles"
                  defaultMessage="ciclos"
                  description="Rótulo comum - ciclos"
                />
              </Typography>}
          </Grid>
        </Grid>
        <Grid item xs={9} sm={10}>
          <ExpansionPanel
            classes={{ expanded: classes.expanded, root: classes.expansionPanel }}
            elevation={0}
            key={setting.settingUid}
          >
            <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={<IconExpandMore />}>
              <Typography component="h3">{setting.settingDescription}</Typography>
            </ExpansionPanelSummary>
            <Divider />
            <ExpansionPanelDetails className={classes.expansionPanelDetails} style={{ minHeight: '250px' }}>
              <Grid container direction="row" justify="flex-start" alignContent="flex-start">
                <Typography variant="button" style={{ marginBottom: 20 }}>
                  <FormattedMessage
                    id="common.excep_for"
                    defaultMessage="Exceto para:"
                    description="Rótulo comum - Exceto para:"
                  />
                </Typography>
              </Grid>

              {order === 1 ?
                <SettingsInput
                  fields={fields}
                  lists={lists}
                  handlers={handlers}
                  setting={setting}
                  selectStructureLevelId={fields.selectStructureLevelId1}
                  onChangeSelectStructureLevelId={handlers.fieldChange('selectStructureLevelId1')}
                  selectStructureName={fields.selectStructureName1}
                  selectStructureCode={fields.selectStructureCode1}
                  onChangeStructure={handlers.changeStructure1}
                  qtdyDays={fields.qtdyDays1}
                  onChangeQtdyDays={handlers.fieldChange('qtdyDays1')}
                  addException={handlers.addException}
                  settingUid={setting.settingUid}
                  description={setting.settingDescription}
                  selectExceptionUid={fields.selectExceptionUid1}
                  disabledSubmit={!handlers.hasAccess('parameters/edit') || canUpdate(1)}
                  suggestions={lists.structures1}
                /> : order === 2 ?
                  <SettingsInput
                    fields={fields}
                    lists={lists}
                    handlers={handlers}
                    setting={setting}
                    selectStructureLevelId={fields.selectStructureLevelId2}
                    onChangeSelectStructureLevelId={handlers.fieldChange('selectStructureLevelId2')}
                    selectStructureName={fields.selectStructureName2}
                    selectStructureCode={fields.selectStructureCode2}
                    onChangeStructure={handlers.changeStructure2}
                    qtdyDays={fields.qtdyDays2}
                    onChangeQtdyDays={handlers.fieldChange('qtdyDays2')}
                    addException={handlers.addException}
                    settingUid={setting.settingUid}
                    description={setting.settingDescription}
                    selectExceptionUid={fields.selectExceptionUid2}
                    disabledSubmit={!handlers.hasAccess('parameters/edit') || canUpdate(2)}
                    suggestions={lists.structures2}
                  /> :
                  <SettingsInput
                    fields={fields}
                    lists={lists}
                    handlers={handlers}
                    setting={setting}
                    selectStructureLevelId={fields.selectStructureLevelId3}
                    onChangeSelectStructureLevelId={handlers.fieldChange('selectStructureLevelId3')}
                    selectStructureName={fields.selectStructureName3}
                    selectStructureCode={fields.selectStructureCode3}
                    onChangeStructure={handlers.changeStructure3}
                    qtdyDays={fields.qtdyDays3}
                    onChangeQtdyDays={handlers.fieldChange('qtdyDays3')}
                    addException={handlers.addException}
                    settingUid={setting.settingUid}
                    description={setting.settingDescription}
                    selectExceptionUid={fields.selectExceptionUid3}
                    disabledSubmit={!handlers.hasAccess('parameters/edit') || canUpdate(3)}
                    suggestions={lists.structures3}
                  />
              }

              {setting.settingsExceptions.length > 0 &&
                <SettingsTable
                  order={order}
                  fields={fields}
                  lists={lists}
                  settingUid={setting.settingUid}
                  description={setting.settingDescription}
                  exceptions={setting.settingsExceptions}
                  setUpdateException={handlers.setUpdateException}
                  openModalDeleteException={handlers.openModalDeleteException}
                  disableEdit={!handlers.hasAccess('parameters/edit')}
                />}

            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  fields: PropTypes.object,
  lists: PropTypes.object,
  handlers: PropTypes.object,
  setting: PropTypes.object,
  state: PropTypes.object,
  order: PropTypes.number,
};

export default withStyles(styles)(Settings);
