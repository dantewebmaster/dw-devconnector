import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const SearchField = ({
  handlers, fieldValue, fieldLabel, showClearButton,
}) => {

  const clearSearchButton = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={handlers.onClearSearch}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <TextField
      label={fieldLabel}
      margin="normal"
      onKeyPress={handlers.onSearch}
      onChange={handlers.onChange}
      InputLabelProps={{ shrink: true }}
      value={fieldValue}
      InputProps={showClearButton ? clearSearchButton : null}
    />
  );
};

SearchField.propTypes = {
  handlers: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
  }),
  fieldValue: PropTypes.string,
  fieldLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showClearButton: PropTypes.bool,
};

export default SearchField;
