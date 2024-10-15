import { Test, TestingModule } from '@nestjs/testing';
import { ChecklyController } from './checkly.controller';

describe('ChecklyController', () => {
  let controller: ChecklyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklyController],
    }).compile();

    controller = module.get<ChecklyController>(ChecklyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    controller.receiveAlert(exampleAlert);
  });
});

const exampleAlert = {
  CHECK_NAME: 'fail50',
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
