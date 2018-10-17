import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  formControl: {
    marginBottom: theme.spacing.unit * 4,
  },
});

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
  classes,
}) => {
  return (
    <FormControl
      className={classes.formControl}
      error={error}
      aria-describedby="error"
      fullWidth
    >
      {label ?
        <InputLabel htmlFor={name}>{label}</InputLabel> :
        <InputLabel htmlFor={name}>{placeholder}</InputLabel>}
      <Input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <FormHelperText id="error">{error}</FormHelperText>}
      {info && <FormHelperText id="info">{info}</FormHelperText>}
    </FormControl>
  )
}

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  info: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

TextFieldGroup.defaultProps = {
  type: 'text'
}

export default withStyles(styles)(TextFieldGroup);
