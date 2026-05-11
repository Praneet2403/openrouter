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

  static async listModelProviderMappings() {
    const rows = await prisma.modelProviderMapping.findMany({
      include: {
        model: { include: { company: true } },
        provider: true,
      },
      orderBy: [{ modelId: "asc" }, { providerId: "asc" }],
    });

    return rows.map((row) => ({
      id: row.id.toString(),
      modelId: row.modelId.toString(),
      providerId: row.providerId.toString(),
      inputTokenCost: row.inputTokenCost,
      outputTokenCost: row.outputTokenCost,
      model: {
        id: row.model.id.toString(),
        name: row.model.name,
        slug: row.model.slug,
        companyId: row.model.companyId.toString(),
        company: {
          id: row.model.company.id.toString(),
          name: row.model.company.name,
          website: row.model.company.website,
        },
      },
      provider: {
        id: row.provider.id.toString(),
        name: row.provider.name,
        website: row.provider.website,
      },
    }));
  }
}
