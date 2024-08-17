import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../logger/custom-logger';
import * as yaml from 'js-yaml';

@Injectable()
export class YamlActionsService {
  constructor(private readonly logger: CustomLogger) {}

  // Parses a YAML string into a JavaScript object
  // - yaml_string: the YAML string to parse
  // = the parsed YAML as a JavaScript object
  parseYamlString(yaml_string: string): any {
    try {
      return yaml.load(yaml_string);
    } catch (error) {
      this.logger.error(`Failed to parse YAML: ${error.message}`);
      throw new Error('Invalid YAML string');
    }
  }

  // Executes actions based on the parsed YAML
  // - parsed_yaml: the parsed YAML object
  executeActions(parsed_yaml: any): void {
    if (!parsed_yaml || typeof parsed_yaml !== 'object') {
      this.logger.error('Invalid YAML structure');
      return;
    }

    for (const [action_name, action_data] of Object.entries(parsed_yaml)) {
      this.executeAction(action_name, action_data);
    }
  }

  // Executes a single action
  // - action_name: the name of the action to execute
  // - action_data: the data associated with the action
  private executeAction(action_name: string, action_data: any): void {
    switch (action_name) {
      case 'log':
        this.handleLogAction(action_data);
        break;
      case 'http_request':
        this.handleHttpRequestAction(action_data);
        break;
      // Add more action handlers here as needed
      default:
        this.logger.warn(`Unknown action: ${action_name}`);
    }
  }

  // Handles the 'log' action
  // - data: the data to log
  private handleLogAction(data: any): void {
    if (typeof data === 'string') {
      this.logger.log(data);
    } else {
      this.logger.log(JSON.stringify(data));
    }
  }

  // Handles the 'http_request' action
  // - data: the HTTP request data
  private handleHttpRequestAction(data: any): void {
    // Implement HTTP request logic here
    this.logger.log(`HTTP request action: ${JSON.stringify(data)}`);
    // You might want to use a library like axios to make actual HTTP requests
  }
}