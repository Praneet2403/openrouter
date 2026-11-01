import { t } from "elysia";

export namespace AuthModel {
  export const profileResponseSchema = t.Object({
    credits : t.Number(),
  })

  export const profileResponsErroreSchema = t.Object({
    message : t.Literal("Error while fetching profile")
  })

}
