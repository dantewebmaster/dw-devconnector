import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextareaFieldGroup from '../common/TextareaFieldGroup';
import { addExperience } from '../../actions/profileActions';

class AddExperience extends Component {

	state = {
		company: '',
		title: '',
		location: '',
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

		const { addExperience, history } = this.props;

		const expData = {
			company: this.state.company,
			title: this.state.title,
			location: this.state.location,
			from: this.state.from,
			to: this.state.to,
			current: this.state.current,
			description: this.state.description,
		}

		addExperience(expData, history);
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="add-experience">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">Go Back</Link>
							<h1 className="display-4 text-center">Add Experience</h1>
							<p className="lead text-center">Add any position or job that you have had in the past or current.</p>
							<small className="d-block pb-3">* Required fields</small>
							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Company"
									name="company"
									value={this.state.company}
									error={errors.company}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="* Job Title"
									name="title"
									value={this.state.title}
									error={errors.title}
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									error={errors.location}
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
									<label htmlFor="current" className="custom-control-label">Current Job</label>
								</div>

								<TextareaFieldGroup
									placeholder="Job Description"
									name="description"
									value={this.state.description}
									error={errors.description}
									onChange={this.onChange}
									info="Tell us about the position"
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

AddExperience.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	addExperience: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors,
});

export default connect(mapStateToProps, { addExperience })(withRouter(AddExperience));
