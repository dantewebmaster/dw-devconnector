import React from 'react';

// Pages/Routes
import PrivateRoute from './components/common/PrivateRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

export default (
  <Router>
    <div className="App">
      <Navbar />
      <Route exact path="/" component={Landing} />
      <div className="container">
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:handle" component={Profile} />
        <Route exact path="/not-found" component={NotFound} />
        <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/add-experience" component={AddExperience} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/add-education" component={AddEducation} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/feed" component={Posts} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/post/:id" component={Post} />
        </Switch>
      </div>
      <Footer />
    </div>
  </Router>
);
