eval $(minikube docker-env)
docker build -t deno-health .
helm install prometheus prometheus-community/kube-prometheus-stack
kubectl apply -f k8s.yaml
