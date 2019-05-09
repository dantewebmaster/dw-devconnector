import { ECustomerActions, CustomerActions } from '../actions/customer.actions';
import { initialCustomerState, ICustomerState } from '../state/customer.state';

export function customerReducers(
  state = initialCustomerState,
  action: CustomerActions,
): ICustomerState {
  switch (action.type) {
    case ECustomerActions.GetCustomerSuccess: {
      return {
        ...state,
        selectedCustomer: action.payload,
      };
    }
    case ECustomerActions.SetCustomer: {
      return {
        ...state,
        selectedCustomer: action.payload,
      };
    }
    case ECustomerActions.SaveProfile: {
      return {
        ...state,
        profileResponse: 'loading',
      };
    }
    case ECustomerActions.SetProfile: {
      return {
        ...state,
        profileResponse: action.payload,
      };
    }
    case ECustomerActions.ResetProfileInfo: {
      return {
        ...state,
        profileResponse: initialCustomerState.profileResponse,
      };
    }
    case ECustomerActions.ResetCustomer: {
      return {
        ...state,
        selectedCustomer: initialCustomerState.selectedCustomer,
      };
    }

    case ECustomerActions.SetCustomerError: {
      return {
        ...state,
        errors: action.payload,
      };
    }
    case ECustomerActions.ResetCustomerErrors: {
      return {
        ...state,
        errors: initialCustomerState.errors,
      };
    }

    default:
      return state;
  }
}
