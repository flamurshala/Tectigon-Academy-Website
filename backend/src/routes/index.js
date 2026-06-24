import { routeHealth } from "./health.js";
import { getRequestOrigin } from "../utils/http.js";

export async function routeApi(request, response) {
  const { pathname } = new URL(request.url, getRequestOrigin(request));

  if (pathname === "/api/health") {
    routeHealth(request, response);
    return true;
  }

  return false;
}
