import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
//import { IStep } from '../../models/stepper.interface';

import { IAppState } from '../../store/state/app.state';
import { selectDrugstoresList } from '../../store/selectors/drugstores.selectors';
import { GetDrugstores, ClearDrugstores, SetField } from '../../store/actions/drugstores.actions';

@Component({
  selector: 'app-drugstore',
  templateUrl: './drugstore.component.html',
  styleUrls: ['./drugstore.component.scss']
})
export class DrugstoreComponent implements OnInit {

  // steps: IStep[] = [
  //   { title: 'Cliente', completed: true, active: false },
  //   { title: 'Loja', completed: true, active: false },
  //   { title: 'Passo 3', completed: false, active: true },
  //   { title: 'Passo 4', completed: false, active: false },
  // ];

  drugstores$ = this._store.pipe(select(selectDrugstoresList));
  searchValue$ = this._store.pipe(select('searchValue'));

  constructor(private _store: Store<IAppState>) { }

  ngOnInit() {
    this._store.dispatch(new GetDrugstores('201'));
    console.log(this.searchValue$)
  }

  // setField(value: string) {
  //   this._store.dispatch(new SetField(value));
  //   console.log(this.searchValue$)
  // }

  // Get drugstores usgin passed value - 3 chars
  getDrugstores(searchValue: string) {
    this._store.dispatch(new GetDrugstores(searchValue));
  }

  // Clear the list of drugstores
  resetDrugstores() {
    this._store.dispatch(new ClearDrugstores());
    console.log(this.drugstores$);
  }

}
