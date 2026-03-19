import { t } from "elysia";

export namespace ApiKeyModel {

    //schema for creating a new api key
    export const createApiKeySchema  = t.Object({
        name : t.String(),
    })
    export type createApiKeySchema = typeof createApiKeySchema.static





    //response schema for creating a new api key
    export const createApikeyResponse = t.Object( {
        id: t.String(),
        apiKey : t.String(),
    })
    export type createApikeyResponse = typeof createApikeyResponse.static





    //schema for disabling an api key
    export const disableApiKeySchema = t.Object({
        id : t.String(),
    })
    export type disableApiKeySchema = typeof disableApiKeySchema.static




    //response schema for disabling an api key
    export const disableApiKeyResponseSchema = t.Object({
        message : t.Literal("Disabled api key sucessfully")
    })
    export type disableApiKeyResponseSchema = typeof disableApiKeyResponseSchema.static



    //response schema for getting all api keys
    export const getApiKeyResponseSchema = t.Object({
        name: t.String(),
        apiKey: t.String(),
        lastUsed: t.String(),
        creditsConsumed : t.String(),
        
    })
    export type getApiKeyResponseSchema = typeof getApiKeyResponseSchema.static



    //response schema for deleting an api key
    export const deleteApiKeyResponseSchema = t.Object({
        message : t.Literal("api key deleted successfully")
    })
    export type deleteApiKeyResponseSchema = typeof deleteApiKeyResponseSchema.static
    
    
}