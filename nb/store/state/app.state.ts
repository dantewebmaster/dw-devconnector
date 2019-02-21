// npm install   --save
import { RouterReducerState } from '@ngrx/router-store';

import { IStepperState, initialStepperState } from './stepper.state';

export interface IAppState {
  router?: RouterReducerState;
  steps: IStepperState;
}

export const initialAppState: IAppState = {
  steps: initialStepperState,
}

export function getInitialState(): IAppState {
  return initialAppState;
}
