import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function disableTanstackRouteCodeSplitter(): Plugin {
  return {
    name: "app:disable-tanstack-route-code-splitter",
    enforce: "post",
    configResolved(config) {
      config.plugins = config.plugins.filter(
        (plugin) => !plugin.name.startsWith("tanstack-router:code-splitter:"),
      );
    },
  };
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    disableTanstackRouteCodeSplitter(),
    react(),
    tailwindcss(),
  ],
});
