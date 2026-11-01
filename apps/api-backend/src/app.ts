import bearer from "@elysiajs/bearer";
import { prisma } from "../../../packages/db"
import { Elysia } from "elysia";
import { Conversation } from "./types";
import { Gemini } from "./llms/Gemini";
import { OpenAi } from "./llms/OpenAi";
import { Claude } from "./llms/Claude";
import { BaseLlm, LlmResponse } from "./llms/Base";

// keyed by Provider.name in the db
const PROVIDER_ADAPTERS: Record<string, typeof BaseLlm> = {
  "Google AI": Gemini,
  "OpenAI": OpenAi,
  "Anthropic": Claude,
};

export const app = new Elysia()
.use(bearer())
.post("/api/v1/chat/completions", async ({ status , bearer : apiKey, body }) => {
    const model = body.model;

    if(!apiKey) {
      return status(401, {
        message : "Missing API Key. Provide it via Authorization: Bearer <key>"
      })
    }

    const apiKeyDb = await prisma.apiKey.findFirst({
      where : {
        apiKey,
        disabled : false,
        deleted : false
      },
      select : {
        id : true,
        user : {
          select : { id : true, credits : true }
        }
      }
    })
    if(!apiKeyDb) {
      return status(401, {
        message : "Invalid API Key"
      })
    }

    if(apiKeyDb.user.credits <= 0){
      return status(402, {
        message : "Insufficient credits"
      })
    }

    const modelDb = await prisma.model.findFirst({
      where : {
        slug :model
      },
      include : {
        modelProviderMapping : {
          include : { provider : true }
        }
      }
    })
    if(!modelDb) {
      return status(404, {
        message : "Model not found"
      })
    }

    const mapping = modelDb.modelProviderMapping.find(m => PROVIDER_ADAPTERS[m.provider.name]);
    if(!mapping) {
      return status(404, {
        message : "No provider available for this model"
      })
    }

    // "google/gemini-2.5-pro" -> "gemini-2.5-pro"
    const providerModelName = model.slice(model.indexOf("/") + 1);

    let response : LlmResponse;
    try {
      response = await PROVIDER_ADAPTERS[mapping.provider.name]!.chat(providerModelName, body.messages);
    } catch (e) {
      console.error(`${mapping.provider.name} request failed for ${model}:`, e);
      return status(502, {
        message : "Upstream provider request failed"
      })
    }

    const creditsUsed =
      response.inputTokenConsumed * mapping.inputTokenCost +
      response.outputTokenConsumed * mapping.outputTokenCost;

    // charge the user, update the key's usage and log the conversation atomically
    await prisma.$transaction([
      prisma.user.update({
        where : { id : apiKeyDb.user.id },
        data : { credits : { decrement : creditsUsed } }
      }),
      prisma.apiKey.update({
        where : { id : apiKeyDb.id },
        data : {
          creditsConsumed : { increment : creditsUsed },
          lastUsed : new Date()
        }
      }),
      prisma.conversation.create({
        data : {
          userId : apiKeyDb.user.id,
          apiKeyId : apiKeyDb.id,
          modelProviderMappingId : mapping.id,
          input : JSON.stringify(body.messages),
          output : response.completions.choices.map(choice => choice.message.content).join(""),
          inputTokenCount : response.inputTokenConsumed,
          outputTokenCount : response.outputTokenConsumed
        }
      })
    ]);

    return response;
}, {
    body: Conversation
});
