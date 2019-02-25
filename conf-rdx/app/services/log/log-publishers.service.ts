import { Injectable } from '@angular/core';
import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi } from "./log-publishers";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LogPublishersService {
    constructor(private http: HttpClient) {
        // Build publishers arrays
        this.buildPublishers();
    }

    // Public properties
    publishers: LogPublisher[] = [];

    // Build publishers array
    buildPublishers(): void {
        // Create instance of LogConsole Class
        this.publishers.push(new LogConsole());
        // Create instance of LogLocalStorage Class
        this.publishers.push(new LogLocalStorage());
        // Create instance of LogWebApi Class
        this.publishers.push(new LogWebApi(this.http));
    }
}
