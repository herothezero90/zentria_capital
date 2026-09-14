import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Vite dev server does not serve public folder index.html for bare /admin URLs.
function adminIndexDevPlugin() {
  return {
    name: "admin-index-dev",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === "/admin" || req.url === "/admin/") {
          req.url = "/admin/index.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), adminIndexDevPlugin()],
  },
});
