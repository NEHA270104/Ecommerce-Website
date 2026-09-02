import type { Plugin } from "vite";
import { handleApiRequest } from "./apiMiddleware.ts";

export function apiServerPlugin(): Plugin {
  return {
    name: "vv-api-server",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    },
  };
}
