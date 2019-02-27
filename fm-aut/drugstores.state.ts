import { IDrugstore } from '../../models/drugstore.interface';

export interface IDrugstoresState {
  drugstores: IDrugstore[];
  searchValue: string;
}

export const initialDrugstoresState: IDrugstoresState = {
  drugstores: [],
  searchValue: '',
}
