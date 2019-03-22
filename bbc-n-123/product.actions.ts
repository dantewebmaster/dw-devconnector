import { Action } from '@ngrx/store';
import { IProductHttp } from '../../models/product.interface';
import { IError } from 'src/app/models/error.interface';

export enum EProductActions {
  GetProductFastSearch = '[Product] Get Product Fast Search',
  GetProductFastSearchSuccess = '[Product] Get Product Fast Search Success',
  GetProductSearch = '[Product] Get Product Search',
  GetProductSearchSuccess = '[Product] Get Product Search Success',
  GetProductSearchWithCpf = '[Product] Get Product Search With Cpf',
  GetProductSearchWithCpfSuccess = '[Product] Get Product Search With Cpf Success',
  SetError = '[Product] Set Error',
  ResetErrors = '[Product] Reset Errors',
  ResetProducts = '[Product] Reset Products',

  SelectProduct = '[Product] Select Product',
  UpdateSelectedProducts = '[Product] Update Selected Products',
}

export class SelectProduct implements Action {
  public readonly type = EProductActions.SelectProduct;
  constructor(public payload: object[]) { }
}

export class UpdateSelectedProducts implements Action {
  public readonly type = EProductActions.UpdateSelectedProducts;
  constructor(public payload: object) { }
}

export class GetProductFastSearch implements Action {
  public readonly type = EProductActions.GetProductFastSearch;
  constructor(public payload: string) { }
}

export class GetProductFastSearchSuccess implements Action {
  public readonly type = EProductActions.GetProductFastSearchSuccess;
  constructor(public payload: string) { }
}

export class GetProductSearch implements Action {
  public readonly type = EProductActions.GetProductSearch;
  constructor(public payload: string) { }
}

export class GetProductSearchSuccess implements Action {
  public readonly type = EProductActions.GetProductSearchSuccess;
  constructor(public payload: IProductHttp) { }
}

export class GetProductSearchWithCpf implements Action {
  public readonly type = EProductActions.GetProductSearchWithCpf;
  constructor(public payload: any) { }
}

export class GetProductSearchWithCpfSuccess implements Action {
  public readonly type = EProductActions.GetProductSearchWithCpfSuccess;
  constructor(public payload: IProductHttp) { }
}

export class SetError implements Action {
  public readonly type = EProductActions.SetError;
  constructor(public payload: IError) { }
}
export class ResetErrors implements Action {
  public readonly type = EProductActions.ResetErrors;
}

export class ResetProducts implements Action {
  public readonly type = EProductActions.ResetProducts;
}

export type ProductActions =
  SelectProduct |
  UpdateSelectedProducts |
  GetProductFastSearch |
  GetProductFastSearchSuccess |
  GetProductSearch |
  GetProductSearchSuccess |
  GetProductSearchWithCpf |
  GetProductSearchWithCpfSuccess |
  SetError |
  ResetErrors |
  ResetProducts;
