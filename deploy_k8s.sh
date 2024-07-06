#!/bin/bash

# 기존 서비스 중지 및 삭제
kubectl delete deployment elasticsearch express kibana logstash rabbitmq redis python-worker filebeat
kubectl delete service elasticsearch express kibana logstash rabbitmq redis python-worker
kubectl delete hpa python-worker-hpa
kubectl delete configmap elasticsearch-config logstash-config filebeat-config
kubectl delete clusterrolebinding filebeat
kubectl delete clusterrole filebeat
kubectl delete serviceaccount filebeat
kubectl delete secret rabbitmq-erlang-cookie

# Secret 생성
kubectl create secret generic rabbitmq-erlang-cookie --from-literal=erlang-cookie=$(openssl rand -base64 32)

# ConfigMap 적용
kubectl apply -f k8s/elasticsearch/configmap.yaml
kubectl apply -f k8s/logstash/configmap.yaml
kubectl apply -f k8s/filebeat/configmap.yaml
kubectl apply -f k8s/kibana/configmap.yaml

# 배포 및 서비스 설정 적용
kubectl apply -f k8s/elasticsearch/deployment.yaml
kubectl apply -f k8s/elasticsearch/service.yaml

kubectl apply -f k8s/express/deployment.yaml
kubectl apply -f k8s/express/service.yaml

kubectl apply -f k8s/kibana/deployment.yaml
kubectl apply -f k8s/kibana/service.yaml

kubectl apply -f k8s/logstash/deployment.yaml
kubectl apply -f k8s/logstash/service.yaml

kubectl apply -f k8s/rabbitmq/deployment.yaml
kubectl apply -f k8s/rabbitmq/service.yaml

kubectl apply -f k8s/redis/deployment.yaml
kubectl apply -f k8s/redis/service.yaml

kubectl apply -f k8s/python-worker/deployment.yaml
kubectl apply -f k8s/python-worker/service.yaml
kubectl apply -f k8s/python-worker/hpa.yaml

# RBAC 설정 적용
kubectl apply -f k8s/filebeat/rbac.yaml

# Filebeat 배포
kubectl apply -f k8s/filebeat/deployment.yaml

echo "All Kubernetes resources have been successfully applied."
