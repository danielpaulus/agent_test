// Your imports go here
import {
  //OpenAI,
  Ollama,
  FunctionTool,
  ReActAgent,
  Settings,
  BaseToolWithCall,
  Groq,
} from 'llamaindex';
import 'dotenv/config';
import { LokiClient } from './lokiclient';
const groqapikey = process.env.GROQ_API_KEY;
const lokiApiKey = process.env.LOKI_API_KEY!;
const user = process.env.LOKI_USER!;
const lokiUrl = process.env.LOKI_URL!;
export class LokiAgent {
  private readonly LokiClient: LokiClient = new LokiClient(
    lokiUrl,
    lokiApiKey,
    user,
  );
  agent: ReActAgent;
  init() {
    /*Settings.llm = new Ollama({
      model: 'llama3.1:8b-instruct-fp16',
      //model: 'llama3.1',
    });*/
    Settings.llm = new Groq({
      apiKey: groqapikey,
      model: 'llama3-70b-8192',
    });

    Settings.callbackManager.on('llm-tool-call', (event) => {
      console.log(event.detail);
    });
    Settings.callbackManager.on('llm-tool-result', (event) => {
      console.log(event.detail);
    });
    const tools = this.setupTools();
    this.agent = new ReActAgent({ tools: tools, verbose: true });
  }

  setupTools(): BaseToolWithCall[] {
    const getServices = FunctionTool.from(
      this.LokiClient.getAvailableServices,
      {
        name: 'getServices',
        description:
          'use this function to get a list of available services you can query logs for',
        parameters: {
          type: [],
          properties: {},
          required: [],
        },
      },
    );
    const getErrors = FunctionTool.from(
      async ({
        serviceName,
        minutes,
      }: {
        serviceName: string;
        minutes: number;
      }): Promise<string> => {
        if (!serviceName || !minutes) {
          return 'you need to provide a service name and minutes to query back';
        }
        const c = await this.LokiClient.getErrorsForService(
          serviceName,
          minutes,
        );
        if (c.data.result.length === 0) {
          return 'No errors found';
        }
        return c.data.result[0].values;
      },
      {
        name: 'getErrors',
        description:
          'use this function to get all errors for a service within a specified time range',
        parameters: {
          type: 'object',
          properties: {
            serviceName: {
              type: 'string',
              description: 'the name of the service you want to query',
            },
            minutes: {
              type: 'number',
              description: 'the amount of minutes you want to query back',
            },
          },
          required: ['serviceName', 'minutes'],
        },
      },
    );
    return [getErrors, getServices];
  }

  async queryAgent(question: string) {
    console.log(`querying agent `);
    const response = await this.agent.chat({
      message: `
        You are a senior devops expert reading logs to give helpful
        insights to the team. You have some tools available to query the logs.
        Here is the request you received and must give an answer to: "${question}" 
        Make sure to call your tools with the correct parameters. 
        Explain the errors you found and what you think the root cause is.
         `,
    });
    console.log(response.metadata);
    const content = response.message.content;
    if (typeof content === 'string') {
      // Extract Thought
      const thoughtMatch = content.match(/Thought:\s*(.*)/);
      const thought = thoughtMatch ? thoughtMatch[1].trim() : null;

      // Extract Answer
      const answerMatch = content.match(/Answer:\s*({[\s\S]*})/);
      const answer = answerMatch ? JSON.parse(answerMatch[1].trim()) : null;
      return { thought, answer };
    } else {
      return { thought: 'none', answer: content };
    }
  }
}
