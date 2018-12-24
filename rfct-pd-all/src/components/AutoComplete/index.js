import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import 'react-select/dist/react-select.css';
// import ExternalsApi from 'Services/externalsApi';

class AutoComplete extends Component {

  state = {
    selectedOption: null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clearInput !== this.props.clearInput && this.props.clearInput === true) {
      this.setState({ selectedOption: null });
    }
  }

  // loadOptions = (input, callback) => this.props.onLoadOptions(input, callback);

  // handleLoadOptions = async (input, callback) => {
  //   let options;

  //   if (input) {
  //     options = await ExternalsApi.getStructuresByOrder(structureLevel, input);
  //     callback(null, { options });
  //   }
  // };

  handleChange = selectedOption => {
    const { onChangeHandler, field } = this.props;

    this.setState({ selectedOption },
      () => onChangeHandler({
        field: [field],
        value: selectedOption && selectedOption.value,
      }));
  }

  handleInputchange = inputValue => {
    const { onInputChangeHandler, field } = this.props;

    onInputChangeHandler({ field: [field], value: inputValue });
  }

  render() {
    const { options, value, label, disabledInput, intl, isLoading } = this.props;
    const { selectedOption } = this.state;

    const suggestions = options && options.map(suggestion => ({
      value: suggestion[value],
      label: suggestion[label],
      // formattedStructure: suggestion && suggestion.formattedStructure,
    }));

    return (
      <Select
        // loadOptions={this.handleLoadOptions}
        value={selectedOption}
        onChange={this.handleChange}
        onInputChange={e => this.handleInputchange(e)}
        options={suggestions}

        disabled={disabledInput}

        // labelKey="formattedStructure"

        autoBlur={true}

        cache={false}
        autoload={false}
        openOnFocus={true}
        onBlurResetsInput={false}

        filterOptions={(suggestions) => { return suggestions }}

        isLoading={isLoading}

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
    );
  }
}

AutoComplete.propTypes = {
  intl: intlShape,
  options: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabledInput: PropTypes.bool,
  clearInput: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChangeHandler: PropTypes.func.isRequired,
  onInputChangeHandler: PropTypes.func,
};

export default withStyles(styles)(injectIntl(AutoComplete));
