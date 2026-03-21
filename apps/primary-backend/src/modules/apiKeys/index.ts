import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { ApiKeyModel } from "./models";
import { ApiKeyService } from "./service";


//prefix is written so that we dont have to write it everytime we define a route

export const app = new Elysia({prefix : "api-keys"})
    //to use jwt for authentication
    //jwt secret is used to sign and verify the jwt token
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        })
    )

    //to verify if the user is authenticated or not
    //if the user is authenticated then we return the user id such that we can use it in remaining route handlers
    .resolve(async ({cookie : {auth} , status , jwt}) => {
        if(!auth) {
            return status(401);
        }
        const decoded = await jwt.verify(auth.value as string);
        if(!decoded || !decoded.userId) {
            return status(401);
        }

        return {
            userId : decoded.userId as string
        }

    })
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
    .delete("/:id" , () => {

    })