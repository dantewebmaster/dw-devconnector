import { Action } from '@ngrx/store';
import { IDrugstore } from '../../models/drugstore.interface';

export enum EDrugstoresActions {
  GetDrugstores = '[Drugstores] Get Drugstores',
  GetDrugstoresSuccess = '[Drugstores] Get Drugstores Success',
  ClearDrugstores = '[Drugstores] Clear Drugstores',
  SetField = '[Drugstores] Set Field',
}

export class GetDrugstores implements Action {
  public readonly type = EDrugstoresActions.GetDrugstores;
  constructor(public payload: string) {}
}
export class ClearDrugstores implements Action {
  public readonly type = EDrugstoresActions.ClearDrugstores;
}

export class GetDrugstoresSuccess implements Action {
  public readonly type = EDrugstoresActions.GetDrugstoresSuccess;
  constructor(public payload: IDrugstore[]) {}
}

export class SetField implements Action {
  public readonly type = EDrugstoresActions.SetField;
  constructor (public payload: string) { }
}

export type DrugstoresActions = GetDrugstores | GetDrugstoresSuccess | ClearDrugstores | SetField;
