import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";
import OpenAI from "openai";

// created on first use so a missing key only breaks OpenAI requests, not the whole API
let client: OpenAI | undefined;
const getClient = () => client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAi extends BaseLlm {
    static async chat(model: string, messages: Messages): Promise<LlmResponse> {
        const response = await getClient().responses.create({
            model: model,
            input: messages.map(message => ({
                role: message.role,
                content: message.content
            }))
        });

        return {
            inputTokenConsumed: response.usage?.input_tokens ?? 0,
            outputTokenConsumed: response.usage?.output_tokens ?? 0,
            completions: {
                choices: [{
                    message: {
                        content: response.output_text
                    }
                }]
            }
        }
    }
}