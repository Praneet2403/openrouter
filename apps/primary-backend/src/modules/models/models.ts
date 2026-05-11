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

const mappingSchema = t.Object({
  id: t.String(),
  modelId: t.String(),
  providerId: t.String(),
  inputTokenCost: t.Number(),
  outputTokenCost: t.Number(),
  model: modelSchema,
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

  export const listMappingsResponseSchema = t.Object({
    mappings: t.Array(mappingSchema),
  });
  export type ListMappingsResponseSchema =
    typeof listMappingsResponseSchema.static;
}
