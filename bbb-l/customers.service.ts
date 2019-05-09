import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAppState } from 'src/app/store/state/app.state';
import { ShowLoader } from 'src/app/store/actions/loader.actions';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  _url: string = environment.services.bff;

  constructor(private _http: HttpClient, private _store: Store<IAppState>) { }

  public getCustomer(_cpf: string): Observable<any> {
    this._store.dispatch(new ShowLoader());
    return this._http.get(`${this._url}/customer/CPF/${_cpf}`);
  }

  public validateProfile(_cpf: string): Observable<any> {
    return this._http.get(`${this._url}/customer/${_cpf}/profile`, { observe: 'response' });
  }

  public saveProfile(_cpf: string): Observable<any> {
    return this._http.get(`https://httpstat.us/200?sleep=2000`, { observe: 'response' });
    // return this._http.post(`${this._url}/customer/${_cpf}/profile`, { observe: 'response' });
  }
}
