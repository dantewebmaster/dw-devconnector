import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';

class Login extends Component {
	state = {
		email: '',
		password: '',
		errors: {},
	};

	componentDidMount() {
		const { auth: { isAuthenticated }, history } = this.props;
		if (isAuthenticated) {
			history.push('/dashboard');
		}
	}

	componentDidUpdate(prevProps) {
		const { errors, auth: { isAuthenticated }, history } = this.props;

		if (isAuthenticated && isAuthenticated === true) {
			history.push('/dashboard');
		}

		if (errors && errors !== prevProps.errors) {
			this.setState({ errors })
		}
	}

	onChange = e => this.setState({ [e.target.name]: e.target.value });

	onSubmit = e => {
		e.preventDefault();

		const { email, password } = this.state;

		const userData = {
			email,
			password,
		};

		this.props.loginUser(userData);
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">Sign in to your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit}>
								<div className="form-group">
									<input
										type="email"
										className="form-control form-control-lg"
										placeholder="Email Address"
										name="email"
										value={this.state.email}
										onChange={this.onChange}
										className={classnames('form-control form-control-lg', {
											'is-invalid': errors.email
										})}
									/>
									{errors.email && <div className="invalid-feedback">{errors.email}</div>}
								</div>
								<div className="form-group">
									<input
										type="password"
										className="form-control form-control-lg"
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

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

export default connect(
	mapStateToProps, { loginUser }
)(Login);
