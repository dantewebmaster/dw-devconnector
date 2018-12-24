import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import 'react-select/dist/react-select.css';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class SelectStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  loadOptions = (input, callback) => this.props.onLoadOptions(input, callback);

  onChange = (value) => {
    this.setState({
      value: {
        ...value,
        parentStructure: this.props.parentStructure,
        ...this.props.structureLevel,
      }
    }, () => this.props.onChange(this.state.value));
  };

  render = () => {
    const { disabledInput, structureLevel, classes, value, intl } = this.props;

    return (
      <div className={classes.inputField}>
        <Typography variant="caption">{structureLevel.structureLevelId} - {structureLevel.structureLevelName}</Typography>
        <Select.Async
          value={value}
          valueKey='structureCode'
          labelKey='formattedStructure'
          onChange={this.onChange}
          options={[this.props.initialData || {}]}
          loadOptions={this.loadOptions}
          disabled={disabledInput}
          autoload={false}
          onBlurResetsInput={false}
          filterOptions={(suggestions) => { return suggestions }}
          cache={false}
          noResultsText={intl.formatMessage({
            id: "common.not_found",
            defaultMessage: "Nada para mostrar",
            description: "Rótulo comum - Nada para mostrar"
          })}
          placeholder={intl.formatMessage({
            id: "common.select",
            defaultMessage: "Selecione",
            description: "Rótulo comum - Selecione"
          })}
          searchPromptText={intl.formatMessage({
            id: "commom.type_to_search",
            defaultMessage: "Digite para buscar",
            description: "Rótulo comum - Digite para buscar"
          })}
          loadingPlaceholder={intl.formatMessage({
            id: "common.loading",
            defaultMessage: "Carregando...",
            description: "Rótulo comum - Carregando"
          })}
          clearValueText={intl.formatMessage({
            id: "common.clear",
            defaultMessage: "Limpar",
            description: "Rótulo comum - Limpar"
          })}
        />
      </div>
    );
  };
}

SelectStructure.propTypes = {
  intl: intlShape,
  structureLevel: PropTypes.object.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func,
  onLoadOptions: PropTypes.func,
  disabledInput: PropTypes.bool,
  initialData: PropTypes.object,
  classes: PropTypes.object,
  parentStructure: PropTypes.object,
};

export default withStyles(styles)(injectIntl(SelectStructure));
