import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

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
		const { errors, name, email, password, password2 } = this.state;

		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									label="Your name"
									placeholder="Name"
									name="name"
									value={name}
									error={errors.name}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									label="E-mail"
									placeholder="Your E-mail"
									name="email"
									value={email}
									error={errors.email}
									info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
									onChange={this.onChange}
								/>
								<TextFieldGroup
									label="Password"
									placeholder="Choose your password"
									name="password"
									type="password"
									value={password}
									error={errors.password}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									label="Confirm password"
									placeholder="Confirm your password"
									name="password2"
									type="password"
									value={password2}
									error={errors.password2}
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

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps, { registerUser }
)(Register);
