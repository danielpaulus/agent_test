https://openwebui.com/

## Random thoughts
- an agent is just some code building up a long prompt using some format like "use the following format to tell me which tool you want: [TOOL_REQUEST]:[TOOL_NAME] or similar"
- multiagent system just means one agent can use other agents as tools, with some orchestration agent
- agents could generate their own tools and run in a sandbox

- agent reasoning patterns
 - reflection "reflect on the output you justgave"
 - tool use
 - planning "plan steps, think more slowly, explain your reasoning step by step, forces to think through"
 - multi agent

 "Chat tokens: As chat LLMs rose to popularity in 2023, the conversational nature of LLMs started to be a leading use case. Tokenizers have been adapted to this direction by the addition of tokens that indicate the turns in a conversation and the roles of each speaker. These special tokens include:
            <|user|>
            <|assistant|>
            <|system|>"
- tokenization hat einen einfluss auf context size, three length tokens== mehr text per token windows als one length

Choosing the highest scoring token every time is called greedy decoding. It’s what happens if you set the temperature parameter to zero in an LLM.


## Hosting
llmstudio
groq

## Frameworks
https://superagi.com/
https://microsoft.github.io/autogen/

crewai, autogen

## Blogs
https://supabase.com/blog/chatgpt-supabase-docs
https://www.promptingguide.ai/guides/optimizing-prompts

- these examples explain how this works really well: https://microsoft.github.io/autogen/0.2/docs/notebooks/agentchat_webscraping_with_apify

- vector search explained/using clickhouse for vector search https://clickhouse.com/blog/vector-search-clickhouse-p1

- https://www.youtube.com/@matthew_berman
- agents explained: https://www.youtube.com/watch?v=ZYf9V2fSFwU


## Papers
- Autogen: https://arxiv.org/pdf/2308.08155

## Architecture - How to build?
https://microsoft.github.io/autogen/0.2/docs/Use-Cases/agent_chat/

# mistral 
- https://docs.mistral.ai/guides/prompting_capabilities/

## Interesting Github Projects
- Multiagent system: https://github.com/geekan/MetaGPT
- https://aider.chat/ code assistant https://github.com/Aider-AI/aider
- Agent Coder https://github.com/huangd1999/AgentCoder
https://github.com/All-Hands-AI/OpenHands
https://github.com/princeton-nlp/SWE-agent/tree/main

- https://github.com/Doriandarko/claude-engineer simple code

## link collections
 - https://github.com/e2b-dev/awesome-ai-agents
 - https://www.aixploria.com/en/category/ai-autonomous/
 https://aitoolfor.org/categories/agents/
https://github.com/mem0ai/mem0
 RAG


 ## context
 - other status pages, provider info

 # misc
 - go here to create slack app: https://api.slack.com/apps

 # new stuff
 https://github.com/microsoft/BitNet