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
  Ollama,
  FunctionTool,
  ReActAgent,
  Settings,
  BaseToolWithCall,
  Groq,
} from 'llamaindex';
import 'dotenv/config';
import { ChecklyClient } from './checklyclient';
const groqapikey = process.env.GROQ_API_KEY;
export class ChecklyAgent {
  private readonly ChecklyClient: ChecklyClient = new ChecklyClient();
  agent: ReActAgent;
  init() {
    /*Settings.llm = new Ollama({
      model: 'llama3.1:8b-instruct-fp16',
      //model: 'llama3.1',
    });*/
    /*
    Settings.llm = new Groq({
      apiKey: groqapikey,
      model: 'llama3-70b-8192',
    });
    */
    Settings.llm = new OpenAI({
      //model: 'gpt-3.5-turbo',
      model: 'gpt-4o',
      //additionalChatOptions: { response_format: { type: 'json_object' } },
      apiKey: process.env.OPENAI_API_KEY,
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
    const getScript = FunctionTool.from(
      async ({ checkid }: { checkid: string }): Promise<string> => {
        if (!checkid) {
          return 'you need to provide the checkid';
        }
        const c = await this.ChecklyClient.getCheck(checkid);
        return c.script;
      },
      {
        name: 'getScript',
        description: 'use this function to get the script of a check',
        parameters: {
          type: 'object',
          properties: {
            checkid: {
              type: 'string',
              description: 'the provided checkid',
            },
          },
          required: ['checkid'],
        },
      },
    );
    const getLogs = FunctionTool.from(
      async ({
        checkid,
        checkresultid,
      }: {
        checkid: string;
        checkresultid: string;
      }): Promise<string> => {
        if (!checkid) {
          return 'you need to provide the checkid';
        }
        if (!checkresultid) {
          const result = await this.ChecklyClient.getFailedAPIResults(checkid);
          if (result.length === 0) {
            return (
              'There were no failures for check:' +
              checkid +
              'everything is fine!'
            );
          }
          return result[0].getLog();
        }
        const c = await this.ChecklyClient.getCheckResult(
          checkid,
          checkresultid,
        );
        return c.getLog();
      },
      {
        name: 'getLogs',
        description: 'use this function to download logs',
        parameters: {
          type: 'object',
          properties: {
            checkid: {
              type: 'string',
              description: 'the provided checkid',
            },
            checkresultid: {
              type: 'string',
              description: 'the provided checkresultid',
            },
          },
          required: ['checkid', 'checkresultid'],
        },
      },
    );
    return [getLogs, getScript];
  }

  async getLastErrors(prompt: string) {
    console.log(`querying with checkid only`);
    const response = await this.agent.chat({
      message: `
         A Check is a monitoring script that tests a website or API endpoint(s).
         you are a developer debugging a failed Playwright script of a monitoring check. 
         The incident commander needs your help understanding if everything is ok or if there are errors.
         Here is his question:
          ${prompt}
        --- End of question --- 

         Start with planning your tool use. Review your plan at least once before starting to call tools.
         Do NOT be conversational, just provide the facts.
         Once you have a good plan you can start explaining these steps:
         Summary of logs: [Summarize relevant parts of the logs] 
         Script Analysis: [Could the script have caused the failure?]
         Final root cause: [Explain the failure based on your log summary and script analysis]
         Suggested fix: [Suggest a fix based on the root cause]
         Finally provide the output as a JSON object using this template:
         {"log_summary":your log summary,
         "script_analysis":your script analysis,
         "root_cause": your root cause,
         "suggested_fix":your suggested fix
         }
         `,
    });
    return response.message.content.toString();
  }
  async queryAgent(checkid: string, checkresultid: string) {
    console.log(
      `querying agent with checkid:${checkid} and checkresultid:${checkresultid}`,
    );
    const response = await this.agent.chat({
      message: `
         A Check is a monitoring script that tests a website or API endpoint(s).
         you are a developer debugging a failed Playwright script of a monitoring check. 
         Here are the checkid:${checkid} and checkresultid:${checkresultid} of a run.
         Start with planning your tool use. Review your plan at least once before starting to call tools.
         Do NOT be conversational, just provide the facts.
         Once you have a good plan you can start explaining these steps:
         Summary of logs: [Summarize relevant parts of the logs] 
         Script Analysis: [Could the script have caused the failure?]
         Final root cause: [Explain the failure based on your log summary and script analysis]
         Suggested fix: [Suggest a fix based on the root cause]
         Finally provide the output as a JSON object using this template:
         {"log_summary":your log summary,
         "script_analysis":your script analysis,
         "root_cause": your root cause,
         "suggested_fix":your suggested fix
         }
         `,
    });
    //console.log(response.metadata);
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
