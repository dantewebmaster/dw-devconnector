import { EDrugstoresActions, DrugstoresActions } from '../actions/drugstores.actions';
import { initialDrugstoresState, IDrugstoresState } from '../state/drugstores.state';

export const drugstoresReducers = (
  state = initialDrugstoresState,
  action: DrugstoresActions,
): IDrugstoresState => {
  switch (action.type) {
    case EDrugstoresActions.GetDrugstoresSuccess: {
      return {
        ...state,
        drugstores: action.payload,
      };
    }
    case EDrugstoresActions.ClearDrugstores: {
      return {
        ...state,
        drugstores: [],
      };
    }
    case EDrugstoresActions.SetField: {
      return {
        ...state,
        searchValue: action.payload
      };
    }
    default:
      return state;
  }
};
