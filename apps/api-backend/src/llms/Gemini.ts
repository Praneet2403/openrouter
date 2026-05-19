import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./base";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

export class Gemini extends BaseLlm {
    static async chat(model : string ,messages: Messages): Promise<LlmResponse> {
        const response = await ai.models.generateContent({
            model: model,
            contents: messages.map(message => ({
                text: message.content,
                role: message.role
            }))
        });
        

        return {
            outputTokenConsumed : response.usageMetadata?.candidatesTokenCount!,
            inputTokenConsumed : response.usageMetadata?.promptTokenCount!,
            completions: {
                choices: [{
                    message: {
                        content: response.text!
                    }
                }]
            }
        }
    }
}