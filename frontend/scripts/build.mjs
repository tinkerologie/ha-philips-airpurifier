import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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

// HACS ships this directory, so retain the runtime dependency's license terms.
await writeFile(
  new URL("THIRD_PARTY_LICENSES.txt", outdir),
  "Bundled runtime: lit, lit-html and @lit/reactive-element\n\n" +
    (await readFile(new URL("../node_modules/lit/LICENSE", import.meta.url), "utf8"))
);
