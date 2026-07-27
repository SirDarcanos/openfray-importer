import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  // Visible build dir (default is the hidden ".output").
  outDir: "output",
  manifest: ({ browser }) => ({
    permissions: ["storage"],
    name: "OpenFray Importer",
    // AMO requires both keys on a Firefox submission: a stable add-on id, and an
    // explicit data-collection declaration. The extension reads the page you're on and
    // converts it locally — nothing is transmitted or stored off-device — so the
    // declaration is "none". `data_collection_permissions` is newer than WXT's manifest
    // types, hence the cast.
    ...(browser === "firefox"
      ? {
          browser_specific_settings: {
            gecko: {
              id: "info@openfray.app",
              data_collection_permissions: { required: ["none"] },
            },
          } as any,
        }
      : {}),
  }),
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
