import { prisma } from "db";

export abstract class ModelsService {
  static async listModels() {
    const rows = await prisma.model.findMany({
      include: {
        company: true,
      },
      orderBy: [{ company: { name: "asc" } }, { name: "asc" }],
    });

    return rows.map((m) => ({
      id: m.id.toString(),
      name: m.name,
      slug: m.slug,
      companyId: m.companyId.toString(),
      company: {
        id: m.company.id.toString(),
        name: m.company.name,
        website: m.company.website,
      },
    }));
  }

  static async listProviders() {
    const rows = await prisma.provider.findMany({
      orderBy: { name: "asc" },
    });

    return rows.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      website: p.website,
    }));
  }

  /** Providers linked to one model, with per-mapping pricing. `null` if the model does not exist. */
  static async listProvidersForModel(modelId: number) {
    const model = await prisma.model.findUnique({
      where: { id: modelId },
      select: { id: true },
    });
    if (!model) {
      return null;
    }

    const rows = await prisma.modelProviderMapping.findMany({
      where: { modelId },
      include: { provider: true },
      orderBy: { provider: { name: "asc" } },
    });

    return rows.map((row) => ({
      mappingId: row.id.toString(),
      inputTokenCost: row.inputTokenCost,
      outputTokenCost: row.outputTokenCost,
      provider: {
        id: row.provider.id.toString(),
        name: row.provider.name,
        website: row.provider.website,
      },
    }));
  }
}
