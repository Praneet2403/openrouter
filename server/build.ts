// Bundles both backends into one self-contained file for the Vercel function.
// Vercel compiles api/ files one by one and traces imports, which misses
// workspace packages and the generated Prisma client; a bundle sidesteps that.
const result = await Bun.build({
  entrypoints: [`${import.meta.dir}/index.ts`],
  outdir: `${import.meta.dir}/dist`,
  target: "bun",
  define: { "process.env.NODE_ENV": '"production"' },
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
console.log(`Bundled API to ${result.outputs.map(o => o.path).join(", ")}`);
