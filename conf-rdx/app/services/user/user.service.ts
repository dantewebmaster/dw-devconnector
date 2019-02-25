
import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUser } from 'src/app/models/user.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _url = 'https://randomuser.me/api/?results=10&nat=br';

  constructor (
    private http: HttpClient,
  ) { }

  getUsers(): Observable<IUser[]> {
    return this.http
      .get<IUser[]>(this._url)
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || "Unknown Server Error");
  }

}
