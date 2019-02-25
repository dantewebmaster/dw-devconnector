import { Action } from '@ngrx/store';

import { IUser } from '../../models/user.interface';

export enum EUserActions {
  ChangeStep = '[Users] Get Users',
  ChangeStepSuccess = '[Step] Change Step Success',
  GetUsers = '[User] Get Users',
  GetUsersSuccess = '[User] Get Users Success',
}

export class GetUsers implements Action {
  public readonly type = EUserActions.GetUsers;
}

export class GetUsersSuccess implements Action {
  public readonly type = EUserActions.GetUsersSuccess;
  constructor(public payload: IUser[]) {}
}

export type UserActions = GetUsers | GetUsersSuccess;
