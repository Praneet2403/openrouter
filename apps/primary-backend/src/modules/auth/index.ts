import { Elysia } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./service";
import { clerkAuth } from "./clerk";

//sign-up and sign-in happen in Clerk on the frontend; this module only serves
//data about the signed-in user
export const app = new Elysia({ prefix: "auth" })
    .use(clerkAuth)

    .get("/profile" ,async ({userId, status}) => {
      const userData = await AuthService.getUserDetails(Number(userId));
      if(!userData) {
        return status(400 , {
          message : "Error while fetching profile"
        })
      }
      return userData;

    }, {
      response : {
        200: AuthModel.profileResponseSchema,
        400: AuthModel.profileResponsErroreSchema
      }
    })
