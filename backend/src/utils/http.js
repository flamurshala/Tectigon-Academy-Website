import { config } from "../config.js";

export function getRequestOrigin(request) {
  const host = request.headers.host || `localhost:${config.port}`;
  return `http://${host}`;
}

export function sendJson(response, statusCode, body) {
  const payload = JSON.stringify(body);

  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  response.end(payload);
}
