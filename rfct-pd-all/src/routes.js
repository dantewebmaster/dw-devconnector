import React from 'react';
import { IndexRedirect, IndexRoute, Route } from 'react-router';

import App from './App';
import SignIn from './components/login/SignIn';
import SignOut from './components/login/SignOut';
import Unauthorized from './components/common/Unauthorized';

// PAGES
import Home from './components/home/Home';
import Parameters from './containers/Parameters';
import Scheduling from './containers/Scheduling';
import SchedulingCancel from './containers/SchedulingCancel';
import RelationshipStructureChange from './containers/RelationshipStructureChange';
import PersonRelationshipStatus from './containers/PersonRelationshipStatus';
import SchedulingReport from './containers/SchedulingReport';
import ResponsibleHistoryReport from './containers/ResponsibleHistoryReport';
import ResponsibleStructureAssociation from './containers/ResponsibleStructureAssociation';
import PeopleNonContemplatedReport from './containers/PeopleNonContemplatedReport';
import PersonInformation from './containers/PersonInformation';
import DownloadReports from './containers/DownloadReports';
import BulkRelationshipStatus from './containers/BulkRelationshipStatus';
import StructureSuggestion from './containers/StructureSuggestion';

import { isUserAllowed, UserIsAuthenticated, UserIsNotAuthenticated } from '../src/auth';

const Authenticated = UserIsAuthenticated(props => props.children);
const NotAuthenticated = UserIsNotAuthenticated(props => props.children);

export default (
  <Route path={process.env.PUBLIC_PATH} component={App}>
    <IndexRedirect to="home" />

    <Route component={NotAuthenticated}>
      <IndexRedirect to="signIn" />
      <Route path="signIn" component={SignIn} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={SignOut} />
      <Route path="signOut" component={SignOut} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={Unauthorized} />
      <Route path="unauthorized" component={Unauthorized} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(PersonInformation, 'person-information')} />
      <Route path="person-information" component={isUserAllowed(PersonInformation, 'person-information')} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(ResponsibleStructureAssociation, 'responsible-association')} />
      <Route path="responsible-association" component={isUserAllowed(ResponsibleStructureAssociation, 'responsible-association')} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(StructureSuggestion, 'structure-suggestion')} />
      <Route path="structure-suggestion" component={isUserAllowed(StructureSuggestion, 'structure-suggestion')} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(Parameters, 'parameters')} />
      <Route path="parameters" component={isUserAllowed(Parameters, 'parameters')} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(RelationshipStructureChange, 'relationship-structure-change')} />
      <Route path="relationship-structure-change" component={isUserAllowed(RelationshipStructureChange, 'relationship-structure-change')} />
    </Route>
    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(Scheduling, 'scheduling')} />
      <Route path="scheduling" component={isUserAllowed(Scheduling, 'scheduling')} />
    </Route>
    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(SchedulingCancel, 'scheduling/cancel')} />
      <Route path="scheduling-cancel" component={isUserAllowed(SchedulingCancel, 'scheduling/cancel')} />
      <Route path="unauthorized" component={Unauthorized} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(PersonRelationshipStatus, 'person-relationship-status')} />
      <Route path="person-relationship-status" component={isUserAllowed(PersonRelationshipStatus, 'person-relationship-status')} />
    </Route>
    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(BulkRelationshipStatus, 'bulk-relationship-status')} />
      <Route path="bulk-relationship-status" component={isUserAllowed(BulkRelationshipStatus, 'bulk-relationship-status')} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(SchedulingReport, 'scheduling-report')} />
      <Route path="scheduling-report" component={isUserAllowed(SchedulingReport, 'scheduling-report')} />
    </Route>
    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(ResponsibleHistoryReport, 'responsible-history-report')} />
      <Route path="responsible-history-report" component={isUserAllowed(ResponsibleHistoryReport, 'responsible-history-report')} />
    </Route>
    <Route component={Authenticated}>
      <IndexRoute component={isUserAllowed(PeopleNonContemplatedReport, 'people-non-contemplated-report')} />
      <Route path="people-non-contemplated-report" component={isUserAllowed(PeopleNonContemplatedReport, 'people-non-contemplated-report')} />
    </Route>

    <Route component={Authenticated}>
      <IndexRoute component={DownloadReports} />
      <Route path="downloads" component={DownloadReports} />
    </Route>
  </Route>
);
