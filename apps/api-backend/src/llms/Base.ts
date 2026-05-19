import { Messages } from "../types";

export type LlmResponse = {
    completions : {
        choices : {

            message : {
                content : string
            }
        }[]
    },
    inputTokenConsumed : number,
    outputTokenConsumed : number,
    
}

export class BaseLlm {
         static async chat(model : string , messages : Messages) : Promise<LlmResponse> {
            throw new Error("not implemented chat function");
         }
}