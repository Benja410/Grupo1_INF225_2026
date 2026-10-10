import { openai } from "@ai-sdk/openai";

async function client(){
    return openai("gpt-4o-mini")
}

export default client;
