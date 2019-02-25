import { IStep } from '../../models/stepper.interface';

export interface IStepperState {
  steps: IStep[];
}

export const initialStepperState: IStepperState = {
  steps: null
}
