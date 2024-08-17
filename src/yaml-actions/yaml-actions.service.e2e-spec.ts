import { Test, TestingModule } from '@nestjs/testing';
import { YamlActionsService } from './yaml-actions.service';
import { CustomLogger } from '../logger/custom-logger';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { YamlActionsModule } from './yaml-actions.module';

describe('YamlActionsService (e2e)', () => {
  let app: INestApplication;
  let yamlActionsService: YamlActionsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [YamlActionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    yamlActionsService = moduleFixture.get<YamlActionsService>(YamlActionsService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/yaml-actions/process (POST) - should process valid YAML', () => {
    const validYaml = `
      log:
        message: "Test log message"
      http_request:
        url: "https://example.com"
        method: "GET"
    `;

    return request(app.getHttpServer())
      .post('/yaml-actions/process')
      .send({ yaml: validYaml })
      .expect(201)
      .expect({ message: 'YAML string processed successfully' });
  });

  it('/yaml-actions/process (POST) - should handle invalid YAML', () => {
    const invalidYaml = `
      invalid:
        - yaml
        : structure
    `;

    return request(app.getHttpServer())
      .post('/yaml-actions/process')
      .send({ yaml: invalidYaml })
      .expect(500);
  });

  it('should parse valid YAML string', () => {
    const validYaml = `
      key: value
      nested:
        subkey: subvalue
    `;

    const result = yamlActionsService.parseYamlString(validYaml);
    expect(result).toEqual({
      key: 'value',
      nested: {
        subkey: 'subvalue'
      }
    });
  });

  it('should throw error for invalid YAML string', () => {
    const invalidYaml = `
      invalid:
        - yaml
        : structure
    `;

    expect(() => yamlActionsService.parseYamlString(invalidYaml)).toThrow('Invalid YAML string');
  });

  it('should execute log action', () => {
    const logSpy = jest.spyOn(CustomLogger.prototype, 'log');
    const parsedYaml = {
      log: 'Test log message'
    };

    yamlActionsService.executeActions(parsedYaml);

    expect(logSpy).toHaveBeenCalledWith('Test log message');
  });

  it('should execute http_request action', () => {
    const logSpy = jest.spyOn(CustomLogger.prototype, 'log');
    const parsedYaml = {
      http_request: {
        url: 'https://example.com',
        method: 'GET'
      }
    };

    yamlActionsService.executeActions(parsedYaml);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('HTTP request action'));
  });
});