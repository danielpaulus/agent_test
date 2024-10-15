// Your imports go here
/*
Agent

Imagine you are an agent solving users problems. Use this approach:
- first create a thought what you want to do 
- then think about an action using your tools
- observe the response, and decide if you want to continue or not

"tell me what's wrong with checkly"
Thought: I need to check the logs
Action: call getLogs with the checkid and checkresultid
Observe: logs...

Multi Agent 



*/
import {
  OpenAI,
  //Ollama,
  Settings,

  //Groq,
} from 'llamaindex';
import 'dotenv/config';

export class PlannerAgent {
  private readonly llm = new OpenAI({
    model: 'gpt-3.5-turbo',
    additionalChatOptions: { response_format: { type: 'json_object' } },
    apiKey: process.env.OPENAI_API_KEY,
  });

  init() {
    /*Settings.llm = new Ollama({
      model: 'llama3.1:8b-instruct-fp16',
      //model: 'llama3.1',
    });*/

    Settings.callbackManager.on('llm-tool-call', (event) => {
      console.log(event.detail);
    });
    Settings.callbackManager.on('llm-tool-result', (event) => {
      console.log(event.detail);
    });
  }

  async queryAgent(question: string) {
    console.log(`planning agent starting`);

    const prompt = `assume you have the following agents available: 
1. The Grafana Loki Agent, which can analyze the system services and backend logs for you. It needs to know how long to look back in minutes and which services to query. It has the checkly-api and the checkly-alerting-service available. 
2. The Checkly Agent to download and look for synthetic monitoring errors. Synthetic checks analyse the frontend. They can make API calls and are using Playwright to execute browser e2e tests.  
Create prompts to send your agents to respond to the user prompt.
Output your response in a json format. Do NOT be conversational. Only output JSON with agent and prompt.   `;

    const response = await this.llm.chat({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Here is the transcript: \n------\n${question}\n------`,
        },
      ],
    });

    console.log(response.message.content);

    const content = response.message.content.toString();
    return content;
  }
}
