import Elysia from "elysia";
import { ApiKeyModel } from "./models";
import { ApiKeyService } from "./service";
import { clerkAuth } from "../auth/clerk";


//prefix is written so that we dont have to write it everytime we define a route

export const app = new Elysia({prefix : "api-keys"})
    //resolves the signed-in Clerk user to `userId` for the route handlers below
    .use(clerkAuth)
    //to create a new api key
    .post("/" , async ({userId , body}) => {
        const {apiKey , id} = await ApiKeyService.createApiKey(body.name , Number(userId));
        return {
            apiKey,
            id,
        }
    }, {
        body : ApiKeyModel.createApiKeySchema,
        response : {
            200 : ApiKeyModel.createApikeyResponse,
        }
    })
    // to get all api keyss
    .get("/" , async ({userId}) => {
        const apiKeys = await ApiKeyService.getApiKeys(Number(userId));
        return { apiKeys };
    }, {
        response : {
            200 : ApiKeyModel.getApiKeyResponseSchema,
        }
    })
    // if user wants to disable any api key
    .put("/" , async ({body , userId , status})=> {
        try{

            await ApiKeyService.updateApiKeyDisabled(Number(body.id) , Number(userId) , body.disabled);
            return {
                message : "updated api key sucessfully" as const
            }
        } catch (e) {
            return status(411,{
                message : "updating api key unsuccessful" as const
            })
        } 
    }, {
        body: ApiKeyModel.updateApiKeySchema,

        response : {
            200 : ApiKeyModel.updateApiKeyResponseSchema,
            411 : ApiKeyModel.updateApiKeyResponseFailedSchema
        }
    })
    //if user wants to delete their api key
    .delete("/:id" , async ({params : {id }, userId, status}) => {
        try { 

            await ApiKeyService.delete(Number(id), Number(userId));
            return {
                message : "api key deleted successfully" as const
            }
        } catch (e) {
            return status(411,{
                message : "deleting api key unsuccessful" as const
            })
        }

    }, {
        response : {
            200 : ApiKeyModel.deleteApiKeyResponseSchema,
            411 : ApiKeyModel.deleteApiKeyResponseFailedSchema
        }
    })