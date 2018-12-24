import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

// import Select from 'react-select';
// import 'react-select/dist/react-select.css';
// import reactSelectStyles from './styles';

const styles = theme => ({
  expansionPanel: {
    backgroundColor: theme.palette.grey['100'],
    borderRadius: theme.spacing.unit * 0.5,
    marginTop: theme.spacing.unit * 2,
    padding: '0',
    '&:before': {
      display: 'none',
    }
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
  formControl: {
    maxWidth: '100%',
  },
  container: {
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
    width: '100%',
    marginTop: 10,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

function renderSuggestion(suggestion, { isHighlighted }) {
  return (
    <MenuItem
      selected={isHighlighted}
      component="span"
      value={suggestion.structureName}
    >
      <span>{suggestion.structureCode} - {suggestion.structureName}</span>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.structureName;
}

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: { input: classes.input },
        ...other,
      }}
    />
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper style={{ maxHeight: '150px', overflowX: 'auto' }} {...containerProps} square>{children}</Paper>
  );
}

const SettingsInput = ({
  classes,
  fields,
  handlers,
  suggestions,
  selectStructureLevelId,
  onChangeSelectStructureLevelId,
  description,
  selectStructureCode,
  selectStructureName,
  onChangeStructure,
  qtdyDays,
  onChangeQtdyDays,
  addException,
  settingUid,
  selectExceptionUid,
  disabledSubmit,
}) => {

  return (
    <React.Fragment>
      <Grid container spacing={40} direction="row" justify="space-between" alignItems="center" style={{ marginBottom: '16px', overflow: 'visible' }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="structure-level-simple">
              <FormattedMessage
                id="common.structure_type"
                defaultMessage="Tipo de Estrutura"
                description="Rótulo comum - Tipo de Estrutura"
              />
            </InputLabel>
            <Select
              fullWidth
              value={selectStructureLevelId}
              onChange={onChangeSelectStructureLevelId}
            >
              {fields.structureLevels.map(level => {
                return <MenuItem key={level.structureLevel.structureLevelId} value={level.structureLevel.structureLevelId}>
                  {level.structureLevel.structureLevelName}
                </MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autosuggest
            fullWidth
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion,
            }}
            renderInputComponent={renderInput}
            suggestions={suggestions}
            onSuggestionsFetchRequested={handlers.suggestionsFetchRequested}
            onSuggestionsClearRequested={handlers.suggestionsClearRequested}
            renderSuggestionsContainer={renderSuggestionsContainer}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onChangeStructure}
            inputProps={{
              classes,
              placeholder: 'Estrutura Comercial',
              value: selectStructureName,
              onChange: onChangeStructure,
              disabled: selectStructureLevelId === '',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            id="qtydays"
            label={description.includes('dias') ?
              <FormattedMessage
                id="common.quantity_days"
                defaultMessage="Quantidade de Dias"
                description="Rótulo comum - Quantidade de Dias"
              /> :
              <FormattedMessage
                id="common.quantity_cycles"
                defaultMessage="Quantidade de Ciclos"
                description="Rótulo comum - Quantidade de Ciclos"
              />
            }
            className={classes.textField}
            value={qtdyDays}
            onChange={onChangeQtdyDays}
            margin="normal"
            type="number"
            disabled={selectStructureName === ''}
            inputProps={{ min: 1 }}
            autoComplete='off'
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            onClick={addException(selectExceptionUid, {
              settingUid: settingUid,
              structureLevelId: selectStructureLevelId,
              structureCode: selectStructureCode,
              settingExceptionValue: parseInt(qtdyDays),
            })}
            variant="contained"
            color="primary"
            size="large"
            disabled={qtdyDays === '' || qtdyDays < 1 || disabledSubmit}
            fullWidth
          >
            {selectExceptionUid === '' ?
              <FormattedMessage
                id="common.add"
                defaultMessage="Adicionar"
                description="Rótulo comum - Adicionar"
              /> :
              <FormattedMessage
                id="common.update"
                defaultMessage="Atualizar"
                description="Rótulo comum - Atualizar"
              />}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

SettingsInput.propTypes = {
  classes: PropTypes.object.isRequired,
  fields: PropTypes.object,
  lists: PropTypes.object,
  handlers: PropTypes.object,
  state: PropTypes.object,
  selectStructureLevelId: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  selectStructureCode: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  onChangeSelectStructureLevelId: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  selectStructureName: PropTypes.string.isRequired,
  onChangeStructure: PropTypes.func.isRequired,
  qtdyDays: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  onChangeQtdyDays: PropTypes.func.isRequired,
  addException: PropTypes.func.isRequired,
  settingUid: PropTypes.string,
  selectExceptionUid: PropTypes.string,
  disabledSubmit: PropTypes.bool,
  suggestions: PropTypes.array,
};

export default withStyles(styles)(SettingsInput);
