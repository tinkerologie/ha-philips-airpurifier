import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";
export default {
  files: "test/**/*.test.ts",
  // Test the production build of Lit, as shipped in the bundle.
  nodeResolve: { exportConditions: ["production"] },
  plugins: [esbuildPlugin({ ts: true, target: "es2022" })],
  browsers: [playwrightLauncher({ product: "chromium" })],
};
