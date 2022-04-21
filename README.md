```
eval $(minikube docker-env)
docker build -t deno-health .
helm install prometheus prometheus-community/kube-prometheus-stack
kubectl apply -f k8s.yaml

kubectl port-forward service/prometheus-kube-prometheus-prometheus 9090:9090

# forward service and individual pods
kubectl port-forward service/deno-health 8000:8000
kubectl port-forward deno-health-5dbcd97f5-9dmmh 8001:8000
kubectl port-forward deno-health-5dbcd97f5-qzvtw 8002:8000

# mark second pod as unhealth
curl localhost:8002/health -v -X POST -d '503'
```
