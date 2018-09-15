import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextareaFieldGroup from '../common/TextareaFieldGroup';
import { addEducation } from '../../actions/profileActions';

class AddEducation extends Component {

	state = {
		school: '',
		degree: '',
		fieldofstudy: '',
		from: '',
		to: '',
		current: false,
		description: '',
		errors: {},
		disabled: false,
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		if (errors && errors !== prevProps.errors) {
			this.setState({ errors });
		}
	}

	onChange = e => this.setState({ [e.target.name]: e.target.value });

	onCheck = e => this.setState(prevState => ({ disabled: !prevState.disabled, current: !prevState.current }));

	onSubmit = e => {
		e.preventDefault();

		const { addEducation, history } = this.props;

		const eduData = {
			school: this.state.school,
			degree: this.state.degree,
			fieldofstudy: this.state.fieldofstudy,
			from: this.state.from,
			to: this.state.to,
			current: this.state.current,
			description: this.state.description,
		}

		addEducation(eduData, history);
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="add-experience">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">Go Back</Link>
							<h1 className="display-4 text-center">Add Education</h1>
							<p className="lead text-center">Add any school, bootcamp, etc that you have attended.</p>
							<small className="d-block pb-3">* Required fields</small>
							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* School"
									name="school"
									value={this.state.school}
									error={errors.school}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="* Degree or Certification"
									name="degree"
									value={this.state.degree}
									error={errors.degree}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="Field of Study"
									name="fieldofstudy"
									value={this.state.fieldofstudy}
									error={errors.fieldofstudy}
									onChange={this.onChange}
								/>

								<div className="form-row">
									<div className="col-md-6">
										<h6>From Date</h6>
										<TextFieldGroup
											name="from"
											type="date"
											value={this.state.from}
											error={errors.from}
											onChange={this.onChange}
										/>
									</div>
									<div className="col-md-6">
										<h6>To Date</h6>
										<TextFieldGroup
											name="to"
											type="date"
											value={this.state.to}
											error={errors.to}
											onChange={this.onChange}
											disabled={this.state.disabled}
										/>
									</div>
								</div>
								<div className="custom-control custom-checkbox mb-4">
									<input
										type="checkbox"
										name="current"
										value={this.state.current}
										checked={this.state.current}
										onChange={this.onCheck}
										id="current"
										className="custom-control-input"
									/>
									<label htmlFor="current" className="custom-control-label">Current</label>
								</div>

								<TextareaFieldGroup
									placeholder="Program Description"
									name="description"
									value={this.state.description}
									error={errors.description}
									onChange={this.onChange}
									info="Tell us about the program that you are in."
								/>
								<input type="submit" value="Submit" className="btn btn-info btn-block" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

AddEducation.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	addEducation: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors,
});

export default connect(mapStateToProps, { addEducation })(withRouter(AddEducation));
