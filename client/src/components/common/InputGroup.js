import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const InputGroup = ({
	name,
	placeholder,
	value,
	label,
	error,
	info,
	onChange,
	disabled,
	icon,
}) => {
	return (
		<div className="input-group mb-3">
			{label &&
				<label htmlFor={name}>{label}</label>}

			<div className="input-group-prepend">
				<span className="input-group-text"><i style={{ minWidth: '20px' }} className={'fab fa-' + icon} /></span>
			</div>
			<input
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

InputGroup.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	error: PropTypes.string,
	info: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	icon: PropTypes.string.isRequired,
}

export default InputGroup;
