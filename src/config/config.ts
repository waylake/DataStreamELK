export default {
  port: process.env.EXPRESS_PORT || 3000,
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "amqp://localhost",
    queue: "data_collection",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  },
  logstash: {
    host: process.env.LOGSTASH_HOST || "localhost",
    port: process.env.LOGSTASH_PORT || 5044,
    nodeName: process.env.LOGSTASH_NODENAME || "LOG_NODE",
  },
  env: process.env.NODE_ENV || "development",
};
