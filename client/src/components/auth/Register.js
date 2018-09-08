import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';

class Register extends Component {
	state = {
		name: '',
		email: '',
		password: '',
		password2: '',
		errors: {},
	};

	componentDidMount() {
		const { auth: { isAuthenticated }, history } = this.props;
		if (isAuthenticated) {
			history.push('/dashboard');
		}
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;

		if (errors && errors !== prevProps.errors) {
			this.setState({ errors })
		}
	}

	onChange = e => this.setState({ [e.target.name]: e.target.value });

	onSubmit = e => {
		e.preventDefault();

		const { name, email, password, password2 } = this.state;
		const { registerUser, history } = this.props;

		const newUser = {
			name,
			email,
			password,
			password2,
		};

		registerUser(newUser, history);
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit}>
								<div className="form-group">
									<input
										type="text"
										placeholder="Name"
										name="name"
										value={this.state.name}
										onChange={this.onChange}
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.name
										})}
									/>
									{errors.name && <div className="invalid-feedback">{errors.name}</div>}
								</div>
								<div className="form-group">
									<input
										type="email"
										placeholder="Email Address"
										name="email"
										value={this.state.email}
										onChange={this.onChange}
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.email
										})}
									/>
									{errors.email && <div className="invalid-feedback">{errors.email}</div>}
									<small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
								</div>
								<div className="form-group">
									<input
										type="password"
										placeholder="Password"
										name="password"
										value={this.state.password}
										onChange={this.onChange}
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.password
										})}
									/>
									{errors.password && <div className="invalid-feedback">{errors.password}</div>}
								</div>
								<div className="form-group">
									<input
										type="password"
										placeholder="Confirm Password"
										name="password2"
										value={this.state.password2}
										onChange={this.onChange}
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.password2
										})}
									/>
									{errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
								</div>
								<input type="submit" className="btn btn-large btn-info btn-block mt-4 font-weight-bold text-uppercase" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

export default connect(
	mapStateToProps, { registerUser }
)(Register);
