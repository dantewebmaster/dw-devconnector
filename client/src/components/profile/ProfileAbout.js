import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
	render() {
		const { profile } = this.props;

		// Get first name
		const firstName = profile.user.name.trim().split(' ')[0];

		// Skill list
		const skillSet = profile.skills.map((skill, index) => (
			<div key={index} className="p-3"><i className="fa fa-check"></i> {skill}</div>
		));

		return (
			<div className="row">
				<div className="col-md-12">
					<div className="card card-body bg-light mb-3">
						{!isEmpty(profile.bio) &&
							<React.Fragment>
								<h3 className="text-center text-info">{firstName}'s Bio</h3>
								<p className="lead">{profile.bio}</p>
								<hr />
							</React.Fragment>}

						{profile.skills.length > 0 &&
							<React.Fragment>
								<h3 className="text-center text-info">Skill Set</h3>
								<div className="row">
									<div className="d-flex flex-wrap justify-content-center align-items-center">
										{skillSet}
									</div>
								</div>
							</React.Fragment>}
					</div>
				</div>
			</div>
		)
	}
}

ProfileAbout.propTypes = {
	profile: PropTypes.object.isRequired,
}

export default ProfileAbout;
