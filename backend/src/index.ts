import { createServer } from "http";
import app from "./app";
import env from "./config/env";
import { logger } from "./utils/logger";

logger.info("Booting server…");

const server = createServer(app);
server.listen(env.PORT, () => {
  logger.info(`API listening on http://localhost:${env.PORT}`);
});
