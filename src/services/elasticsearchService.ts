import { Client } from "@elastic/elasticsearch";
import config from "../config/config";

class ElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({ node: config.elasticsearch.url });
  }

  public async indexData(index: string, data: any): Promise<void> {
    try {
      await this.client.index({
        index,
        body: data,
      });
      await this.client.indices.refresh({ index });
    } catch (error) {
      console.error(`Error indexing data to ${index}:`, error);
      throw new Error("Failed to index data");
    }
  }

  public async search(index: string, query: any): Promise<any> {
    try {
      const result = await this.client.search({
        index,
        body: query,
      });
      return result.body.hits.hits;
    } catch (error) {
      console.error(`Error searching in ${index}:`, error);
      throw new Error("Failed to search data");
    }
  }
}

export default ElasticsearchService;
