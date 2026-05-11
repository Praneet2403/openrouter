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
    "/mappings",
    async () => {
      const mappings = await ModelsService.listModelProviderMappings();
      return { mappings };
    },
    {
      response: {
        200: ModelsModel.listMappingsResponseSchema,
      },
    },
  );
