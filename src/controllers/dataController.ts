import { Request, Response, NextFunction } from "express";
import QueueService from "../services/queueService";
import CacheService from "../services/cacheService";
import ElasticsearchService from "../services/elasticsearchService";

class DataController {
  private queueService: QueueService;
  private cacheService: CacheService;
  private elasticsearchService: ElasticsearchService;

  constructor(
    queueService: QueueService,
    cacheService: CacheService,
    elasticsearchService: ElasticsearchService,
  ) {
    this.queueService = queueService;
    this.cacheService = cacheService;
    this.elasticsearchService = elasticsearchService;
  }

  public requestDataCollection = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, date } = req.body;

      const cacheKey = `data:${userId}:${date}`;
      const cachedResult = await this.cacheService.get(cacheKey);

      if (cachedResult) {
        res.json({ data: JSON.parse(cachedResult), source: "cache" });
        return;
      }

      const query = {
        query: {
          bool: {
            must: [
              { match: { userId } },
              { range: { date: { gte: date, lte: date } } },
            ],
          },
        },
      };

      const searchResults = await this.elasticsearchService.search(
        "collected_data",
        query,
      );

      if (searchResults.length > 0) {
        const result = searchResults[0]._source;
        await this.cacheService.set(cacheKey, JSON.stringify(result), 3600); // Cache for 1 hour
        res.json({ data: result, source: "elasticsearch" });
      } else {
        await this.queueService.addToQueue({ userId, date });
        res.status(202).json({ message: "Data collection request queued" });
      }
    } catch (error) {
      next(error);
    }
  };

  public getDataStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const status = await this.cacheService.get(`status:${userId}`);
      res.json({ status: status || "pending" });
    } catch (error) {
      next(error);
    }
  };

  public getAllData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const results = await this.elasticsearchService.search("collected_data", {
        query: {
          match_all: {},
        },
      });
      res.json({ data: results });
    } catch (error) {
      next(error);
    }
  };
}

export default DataController;
