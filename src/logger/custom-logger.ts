import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor(
  ) {
    super();
    this.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']);
  }

  log(message: string, context?: string) {
    this.printMessage(message, 'log', context);
  }

  warn(message: string, context?: string) {
    this.printMessage(message, 'warn', context);
  }

  error(message: string, trace?: string, context?: string) {
    this.printMessage(message, 'error', context);
    if (trace) {
      this.printMessage(trace, 'error', context);
    }
  }

  debug(message: string, context?: string) {
    this.printMessage(message, 'debug', context);
  }

  verbose(message: string, context?: string) {
    this.printMessage(message, 'verbose', context);
  }

  private printMessage(message: string, logLevel: string, context?: string) {
    const output = context ? `[${context}] ${message}` : message;
    console.log(`[${new Date().toISOString()}] [${logLevel.toUpperCase()}] ${output}`);
  }

  static clearSTDOUT() {
    const logFile = path.join(process.cwd(), 'STDOUT.txt');
    try {
      fs.writeFileSync(logFile, '');
      console.log(`Log file cleared at ${logFile}`);
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }
}