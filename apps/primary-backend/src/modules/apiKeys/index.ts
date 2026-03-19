import jwt from "@elysiajs/jwt";
import Elysia from "elysia";


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
    .post("/" , ({userId , body}) => {

    })
    // to get all api keys
    .get("/" , ()=> {

    })
    // if user wants to disable any api key
    .post("/disable" , ()=> {

    })
    //if user wants to delete their api key
    .delete("/:id" , () => {

    })