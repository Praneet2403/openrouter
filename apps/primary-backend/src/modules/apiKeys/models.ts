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
    export const updateApiKeySchema = t.Object({
        id : t.String(),
        disabled : t.Boolean()
    })
    export type updateApiKeySchema = typeof updateApiKeySchema.static




    //response schema for disabling an api key
    export const updateApiKeyResponseSchema = t.Object({
        message : t.Literal("updated api key sucessfully")
    })
    export type updateApiKeyResponseSchema = typeof updateApiKeyResponseSchema.static



    export const updateApiKeyResponseFailedSchema = t.Object({
        message : t.Literal("updating api key unsuccessful")
    })
    export type updateApiKeyResponseFailedSchema = typeof updateApiKeyResponseFailedSchema.static



    //response schema for getting all api keys
    export const getApiKeyResponseSchema = t.Object({
        apiKeys: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            apiKey: t.String(),
            lastUsed: t.Nullable(t.Date()),
            creditsConsumed : t.Number(),
        }))
        
    })
    export type getApiKeyResponseSchema = typeof getApiKeyResponseSchema.static



    //response schema for deleting an api key
    export const deleteApiKeyResponseSchema = t.Object({
        message : t.Literal("api key deleted successfully")
    })
    export type deleteApiKeyResponseSchema = typeof deleteApiKeyResponseSchema.static




    export const deleteApiKeyResponseFailedSchema = t.Object({
        message : t.Literal("deleting api key unsuccessful")
    })
    export type deleteApiKeyResponseFailedSchema = typeof deleteApiKeyResponseFailedSchema.static
    
    
}