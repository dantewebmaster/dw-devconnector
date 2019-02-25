import { ActionReducerMap } from '@ngrx/store';

import { routerReducer } from '@ngrx/router-store';
import { IAppState } from '../state/app.state';

import { stepperReducers } from './stepper.reducers';
import { userReducers } from './user.reducers';

export const appReducers: ActionReducerMap<IAppState, any> = {
  steps: stepperReducers,
  users: userReducers,
  router: routerReducer,
};
