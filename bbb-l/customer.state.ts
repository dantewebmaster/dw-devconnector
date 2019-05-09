import { ICustomer } from '../../models/customer.interface';
import { IError } from 'src/app/models/error.interface';

export interface ICustomerState {
  selectedCustomer: ICustomer;
  errors: IError;
  profileResponse: string;
}

export const initialCustomerState: ICustomerState = {
  selectedCustomer: null,
  errors: null,
  profileResponse: null,
};
