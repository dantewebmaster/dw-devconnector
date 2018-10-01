import React from 'react';
import NavBar from './Navbar/Navbar';
import Parallax from '../Parallax/Parallax';

export default ({ title }) => {
  return (
    <div>
      <Parallax filter small image={require("../../img/showcase.jpg")}>
        <Typography component="h1" className={classes.headeTitle}>Developers</Typography>
      </Parallax>
    </div>
  )
}
