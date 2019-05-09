import { Action } from '@ngrx/store';
import { ICustomer } from '../../models/customer.interface';
import { IError } from 'src/app/models/error.interface';

export enum ECustomerActions {
  GetCustomer = '[Customer] Get Customer',
  GetCustomerSuccess = '[Customer] Get Customer Success',
  SetCustomer = '[Customer] Set Customer',
  ResetCustomer = '[Customer] Reset Customer',
  SetCustomerError = '[Customer] Set Error',
  ResetCustomerErrors = '[Customer] Reset Errors',
  ValidateProfile = '[Customer] Validate Profile',
  SaveProfile = '[Customer] Save Profile',
  SetProfile = '[Customer] Set Profile',
  ResetProfileInfo = '[Customer] Reset Profile Info',
}

export class GetCustomer implements Action {
  public readonly type = ECustomerActions.GetCustomer;
  constructor (public payload: string) { }
}

export class ValidateProfile implements Action {
  public readonly type = ECustomerActions.ValidateProfile;
  constructor (public payload: string) { }
}

export class SaveProfile implements Action {
  public readonly type = ECustomerActions.SaveProfile;
  constructor (public payload: string) { }
}

export class GetCustomerSuccess implements Action {
  public readonly type = ECustomerActions.GetCustomerSuccess;
  constructor (public payload: ICustomer) { }
}

export class SetCustomer implements Action {
  public readonly type = ECustomerActions.SetCustomer;
  constructor (public payload: ICustomer) { }
}

export class ResetCustomer implements Action {
  public readonly type = ECustomerActions.ResetCustomer;
}

export class SetCustomerError implements Action {
  public readonly type = ECustomerActions.SetCustomerError;
  constructor (public payload: IError) { }
}

export class ResetCustomerErrors implements Action {
  public readonly type = ECustomerActions.ResetCustomerErrors;
}

export class ResetProfileInfo implements Action {
  public readonly type = ECustomerActions.ResetProfileInfo;
}

export class SetProfile implements Action {
  public readonly type = ECustomerActions.SetProfile;
  constructor (public payload: string) { }
}

export type CustomerActions =
  GetCustomer |
  GetCustomerSuccess |
  SetCustomer |
  ResetCustomer |
  SetCustomerError |
  ResetCustomerErrors |
  ValidateProfile |
  SaveProfile |
  SetProfile |
  ResetProfileInfo;
