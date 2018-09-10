import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
}) => {
	return (
		<div className="form-group">
			{label &&
				<label htmlFor={name}>{label}</label>}
			<input
				type={type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				className={classnames('form-control form-control-lg', {
					'is-invalid': error
				})}
			/>
			{error &&
				<div className="invalid-feedback">{error}</div>}
			{info &&
				<small className="form-text text-muted">{info}</small>}
		</div>
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

export default TextFieldGroup;
