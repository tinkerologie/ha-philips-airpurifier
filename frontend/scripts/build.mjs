import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
const outdir = new URL("../../custom_components/philips_airpurifier/frontend/", import.meta.url);
const result = await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  legalComments: "inline",
  write: false,
});
await mkdir(outdir, { recursive: true });
await writeFile(new URL("philips-airpurifier-cards.js", outdir), result.outputFiles[0].text.trimEnd() + "\n");
