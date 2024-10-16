import { PlannerAgent } from './agent';
import {
  OpenAI,
  //Ollama,
  Settings,

  //Groq,
} from 'llamaindex';
import 'dotenv/config';
jest.setTimeout(30000);
describe('ChecklyService', () => {
  beforeEach(async () => {});

  it('should be defined', async () => {
    const llm = new OpenAI({
      model: 'gpt-3.5-turbo',
      additionalChatOptions: { response_format: { type: 'json_object' } },
      apiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = `assume you have the following agents available: 
    1. The Grafana Loki Agent, which can analyze the system services and backend logs for you. It needs to know how long to look back in minutes and which services to query. It has the checkly-api and the checkly-alerting-service available. 
    2. The Checkly Agent to download and look for synthetic monitoring errors. Synthetic checks analyse the frontend. They can make API calls and are using Playwright to execute browser e2e tests.  
    Figure out which agents you need to ask to solve the user problem. You can ask for more than one.
    Create prompts to send your agents to respond to the user prompt.
    use a json template like : [{ "agent": "agent_name", "prompt": "prompt_text" }]
    Output your response in a json format. Do NOT be conversational. Only output JSON with agent and prompt.   `;

    const response = await llm.chat({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Here is the user question: \n------\n${'sap'}\n------`,
        },
      ],
    });

    console.log(response.message.content);
  });
});
