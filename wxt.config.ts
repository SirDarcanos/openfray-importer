import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  // Visible build dir (default is the hidden ".output").
  outDir: "output",
  manifest: {
    permissions: ["storage"],
    name: "OpenFray Importer",
  },
  runner: {
    startUrls: ["https://www.dndbeyond.com/monsters"],
  },
  vite: (env) => {
    return {
      build: {
        minify: env.mode === "production",
      },
    };
  },
});
