import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

import { IAppState } from './store/state/app.state';
import { selectUserList } from './store/selectors/user.selectors';
import { GetUsers } from './store/actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'novo-balcao';

  users$ = this._store.pipe(select(selectUserList));

  constructor(private _store: Store<IAppState>, private _router: Router) { }

  ngOnInit() {
    this._store.dispatch(new GetUsers())
  }
}
