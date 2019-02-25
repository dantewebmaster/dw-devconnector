
import { throwError as observableThrowError, Observable, of, from } from 'rxjs';
import { LogEntry } from './log-entry';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const environment = { services: { logBff: "http://localhost:3000" } };


export abstract class LogPublisher {
  location: string;
  abstract log(record: LogEntry): Observable<boolean>;
  abstract clear(): Observable<boolean>;
}

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    // Log to console
    console.log(entry.buildLogString());
    return of(true);
  }
  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}

export class LogLocalStorage extends LogPublisher {
  constructor () {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = "logging";
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
    let ret: boolean = false;
    let values: LogEntry[];

    try {
      // Get previous values from local storage
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      // Add new log entry to array
      values.push(entry);
      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));

      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }

    return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

export class LogWebApi extends LogPublisher {
  constructor (private http: HttpClient) {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = environment.services.logBff + "/logs";
  }

  // Add log entry to back end data store
  log(entry: LogEntry): Observable<boolean> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }

    this.http.post(this.location, entry, options).subscribe();

    return of(true);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    // TODO: Call Web API to clear all values
    return of(true);
  }

  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = "";

    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    if (error.json()) {
      msg += " - Exception Message: " + error.json().exceptionMessage;
    }
    errors.push(msg);

    console.error('An error occurred', errors);

    return observableThrowError(errors);
  }
}
