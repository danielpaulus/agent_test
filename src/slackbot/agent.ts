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
import { LokiAgent } from 'src/loki_agent/agent';

export class PlannerAgent {
  private readonly llm = new OpenAI({
    //model: 'gpt-3.5-turbo',
    model: 'gpt-4o',
    additionalChatOptions: { response_format: { type: 'json_object' } },
    apiKey: process.env.OPENAI_API_KEY,
  });
  lokiAgent: LokiAgent;

  init() {
    this.lokiAgent = new LokiAgent();
    this.lokiAgent.init();
    /*Settings.llm = new Ollama({
      model: 'llama3.1:8b-instruct-fp16',
      //model: 'llama3.1',
    });*/
    /*
    Settings.callbackManager.on('llm-tool-call', (event) => {
      console.log(event.detail);
    });
    Settings.callbackManager.on('llm-tool-result', (event) => {
      console.log(event.detail);
    });*/
  }

  async queryAgent(
    question: string,
    updateUser: (msg: string) => Promise<void>,
  ) {
    console.log(`planning agent starting`);

    const prompt = `assume you have the following agents available: 
1. The logs_agent, which can query and summarize the system services and backend logs for you. 
   It needs to know how long to look back in minutes and which services to query.
  It has the checkly-api and the checkly-alerting-service available. 

2. The checkly_agent to understand if your app is okay from a user's perspective.
   It can download API check results which let you know if your API is working.
   It can also download Browser check results which let you know if your app is working from a user's perspective.
   You can ask it f.ex. to find failures in a time frame in minutes. 

You need to instruct one or all of your agents with a prompt what they should do. 
Analyze the user question and come up with a plan. 

Output your response in a json format.Start with one property "explain" where you explain 
in plain human readable text what you will ask you agents to do and mention this might take a few seconds.
All your agent invocations should be in a list called "tasks". Provide "agent_id" and "task_description" for each task.
Tasks should be written as a prompt as your agents also are LLMs. Do NOT be conversational. 
`;

    const response = await this.llm.chat({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Here is the user question: \n------\n${question}\n------`,
        },
      ],
    });
    const responsePlanning = response.message.content.toString();
    const content = JSON.parse(responsePlanning);
    updateUser(content.explain);
    for (const task of content.tasks) {
      const agent = task.agent_id;
      const prompt = task.task_description;
      if (agent === 'logs_agent') {
        const logsResponse = await this.lokiAgent.queryAgent(prompt);
        console.log('response from logs agent', logsResponse);
        updateUser(logsResponse.answer.toString());
      }
      if (agent === 'checkly_agent') {
        //const checklyResponse = await this.checklyAgent.queryAgent(prompt);
        updateUser('pinging checkly agent');
      }
      console.log(response.message.content);
    }

    return 'done';
  }
}
