import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../../store/state/app.state';
import { selectUserList } from '../../store/selectors/user.selectors';
import { GetUsers } from '../../store/actions/user.actions';

@Component({
  selector: 'app-dw-autocomplete',
  templateUrl: './dw-autocomplete.component.html',
  styleUrls: ['./dw-autocomplete.component.scss']
})
export class DwAutocompleteComponent implements OnInit {

  users$ = this._store.pipe(select(selectUserList));

  constructor (private _store: Store<IAppState>) { }

  ngOnInit() { }

  keyword = 'DrugstoreId';
  inputPlaceholder = 'Digite o código interno, composto por 4 dígitos'

  selectEvent(item) {
    console.log(item)
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val)
    this._store.dispatch(new GetUsers())
  }

  onFocused(e) {
    // do something when input is focused
    console.log(e)
  }

}
