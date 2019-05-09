import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
// import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import {
  ECustomerActions,
  GetCustomer,
  GetCustomerSuccess,
  SetCustomerError,
  ValidateProfile,
  SaveProfile,
  SetProfile,
  ResetProfileInfo,
} from '../actions/customer.actions';
import { CustomersService } from '../../services/customers/customers.service';
import { ICustomer } from '../../models/customer.interface';
import { HideLoader } from '../actions/loader.actions';

@Injectable()
export class CustomerEffects {
  @Effect()
  getCustomer$ = this._actions$.pipe(
    ofType<GetCustomer>(ECustomerActions.GetCustomer),
    switchMap(({ payload }) =>
      this._customersService.getCustomer(payload).pipe(
        mergeMap((customerHttp: ICustomer) => [
          new HideLoader(),
          new GetCustomerSuccess(customerHttp),
        ]),
        catchError(({ error }) => [
          new SetCustomerError(error && error.message ? { message: error.message } : { message: 'Erro desconhecido' }),
          new HideLoader(),
        ])),
    )
  );

  @Effect()
  validateProfile$ = this._actions$.pipe(
    ofType<ValidateProfile>(ECustomerActions.ValidateProfile),
    switchMap(({ payload }) =>
      this._customersService.validateProfile(payload).pipe(
        mergeMap((res) => [
          new ResetProfileInfo(),
          new SaveProfile(payload)
        ]),
        catchError(({ error }) => [
          new SetCustomerError(error && error.message ? { message: error.message } : { message: 'Erro desconhecido' }),
        ])),
    )
  );

  @Effect()
  poolingProfile$ = this._actions$.pipe(
    ofType<SaveProfile>(ECustomerActions.SaveProfile),
    switchMap(({ payload }) =>
      this._customersService.saveProfile(payload).pipe(
        map((res) => {
          if (res.status === 200) {
            // Start pooling to check when backend finished registering profile
            return new SetProfile('finished');
          }
        }),
        catchError(({ error }) => [
          new SetCustomerError(error && error.message ? { message: error.message } : { message: 'Erro desconhecido' }),
          new SetProfile('error'),
        ])),
    )
  );

  constructor(
    private _customersService: CustomersService,
    private _actions$: Actions,
  ) { }
}
