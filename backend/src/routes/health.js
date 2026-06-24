import { sendJson } from "../utils/http.js";

export function routeHealth(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  sendJson(response, 200, {
    status: "ok",
    service: "tectigon-backend",
    timestamp: new Date().toISOString(),
  });
}
