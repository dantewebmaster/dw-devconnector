import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { ICustomerState } from '../state/customer.state';

const selectCustomerState = (state: IAppState) => state.customer;

export const selectCurrentCustomer = createSelector(
  selectCustomerState,
  (state: ICustomerState) => state.selectedCustomer
);

export const selectCustomerErrors = createSelector(
  selectCustomerState,
  (state: ICustomerState) => state.errors
);

export const selectProfileResponse = createSelector(
  selectCustomerState,
  (state: ICustomerState) => state.profileResponse
);
