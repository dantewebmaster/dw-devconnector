import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import PageTemplate from '../layout/PageTemplate/PageTemplate';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';

import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

class Profiles extends Component {

  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profile: { profiles }, loading } = this.props;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <LinearProgress />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
      } else {
        profileItems = <h4>No profiles found</h4>
      }
    };

    return (
      <div className="profiles">
        <PageTemplate pageTitle="Developer's" headerImage={'https://source.unsplash.com/1380x380/?code'}>
          <Typography variant="h2" component="h1" gutterBottom>Developer Profiles</Typography>
          <Typography variant="subtitle1" gutterBottom>
            Browse and connect with developers around the entire World Wide Web.
          </Typography>
          {profileItems}
        </PageTemplate>
      </div >
    )
  }
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles);
