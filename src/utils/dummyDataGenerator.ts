import { Client } from "@elastic/elasticsearch";
import config from "../config/config";

const client = new Client({ node: config.elasticsearch.url });

const generateDummyData = async (count: number) => {
  const bulkBody = [];

  for (let i = 0; i < count; i++) {
    const userId = `user${Math.floor(Math.random() * 10) + 1}`;
    const date = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];
    const data = {
      userId,
      date,
      value: Math.random() * 100,
      category: ["A", "B", "C"][Math.floor(Math.random() * 3)],
    };

    bulkBody.push({ index: { _index: "collected_data" } });
    bulkBody.push(data);
  }

  await client.bulk({ body: bulkBody });
  console.log(`${count} dummy documents indexed`);
};

export default generateDummyData;
