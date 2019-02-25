import { Injectable } from '@angular/core';
import { ELogLevel } from './log-level.enum';

@Injectable({
  providedIn: 'root',
})
export class LogEntry {
  // Public Properties
  userId: string = "";
  correlationId: string = "";
  level: ELogLevel = ELogLevel.Debug;
  description: string = "";
  create: Date = new Date();
  extraInfo: any[] = [];

  buildLogString(): string {
    let ret: string = "";
    ret = "Create: " + new Date() + " - ";
    ret += "Level: " + ELogLevel[this.level];
    ret += " - Description: " + this.description;
    if (this.extraInfo.length) {
      ret += " - Extra Info: " + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(",");

    // Is there at least one object in the array?
    if (params.some(p => typeof p == "object")) {
      ret = "";
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }
}
