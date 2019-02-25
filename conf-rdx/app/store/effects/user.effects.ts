import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import {
  select,
} from '@ngrx/store';
import { of } from 'rxjs';
import {
  switchMap,
} from 'rxjs/operators';

import { IAppState } from '../state/app.state';
import {
  EUserActions,
  GetUsersSuccess,
  GetUsers,
} from '../actions/user.actions';
import { selectUserList } from '../selectors/user.selectors';
import { UserService } from '../../services/user/user.service';
import { IUser } from '../../models/user.interface';

@Injectable()
export class UserEffects {
  @Effect()
  getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(EUserActions.GetUsers),
    switchMap(() => this._userService.getUsers()),
    switchMap((userHttp: IUser[]) => of(new GetUsersSuccess(userHttp)))
  );

  constructor(
    private _userService: UserService,
    private _actions$: Actions,
  ) {}
}
