import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';

class Dashboard extends Component {
	componentDidMount() {
		this.props.getCurrentProfile();
	}

	onDeleteclick = () => {
		this.props.deleteAccount();
	}

	render() {
		const {
			auth: { user },
			profile: { profile, loading }
		} = this.props;

		let dashboardContent;

		if (profile === null || loading) {
			dashboardContent = <Spinner size={40} color="#17a2b8" />
		} else {
			// Check if logged in user has profile data
			if (Object.keys(profile).length > 0) {
				dashboardContent = (
					<div>
						<p className="lead text-muted">
							Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
						</p>
						<ProfileActions />
						{/* @TODO: Experience and Education */}

						<div style={{ marginBottom: '40px' }}>
							<button onClick={this.onDeleteclick} className="btn btn-danger">Delete account</button>
						</div>
					</div>
				);
			} else {
				// User is logged in but has no profile
				dashboardContent = (
					<div>
						<p className="lead text-muted">Welcome {user.name}</p>
						<p>You have not setup your profile yet, please add some info.</p>
						<Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
					</div>
				)
			}
		}

		return (
			<div className="dashboard">
				<div className="row">
					<div className="col-md-12">
						<h1 className="display-4">Dashboard</h1>
						{dashboardContent}
					</div>
				</div>
			</div>
		)
	}
}

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
