import { LokiClient } from './lokiclient';
import 'dotenv/config';
const lokiApiKey = process.env.LOKI_API_KEY!;
const user = process.env.LOKI_USER!;
const lokiUrl = process.env.LOKI_URL!;
jest.setTimeout(30000);
describe('LokiClient', () => {
  let lokiClient: LokiClient;

  beforeAll(() => {
    lokiClient = new LokiClient(lokiUrl, lokiApiKey, user);
  });

  it('should run a query and return results', async () => {
    const services = lokiClient.getAvailableServices();
    const data = await lokiClient.getErrorsForService(services[1], 10);
    expect(data).toBeDefined();
    expect(data).toHaveProperty('data');
    //console.log(JSON.stringify(data.data.result[0].values));
  });
});
