import { LokiAgent } from './agent';
jest.setTimeout(60000);
describe('LokiAgent', () => {
  const client: LokiAgent = new LokiAgent();
  client.init();

  beforeEach(async () => {});

  it('should be defined', async () => {
    const resp = await client.queryAgent(
      'check backend logs for the past 60 minutes for any issues related to the checkly-api and checkly-alerting-service.',
    );
    expect(resp).toBeDefined();
    console.log(resp);
  });
});
