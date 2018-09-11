import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TextareaFieldGroup = ({
	name,
	placeholder,
	value,
	label,
	error,
	info,
	onChange,
	rows,
	disabled,
}) => {
	return (
		<div className="form-group">
			{label &&
				<label htmlFor={name}>{label}</label>}
			<textarea
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				rows={rows}
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

TextareaFieldGroup.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	error: PropTypes.string,
	info: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	rows: PropTypes.number,
	disabled: PropTypes.bool,
}

TextareaFieldGroup.defaultProps = {
	rows: 5
}

export default TextareaFieldGroup;
