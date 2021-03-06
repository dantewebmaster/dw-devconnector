import React, { Component } from 'react';
import isEmpty from '../../validation/is-empty';

class ProfileHeader extends Component {
  render() {

    const { profile } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3">
                <img src={profile.user.avatar} alt={profile.user.name} />
              </div>
              <div className="col-8 col-md-9">
                <h1 className="display-4">{profile.user.name}</h1>
                <p className="lead">
                  {profile.status} - {isEmpty(profile.company) ? null : <span>at {profile.company}</span>}
                </p>
                {isEmpty(profile.location) ? null : <p>{profile.location}</p>}
                {profile.social &&
                  <p>
                    {isEmpty(profile.website) ?
                      null : <a className="text-white p-2" target="_blank" href={profile.website}><i className="fas fa-globe fa-2x" /></a>}
                    {isEmpty(profile.social.facebook) && !profile.social.facebook ?
                      null : <a className="text-white p-2" target="_blank" href={profile.social.facebook}><i className="fab fa-facebook fa-2x" /></a>}
                    {isEmpty(profile.social.twitter) && !profile.social.twitter ?
                      null : <a className="text-white p-2" target="_blank" href={profile.social.twitter}><i className="fab fa-twitter fa-2x" /></a>}
                    {isEmpty(profile.social.instagram) && !profile.social.instagram ?
                      null : <a className="text-white p-2" target="_blank" href={profile.social.instagram}><i className="fab fa-instagram fa-2x" /></a>}
                    {isEmpty(profile.social.linkedin) && !profile.social.linkedin ?
                      null : <a className="text-white p-2" target="_blank" href={profile.social.linkedin}><i className="fab fa-linkedin fa-2x" /></a>}
                    {isEmpty(profile.social.youtube) && !profile.social.youtube ?
                      null : <a className="text-white p-2" target="_blank" href={profile.social.youtube}><i className="fab fa-youtube fa-2x" /></a>}
                  </p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileHeader;
