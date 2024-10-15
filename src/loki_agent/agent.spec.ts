import { LokiAgent } from './agent';
jest.setTimeout(60000);
describe('LokiAgent', () => {
  const client: LokiAgent = new LokiAgent();
  client.init();

  beforeEach(async () => {});

  it('should be defined', async () => {
    const resp = await client.queryAgent(
      'Figure out if the logs indicate something is wrong on any service within the last 30 minutes',
    );
    expect(resp).toBeDefined();
    console.log(resp);
  });
});
