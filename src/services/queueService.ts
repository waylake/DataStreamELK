import amqp from "amqplib";
import config from "../config/config";

class QueueService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect() {
    this.connection = await amqp.connect(config.rabbitmq.url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(config.rabbitmq.queue, { durable: true });
  }

  public async addToQueue(data: any): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    this.channel!.sendToQueue(
      config.rabbitmq.queue,
      Buffer.from(JSON.stringify(data)),
    );
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

export default QueueService;
