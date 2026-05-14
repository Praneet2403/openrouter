import Elysia from "elysia";
import { ModelsModel } from "./models";
import { ModelsService } from "./service";

export const app = new Elysia({ prefix: "models" })
  .get(
    "/",
    async () => {
      const models = await ModelsService.listModels();
      return { models };
    },
    {
      response: {
        200: ModelsModel.listModelsResponseSchema,
      },
    },
  )
  .get(
    "/providers",
    async () => {
      const providers = await ModelsService.listProviders();
      return { providers };
    },
    {
      response: {
        200: ModelsModel.listProvidersResponseSchema,
      },
    },
  )
  .get(
    "/:modelId/providers",
    async ({ params: { modelId }, status }) => {
      const id = Number(modelId);
      if (!Number.isFinite(id) || !Number.isInteger(id) || id < 1) {
        return status(400, { message: "Invalid model id" as const });
      }

      const providers = await ModelsService.listProvidersForModel(id);
      if (providers === null) {
        return status(404, { message: "Model not found" as const });
      }

      return { providers };
    },
    {
      params: ModelsModel.modelProvidersParamsSchema,
      response: {
        200: ModelsModel.modelProvidersResponseSchema,
        400: ModelsModel.invalidModelIdSchema,
        404: ModelsModel.modelNotFoundSchema,
      },
    },
  );
