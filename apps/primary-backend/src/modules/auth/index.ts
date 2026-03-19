import { Elysia  , status} from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "auth" })

    .use(
      jwt({
        name: "auth",
        secret: process.env.JWT_SECRET!,
      })
    )


  .post(
    "/sign-up",
    async ({ body , status}) => {

      try{

        const userId = await AuthService.signup(body.email, body.password);
        return { id: userId };
      } catch (err) {
        return status (400 , {
          message : "Error while signing up"
        })
      }

    },
    {
      body: AuthModel.signupSchema,
      response: {
        200: AuthModel.signupResponseSchema,
        400: AuthModel.signupFailedResponseSchema,
      },
    },
  )
  .post(
    "/sign-in",
    async ({ jwt , body , status, cookie : {auth}}) => {
      const {correctCredentials , userId} = await AuthService.signin(body.email, body.password);
      if(correctCredentials && userId) {

        const value =  await jwt.sign({
          id: userId,
        })
        auth.set({
          value: userId,
          httpOnly: true,
          maxAge: 886400 * 7,
        })
        return { message : "Signed in successfully" };
      } else {
        return status(403, {
          message : "Invalid credentials"
        })

      }
    },
    {
      body: AuthModel.signinSchema,
      response: {
        200: AuthModel.signinResponseSchema,
        400: AuthModel.signinFailureSchema,
      },
    },
  );
