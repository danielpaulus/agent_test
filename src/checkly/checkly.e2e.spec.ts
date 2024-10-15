import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
jest.setTimeout(60000);
describe('Checkly E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/checkly (POST ALERT)', () => {
    return request(app.getHttpServer())
      .post('/checkly')
      .send(exampleAlert)
      .expect(201);
  });
});

const exampleAlert = {
  CHECK_NAME: 'e2e_test_ignore_me',
  CHECK_ID: 'b68422ae-6528-45a5-85a6-e85e1be9de2e',
  CHECK_TYPE: 'MULTI_STEP',
  GROUP_NAME: '',
  ALERT_TITLE: 'fail50 has failed',
  ALERT_TYPE: 'ALERT_FAILURE',
  CHECK_RESULT_ID: '995b7d3c-d42a-443a-a8b3-194319436ba7',
  RESPONSE_TIME: '1649',
  API_CHECK_RESPONSE_STATUS_CODE: '',
  API_CHECK_RESPONSE_STATUS_TEXT: '',
  RUN_LOCATION: 'Frankfurt',
  RESULT_LINK:
    'https://app.checklyhq.com/checks/b68422ae-6528-45a5-85a6-e85e1be9de2e/results/multi_step/995b7d3c-d42a-443a-a8b3-194319436ba7',
  SSL_DAYS_REMAINING: '',
  SSL_CHECK_DOMAIN: '',
  STARTED_AT: '2024-10-09T13:30:22.741Z',
  TAGS: '',
  $RANDOM_NUMBER: '271',
  $UUID: '94a5dc1e-9d84-42d5-8a9c-e0fd859616d9',
  moment: 'October 09, 2024',
};
