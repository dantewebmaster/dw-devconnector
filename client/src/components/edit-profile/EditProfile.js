import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';
import TextareaFieldGroup from '../common/TextareaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';

import isEmpty from '../../validation/is-empty';

import { createProfile, getCurrentProfile } from '../../actions/profileActions';

class EditProfile extends Component {
	state = {
		displaySocialInputs: false,
		handle: '',
		company: '',
		website: '',
		location: '',
		status: '',
		skills: '',
		githubusername: '',
		bio: '',
		facebook: '',
		twitter: '',
		instagram: '',
		linkedin: '',
		youtube: '',
		errors: {},
	}

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;

		if (errors && errors !== prevProps.errors) {
			this.setState({ errors })
		}

		if (this.props.profile.profile && this.props.profile.profile !== prevProps.profile.profile) {
			const profile = this.props.profile.profile;

			// Bring skills back to CSV
			const skillsCSV = profile.skills.join(', ');

			// If profile field does not exist, make empty string
			profile.company = !isEmpty(profile.company) ? profile.company : '';
			profile.website = !isEmpty(profile.website) ? profile.website : '';
			profile.location = !isEmpty(profile.location) ? profile.location : '';
			profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
			profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
			profile.social = !isEmpty(profile.social) ? profile.social : {};
			profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
			profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
			profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';
			profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
			profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';

			// Set  component fields state
			this.setState({
				handle: profile.handle,
				company: profile.company,
				website: profile.website,
				location: profile.location,
				status: profile.status,
				skills: skillsCSV,
				githubusername: profile.githubusername,
				bio: profile.bio,
				facebook: profile.facebook,
				twitter: profile.twitter,
				instagram: profile.instagram,
				linkedin: profile.linkedin,
				youtube: profile.youtube,
			});
		}
	}

	onChange = e => this.setState({ [e.target.name]: e.target.value });

	onSubmit = e => {
		e.preventDefault();

		const { createProfile, history } = this.props;

		const profileData = {
			handle: this.state.handle,
			company: this.state.company,
			website: this.state.website,
			location: this.state.location,
			status: this.state.status,
			skills: this.state.skills,
			githubusername: this.state.githubusername,
			bio: this.state.bio,
			facebook: this.state.facebook,
			twitter: this.state.twitter,
			instagram: this.state.instagram,
			linkedin: this.state.linkedin,
			youtube: this.state.youtube,
		}

		createProfile(profileData, history);
	}

	render() {
		const { errors, displaySocialInputs } = this.state;

		let socialInputs;
		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						placeholder="Facebook"
						name="facebook"
						icon="facebook-f"
						value={this.state.facebook}
						onChange={this.onChange}
						errors={errors.facebook}
					/>
					<InputGroup
						placeholder="Twitter"
						name="twitter"
						icon="twitter"
						value={this.state.twitter}
						onChange={this.onChange}
						errors={errors.twitter}
					/>
					<InputGroup
						placeholder="Instagram"
						name="instagram"
						icon="instagram"
						value={this.state.instagram}
						onChange={this.onChange}
						errors={errors.instagram}
					/>
					<InputGroup
						placeholder="Linkedin"
						name="linkedin"
						icon="linkedin"
						value={this.state.linkedin}
						onChange={this.onChange}
						errors={errors.linkedin}
					/>
					<InputGroup
						placeholder="Youtube"
						name="youtube"
						icon="youtube"
						value={this.state.youtube}
						onChange={this.onChange}
						errors={errors.youtube}
					/>
				</div>
			)
		}

		// Select options for status
		const options = [
			{ label: '*Select a professional status', value: 0 },
			{ label: 'Developer', value: 'Developer' },
			{ label: 'Junior Developer', value: 'Junior Developer' },
			{ label: 'Senior Developer', value: 'Senior Developer' },
			{ label: 'Manager', value: 'Manager' },
			{ label: 'Student or Learning', value: 'Student or Learning' },
			{ label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
			{ label: 'Intern', value: 'Intern' },
			{ label: 'Other', value: 'Other' },
		];

		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Edit Profile</h1>
							<small className="d-block pb-3">* Required fields</small>

							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile handle"
									name="handle"
									value={this.state.handle}
									errors={errors.handle}
									info="A unique handle for your profile URL. Your full name, company, nickname."
									onChange={this.onChange}
								/>
								<SelectListGroup
									placeholder="* Status"
									name="status"
									value={this.state.status}
									options={options}
									errors={errors.status}
									info="Give us an idea of where you are at your career."
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									errors={errors.company}
									info="Could be your own company or one you work for."
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									errors={errors.website}
									info="Could be your own website or a company one."
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									errors={errors.location}
									info="City, state or your own work place."
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="* Skills"
									name="skills"
									value={this.state.skills}
									errors={errors.skills}
									info="Your best skills (comma separated)."
									onChange={this.onChange}
								/>
								<TextFieldGroup
									placeholder="Github Username"
									name="githubusername"
									value={this.state.githubusername}
									errors={errors.githubusername}
									info="Place in your Github user name to show yours latest repos and a link to your profile."
									onChange={this.onChange}
								/>
								<TextareaFieldGroup
									placeholder="Give a short description of you"
									name="bio"
									value={this.state.bio}
									errors={errors.bio}
									info="Give a short description about yourself."
									rows={5}
									onChange={this.onChange}
								/>

								<div className="mb-3">
									<button
										type="button"
										onClick={() => {
											this.setState(prevState => ({
												displaySocialInputs: !prevState.displaySocialInputs
											}))
										}}
										className="btn btn-sm btn-outline-primary"
									>
										Display social links
									</button>
								</div>
								{socialInputs}
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

EditProfile.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(EditProfile);
