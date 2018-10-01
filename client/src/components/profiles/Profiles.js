import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import Parallax from '../Parallax/Parallax';
import { getProfiles } from '../../actions/profileActions';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PageTemplate from '../layout/PageTemplate/PageTemplate';

class Profiles extends Component {

  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { classes, profile: { profiles }, loading } = this.props;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
      } else {
        profileItems = <h4>No profiles found</h4>
      }
    };

    return (
      <div className="profiles">
        <PageTemplate pageTitle="Developer's" headerImage={'http://placehold.it/1200x500'}>
          <h1>Developer Profiles</h1>
          <p>Browse and connect with developers.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo autem, aliquid sunt velit distinctio debitis mollitia quos voluptatibus modi dolorem itaque animi similique architecto at totam commodi voluptates! Quos, saepe!</p>
          <h2>Lorem ipsium dolor sit amet</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo autem, aliquid sunt velit distinctio debitis mollitia quos voluptatibus modi dolorem itaque animi similique architecto at totam commodi voluptates! Quos, saepe!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo autem, aliquid sunt velit distinctio debitis mollitia quos voluptatibus modi dolorem itaque animi similique architecto at totam commodi voluptates! Quos, saepe!</p>
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

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
