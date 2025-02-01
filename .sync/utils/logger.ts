// .sync/utils/logger.ts
import winston from "winston";

// Configure the shared logger
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
