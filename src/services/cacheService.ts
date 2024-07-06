import Redis from "ioredis";
import config from "../config/config";

class CacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis.url);
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, "EX", ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async updateCache(
    key: string,
    newValue: string,
    ttl?: number,
  ): Promise<void> {
    await this.set(key, newValue, ttl);
  }
}

export default CacheService;
