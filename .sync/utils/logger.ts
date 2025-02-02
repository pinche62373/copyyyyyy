// .sync/utils/logger.ts
import winston from "winston";

/**
 * Configure the shared logger.
 *
 * To run in debug mode choose one of:
 * - export LOG_LEVEL=debug
 * - LOG_LEVEL=debug npx tsx script.ts
 */
const log = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.printf(({ level, message }) => {
        return `${level}: ${message}`;
      }),
    }),
  ],
});

// Export the configured logger
export default log;
