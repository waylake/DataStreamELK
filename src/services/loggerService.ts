import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import config from "../config/config";

const logDir = "logs";

class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const jsonFormat = winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
    );

    this.logger = winston.createLogger({
      format: jsonFormat,
      transports: [
        new winstonDaily({
          level: "info",
          datePattern: "YYYY-MM-DD",
          dirname: logDir,
          filename: `%DATE%.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
        new winstonDaily({
          level: "warn",
          datePattern: "YYYY-MM-DD",
          dirname: `${logDir}/warn`,
          filename: `%DATE%.warn.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
        new winstonDaily({
          level: "error",
          datePattern: "YYYY-MM-DD",
          dirname: `${logDir}/error`,
          filename: `%DATE%.error.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.logger.on("error", (err) => {
      console.error("Logger error:", err);
    });

    if (config.env !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      );
    }
  }

  log(level: string, message: any, logType?: string) {
    let logMessage = message;
    if (typeof message === "object") {
      logMessage = JSON.stringify(message);
    }

    this.logger.log({
      level,
      message: logMessage,
      logType: logType,
    });
  }
}

export default LoggerService;
