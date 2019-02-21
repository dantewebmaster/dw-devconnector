import { IStep } from '../../models/stepper.interface';

export interface IStepperState {
  steps: IStep[];
}

export const initialStepperState: IStepperState = {
  steps: [
    { title: 'Passo 1', active: false, completed: true },
    { title: 'Passo 2', active: false, completed: false },
    { title: 'Passo 3', active: false, completed: false },
  ]
}
