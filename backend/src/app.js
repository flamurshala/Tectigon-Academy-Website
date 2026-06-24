import { config } from "./config.js";
import { routeApi } from "./routes/index.js";
import { getRequestOrigin, sendJson } from "./utils/http.js";

export function createApp() {
  return async function app(request, response) {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    try {
      const handled = await routeApi(request, response);

      if (!handled) {
        sendJson(response, 404, {
          error: "Not found",
          path: new URL(request.url, getRequestOrigin(request)).pathname,
        });
      }
    } catch (error) {
      console.error(error);
      sendJson(response, 500, { error: "Internal server error" });
    }
  };
}

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", config.frontendUrl);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}
