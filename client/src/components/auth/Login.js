import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

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
		const { errors, email, password } = this.state;

		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">Sign in to your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									label="Email Address"
									placeholder="Email Address"
									name="email"
									type="email"
									value={email}
									error={errors.email}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									label="Your Password"
									placeholder="Password"
									name="password"
									type="password"
									value={password}
									error={errors.password}
									onChange={this.onChange}
								/>
								<input type="submit" className="btn btn-large btn-info btn-block mt-4 font-weight-bold text-uppercase" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps, { loginUser }
)(Login);
