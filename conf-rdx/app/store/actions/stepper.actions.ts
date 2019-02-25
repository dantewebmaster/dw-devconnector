import { Action } from '@ngrx/store';

import { IStep } from '../../models/stepper.interface';

export enum EStepperActions {
  ChangeStep = '[Step] Back Step',
  ChangeStepSuccess = '[Step] Change Step Success',
}

export class ChangeStep implements Action {
  public readonly type = EStepperActions.ChangeStep;
}

export class ChangeStepSuccess implements Action {
  public readonly type = EStepperActions.ChangeStepSuccess;
  constructor(public payload: IStep[]) {}
}

export type StepperActions = ChangeStep | ChangeStepSuccess;
