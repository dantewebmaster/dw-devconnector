import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  profileSummary: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  avatar: {
    border: `1px solid ${theme.palette.grey['400']}`,
    width: '100%',
    height: '100%',
  },
  skillChips: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    marginLeft: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
  },
});

export class ProfileItem extends Component {
  render() {
    const { profile, classes } = this.props;

    return (
      <React.Fragment>
        <Divider className={classes.divider} />
        <Grid container spacing={40}>
          <Grid item xs={3}>
            <Avatar src={profile.user.avatar} alt={profile.user.name} className={classes.avatar} />
          </Grid>
          <Grid item xs={9} className={classes.profileSummary}>
            <div>
              <Typography variant="h4" component="h2" >
                {profile.user.name}
              </Typography>

              <Typography variant="body1">
                {profile.status} {isEmpty(profile.company) ? null : <span>at {profile.company}</span>}
              </Typography>
              <Typography variant="body1">
                {isEmpty(profile.location) ? null : <span>{profile.location}</span>}
              </Typography>
            </div>
            <div className={classes.skillChips}>
              <Typography variant="subtitle2">Skills Set</Typography>
              {profile.skills.slice(0, 4).map((skill, index) => (
                <Chip key={index} label={skill} variant="outlined" color="secondary" className={classes.chip} />
              ))}
            </div>
            <Button variant="contained" color="primary" component={Link} to={`/profile/${profile.handle}`}>View Profile</Button>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileItem);
