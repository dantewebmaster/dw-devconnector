import { Injectable } from '@angular/core';
import { ELogLevel } from './log-level.enum';
import { LogEntry } from './log-entry';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';

@Injectable({
  providedIn: 'root',
})

export class LogService {
  constructor (private publishersService: LogPublishersService) {
    // Set publishers
    this.publishers = this.publishersService.publishers;
  }

  level: ELogLevel = ELogLevel.All;
  publishers: LogPublisher[];

  private shouldLog(level: ELogLevel): boolean {
    let ret: boolean = false;
    if ((level >= this.level && level !== ELogLevel.Off) || this.level === ELogLevel.All) {
      ret = true;
    }
    return ret;
  }

  private writeToLog(msg: string, level: ELogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();

      entry.userId = null;
      entry.correlationId = null;
      entry.level = level;
      entry.description = msg;
      entry.extraInfo = params;

      for (let logger of this.publishers) {
        logger.log(entry).subscribe(response => console.log(response));
      }
    }
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, ELogLevel.All, optionalParams);
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, ELogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, ELogLevel.Information, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, ELogLevel.Warning, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, ELogLevel.Error, optionalParams);
  }
}
