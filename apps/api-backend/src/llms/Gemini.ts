import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";
import { GoogleGenAI } from "@google/genai";

// created on first use so a missing key only breaks Gemini requests, not the whole API
let ai: GoogleGenAI | undefined;
const getClient = () => ai ??= new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export class Gemini extends BaseLlm {
    static async chat(model : string ,messages: Messages): Promise<LlmResponse> {
        const response = await getClient().models.generateContent({
            model: model,
            contents: messages.map(message => {
                return {
                    role: message.role === "assistant" ? "model" : message.role,
                    parts: [{ text: message.content }]
                }
            })
        });
        

        return {
            outputTokenConsumed : response.usageMetadata?.candidatesTokenCount ?? 0,
            inputTokenConsumed : response.usageMetadata?.promptTokenCount ?? 0,
            completions: {
                choices: [{
                    message: {
                        content: response.text ?? ""
                    }
                }]
            }
        }
    }
}