import bearer from "@elysiajs/bearer";
import { prisma } from "db"
import { Elysia, t } from "elysia";
import { Conversation } from "./types";
import { Gemini } from "./llms/Gemini";
import { OpenAi } from "./llms/OpenAi";
import { Claude } from "./llms/Claude";
const app = new Elysia()
.use(bearer())
.post("/api/v1/chat/completions", async ({ status , bearer : apiKey, body }) => {
    const model = body.model;
    const [companyName,ProviderModelName] = model.split("/");

    const apiKeyDb = await prisma.apiKey.findFirst({
      where : {
        apiKey,
        disabled : false,
        deleted : false
      },
      select : {
        user : true 
        
      }
    })
    if(!apiKeyDb) {
      return status(403, {
        message : "Invalid API Key"
      })
    }

    if(apiKeyDb?.user.credits <= 0){
      return status(403, {
        message : "Insufficient credits"
      }) 
    }
    const modelDb = await prisma.model.findFirst({
      where : {
        slug :model
      }
    })
    if(!modelDb) {
      return status(403, {
        message : "Model not found"
      })
    }

    const providers  = await prisma.modelProviderMapping.findMany({
      where : {
        modelId : modelDb.id
      }
    })
    
    
    if(companyName === "google") {

      const response = await Gemini.chat(ProviderModelName, body.messages);
      return response;
    }
    if(companyName === "openAi") {
      const response = await OpenAi.chat(ProviderModelName, body.messages);
      return response;
    }
    if(companyName === "anthropic"){
      const response = await Claude.chat(ProviderModelName, body.messages);
      return response;
    }

    throw new Error("Invalid model name")
}, {
    body: Conversation
}).listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);