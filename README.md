```
# deploy prometheus stack
helm install prometheus prometheus-community/kube-prometheus-stack
kubectl port-forward service/prometheus-kube-prometheus-prometheus 9090:9090

# build and install example service
eval $(minikube docker-env)
docker build -t deno-health .
kubectl apply -f k8s.yaml


# forward service and individual pods
kubectl port-forward service/deno-health 8000:8000
kubectl port-forward deno-health-5dbcd97f5-9dmmh 8001:8000
kubectl port-forward deno-health-5dbcd97f5-qzvtw 8002:8000

# mark second pod as unhealthy
curl localhost:8002/health -v -X POST -d '503'
```
