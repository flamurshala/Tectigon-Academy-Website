import { createServer } from "node:http";

import { createApp } from "./app.js";
import { config } from "./config.js";

const server = createServer(createApp());

server.listen(config.port, () => {
  console.log(`Tectigon backend listening on http://localhost:${config.port}`);
});
