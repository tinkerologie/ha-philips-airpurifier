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

// HACS ships this directory, so retain each runtime package's license terms.
const runtimeLicenses = await Promise.all(
  ["lit", "lit-html", "@lit/reactive-element"].map(
    async (name) => `${name}\n${await readFile(new URL(`../node_modules/${name}/LICENSE`, import.meta.url), "utf8")}`
  )
);
await writeFile(new URL("THIRD_PARTY_LICENSES.txt", outdir), runtimeLicenses.join("\n\n"));
