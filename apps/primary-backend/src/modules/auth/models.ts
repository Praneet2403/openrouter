import { t } from "elysia";

export namespace AuthModel {
  export const signinSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type SigninSchema = typeof signinSchema.static;

  export const signinResponseSchema = t.Object({
    message: t.Literal("Signed in successfully"),
  });

  export type SigninResponseSchema = typeof signinResponseSchema.static;

  export const signinFailureSchema = t.Object({
    message: t.Literal("Invalid credentials"),
  });

    export type signinFailureSchema = typeof signinFailureSchema.static

  export const signupSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type SignupSchema = typeof signupSchema.static;

  export const signupResponseSchema = t.Object({
    id: t.String(),
  });

  export const signupFailedResponseSchema = t.Object({
    message: t.Literal("Error while signing up"),
  });
  export type SignupResponseSchema = typeof signupResponseSchema.static;

  export type signupFailedResponseSchema =
    typeof signupFailedResponseSchema.static;
}
