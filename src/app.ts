import express from "express";
import dataRoutes from "./routes/dataRoutes";
import errorHandler from "./middlewares/errorHandler";
import QueueService from "./services/queueService";
import CacheService from "./services/cacheService";
import DataController from "./controllers/dataController";
import ElasticsearchService from "./services/elasticsearchService";
import LoggerService from "./services/loggerService";
import loggingMiddleware from "./middlewares/loggingMiddleware";

const app = express();

const queueService = new QueueService();
const cacheService = new CacheService();
const elasticsearchService = new ElasticsearchService();
const loggerService = new LoggerService();
const dataController = new DataController(
  queueService,
  cacheService,
  elasticsearchService,
);

app.use(express.json());
app.use(loggingMiddleware(loggerService));
app.use("/api", dataRoutes(dataController));
app.use(errorHandler);

export default app;
