import pika
import json
import redis
from elasticsearch import Elasticsearch

import os
import time

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
REDIS_URL = os.getenv("REDIS_URL")
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL")


# RabbitMQ connection with retry logic
def connect_to_rabbitmq():
    attempts = 0
    while attempts < 5:
        try:
            connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
            return connection
        except pika.exceptions.AMQPConnectionError:
            attempts += 1
            time.sleep(5)  # Wait 5 seconds before retrying
    raise Exception("Failed to connect to RabbitMQ after several attempts")


connection = connect_to_rabbitmq()
channel = connection.channel()
channel.queue_declare(queue="data_collection", durable=True)

# Redis connection
redis_client = redis.Redis.from_url(REDIS_URL)

# Elasticsearch connection
es = Elasticsearch([ELASTICSEARCH_URL])


def collect_data(data_params):
    # Implement your data collection logic here
    # This is a placeholder function
    return {"collected_data": "Sample data"}


def callback(ch, method, properties, body):
    data = json.loads(body)
    user_id = data["userId"]
    data_params = data.get("dataParams", {})

    # Update status
    redis_client.set(f"status:{user_id}", "processing")

    # Collect data
    result = collect_data(data_params)

    # Store result in Elasticsearch
    es.index(index="insertd_collected_data", id=user_id, body=result)

    # Cache result
    redis_client.set(user_id, json.dumps(result))

    # Update status
    redis_client.set(f"status:{user_id}", "completed")

    # Acknowledge message
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(queue="data_collection", on_message_callback=callback)

channel.start_consuming()
print("Worker Has been started")
