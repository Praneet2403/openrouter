import { t } from "elysia";

const companySchema = t.Object({
  id: t.String(),
  name: t.String(),
  website: t.String(),
});

const providerSchema = t.Object({
  id: t.String(),
  name: t.String(),
  website: t.String(),
});

const modelSchema = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
  companyId: t.String(),
  company: companySchema,
});

/** Provider + mapping costs for a single model (GET /models/:modelId/providers). */
const modelProviderLinkSchema = t.Object({
  mappingId: t.String(),
  inputTokenCost: t.Number(),
  outputTokenCost: t.Number(),
  provider: providerSchema,
});

export namespace ModelsModel {
  export const listModelsResponseSchema = t.Object({
    models: t.Array(modelSchema),
  });
  export type ListModelsResponseSchema = typeof listModelsResponseSchema.static;

  export const listProvidersResponseSchema = t.Object({
    providers: t.Array(providerSchema),
  });
  export type ListProvidersResponseSchema =
    typeof listProvidersResponseSchema.static;

  export const modelProvidersParamsSchema = t.Object({
    modelId: t.String(),
  });
  export type ModelProvidersParamsSchema =
    typeof modelProvidersParamsSchema.static;

  export const modelProvidersResponseSchema = t.Object({
    providers: t.Array(modelProviderLinkSchema),
  });
  export type ModelProvidersResponseSchema =
    typeof modelProvidersResponseSchema.static;

  export const modelNotFoundSchema = t.Object({
    message: t.Literal("Model not found"),
  });
  export type ModelNotFoundSchema = typeof modelNotFoundSchema.static;

  export const invalidModelIdSchema = t.Object({
    message: t.Literal("Invalid model id"),
  });
  export type InvalidModelIdSchema = typeof invalidModelIdSchema.static;
}
