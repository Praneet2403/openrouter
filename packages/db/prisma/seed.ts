import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // --- Companies ---
  const google = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Google", website: "https://ai.google.dev" },
  });

  const openai = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: { name: "OpenAI", website: "https://openai.com" },
  });

  const anthropic = await prisma.company.upsert({
    where: { id: 3 },
    update: {},
    create: { name: "Anthropic", website: "https://anthropic.com" },
  });

  console.log("✅ Companies created");

  // --- Providers ---
  const googleProvider = await prisma.provider.upsert({
    where: { name: "Google AI" },
    update: {},
    create: { name: "Google AI", website: "https://ai.google.dev" },
  });

  const openaiProvider = await prisma.provider.upsert({
    where: { name: "OpenAI" },
    update: {},
    create: { name: "OpenAI", website: "https://openai.com" },
  });

  const anthropicProvider = await prisma.provider.upsert({
    where: { name: "Anthropic" },
    update: {},
    create: { name: "Anthropic", website: "https://anthropic.com" },
  });

  console.log("✅ Providers created");

  // --- Models ---
  const models = [
    // Google models
    { name: "Gemini 2.0 Flash", slug: "google/gemini-2.0-flash", companyId: google.id },
    { name: "Gemini 2.5 Pro", slug: "google/gemini-2.5-pro", companyId: google.id },
    { name: "Gemini 2.5 Flash", slug: "google/gemini-2.5-flash", companyId: google.id },
    // OpenAI models
    { name: "GPT-4o", slug: "openAi/gpt-4o", companyId: openai.id },
    { name: "GPT-4o Mini", slug: "openAi/gpt-4o-mini", companyId: openai.id },
    { name: "GPT-4.1", slug: "openAi/gpt-4.1", companyId: openai.id },
    { name: "GPT-4.1 Mini", slug: "openAi/gpt-4.1-mini", companyId: openai.id },
    // Anthropic models
    { name: "Claude Sonnet 4", slug: "anthropic/claude-sonnet-4-20250514", companyId: anthropic.id },
    { name: "Claude Haiku 3.5", slug: "anthropic/claude-3-5-haiku-20241022", companyId: anthropic.id },
    { name: "Claude Opus 4", slug: "anthropic/claude-opus-4-20250514", companyId: anthropic.id },
  ];

  const createdModels: Array<{ id: number; slug: string; companyId: number }> = [];

  for (const model of models) {
    // Check if model already exists by slug
    const existing = await prisma.model.findFirst({ where: { slug: model.slug } });
    if (existing) {
      createdModels.push(existing);
      continue;
    }
    const created = await prisma.model.create({ data: model });
    createdModels.push(created);
  }

  console.log(`✅ ${createdModels.length} models created`);

  // --- Model-Provider Mappings ---
  // Map each model to its provider with token costs (in microcents per token)
  const mappings: Array<{
    modelSlug: string;
    providerName: string;
    inputTokenCost: number;
    outputTokenCost: number;
  }> = [
    // Google models via Google AI
    { modelSlug: "google/gemini-2.0-flash", providerName: "Google AI", inputTokenCost: 1, outputTokenCost: 4 },
    { modelSlug: "google/gemini-2.5-pro", providerName: "Google AI", inputTokenCost: 13, outputTokenCost: 50 },
    { modelSlug: "google/gemini-2.5-flash", providerName: "Google AI", inputTokenCost: 2, outputTokenCost: 8 },
    // OpenAI models via OpenAI
    { modelSlug: "openAi/gpt-4o", providerName: "OpenAI", inputTokenCost: 25, outputTokenCost: 100 },
    { modelSlug: "openAi/gpt-4o-mini", providerName: "OpenAI", inputTokenCost: 2, outputTokenCost: 6 },
    { modelSlug: "openAi/gpt-4.1", providerName: "OpenAI", inputTokenCost: 20, outputTokenCost: 80 },
    { modelSlug: "openAi/gpt-4.1-mini", providerName: "OpenAI", inputTokenCost: 4, outputTokenCost: 16 },
    // Anthropic models via Anthropic
    { modelSlug: "anthropic/claude-sonnet-4-20250514", providerName: "Anthropic", inputTokenCost: 30, outputTokenCost: 150 },
    { modelSlug: "anthropic/claude-3-5-haiku-20241022", providerName: "Anthropic", inputTokenCost: 8, outputTokenCost: 40 },
    { modelSlug: "anthropic/claude-opus-4-20250514", providerName: "Anthropic", inputTokenCost: 150, outputTokenCost: 750 },
  ];

  let mappingCount = 0;
  for (const mapping of mappings) {
    const model = createdModels.find((m) => m.slug === mapping.modelSlug);
    const provider =
      mapping.providerName === "Google AI"
        ? googleProvider
        : mapping.providerName === "OpenAI"
          ? openaiProvider
          : anthropicProvider;

    if (!model) continue;

    // Check if mapping already exists
    const existing = await prisma.modelProviderMapping.findFirst({
      where: { modelId: model.id, providerId: provider.id },
    });
    if (existing) continue;

    await prisma.modelProviderMapping.create({
      data: {
        modelId: model.id,
        providerId: provider.id,
        inputTokenCost: mapping.inputTokenCost,
        outputTokenCost: mapping.outputTokenCost,
      },
    });
    mappingCount++;
  }

  console.log(`✅ ${mappingCount} model-provider mappings created`);
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
