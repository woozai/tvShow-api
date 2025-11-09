import { createServer } from "http";
import app from "./app";
import env from "./config/env";
import { logger } from "./utils/logger";

const server = createServer(app);
server.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT },
    `API listening on http://localhost:${env.PORT}`
  );
});
