import { t } from "elysia";

export namespace PaymentsModel {
  export const onrampResponseSchema = t.Object({
    credits: t.Number(),
    message: t.Literal("Credited successfully"),
  });
  export type OnrampResponseSchema = typeof onrampResponseSchema.static;

  export const onrampFailedSchema = t.Object({
    message: t.Literal("Onramp failed"),
  });
  export type OnrampFailedSchema = typeof onrampFailedSchema.static;
}
