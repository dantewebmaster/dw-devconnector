import { EStepperActions, StepperActions } from '../actions/stepper.actions';
import { initialStepperState, IStepperState } from '../state/stepper.state';

export const stepperReducers = (
  state = initialStepperState,
  action: StepperActions,
): IStepperState => {
  switch (action.type) {
    case EStepperActions.ChangeStepSuccess: {
      return {
        ...state,
        steps: action.payload
      }
    }
    default:
      return state;
  }
};
