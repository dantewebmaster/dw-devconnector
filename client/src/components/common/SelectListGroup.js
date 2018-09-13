import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const SelectListGroup = ({
	name,
	value,
	label,
	error,
	info,
	onChange,
	disabled,
	options,
}) => {

	const selectOptions = options.map(option => (
		<option key={option.label} value={option.value}>{option.label}</option>
	));

	return (
		<div className="form-group">
			{label &&
				<label htmlFor={name}>{label}</label>}
			<select
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				className={classnames('custom-select custom-select-lg', {
					'is-invalid': error
				})}
			>
				{selectOptions}
			</select>
			{error &&
				<div className="invalid-feedback">{error}</div>}
			{info &&
				<small className="form-text text-muted">{info}</small>}
		</div>
	)
}

SelectListGroup.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	error: PropTypes.string,
	info: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	options: PropTypes.array.isRequired,
}

export default SelectListGroup;
