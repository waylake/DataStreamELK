import { Request, Response, NextFunction } from "express";
import LoggerService from "../services/loggerService";

const loggingMiddleware = (logger: LoggerService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const logData = {
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      };
      logger.log("info", JSON.stringify(logData), "request");
    });
    next();
  };
};

export default loggingMiddleware;
