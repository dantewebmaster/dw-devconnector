// npm install   --save
import { RouterReducerState } from '@ngrx/router-store';

import { IUserState, initialUserState } from './user.state';
import { IStepperState, initialStepperState } from './stepper.state';

export interface IAppState {
  router?: RouterReducerState;
  steps: IStepperState;
  users: IUserState;
}

export const initialAppState: IAppState = {
  steps: initialStepperState,
  users: initialUserState,
}

export function getInitialState(): IAppState {
  return initialAppState;
}
