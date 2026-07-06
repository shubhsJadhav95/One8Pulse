# Istio Configuration for One8Pulse

This directory contains Istio configuration files for the One8Pulse application.

## Prerequisites

- Istio installed on your Kubernetes cluster
- EKS cluster with Istio enabled

## Configuration Files

### 1. Gateway (`gateway.yaml`)
Defines the entry point for external traffic into the mesh.

**Features:**
- HTTP (port 80) and HTTPS (port 443) listeners
- Hosts: `api.one8pulse.devcloudzone.store` and `one8pulse.devcloudzone.store`
- TLS termination with certificate

### 2. VirtualService (`virtualservice.yaml`)
Defines routing rules for traffic entering through the gateway.

**Features:**
- Routes `/api/*` paths to the Spring Cloud Gateway
- Routes all other paths to the Spring Cloud Gateway
- Connected to the one8pulse-gateway

### 3. DestinationRule (`destinationrule.yaml`)
Defines policies for traffic to the gateway service.

**Features:**
- Round-robin load balancing
- Connection pool settings (max 100 connections)
- HTTP settings (max 50 pending requests)
- Circuit breaker with outlier detection

## Installation

### Step 1: Install Istio on EKS (if not already installed)

```bash
# Download Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*

# Install Istio
istioctl install --set profile=default -y

# Enable automatic sidecar injection
kubectl label namespace one8pulse istio-injection=enabled
```

### Step 2: Create TLS Certificate Secret

```bash
# Create Kubernetes secret for TLS certificate
kubectl create secret tls one8pulse-tls-cert \
  --cert=path/to/cert.crt \
  --key=path/to/cert.key \
  -n one8pulse
```

### Step 3: Apply Istio Configurations

```bash
# Apply all Istio configurations
kubectl apply -f k8s/istio/gateway.yaml
kubectl apply -f k8s/istio/virtualservice.yaml
kubectl apply -f k8s/istio/destinationrule.yaml
```

### Step 4: Verify Installation

```bash
# Check gateway status
kubectl get gateway -n one8pulse

# Check virtualservice status
kubectl get virtualservice -n one8pulse

# Check destinationrule status
kubectl get destinationrule -n one8pulse

# Check Istio proxy status
kubectl get pods -n one8pulse -o wide
```

## Architecture

```
External Traffic → Istio Gateway → VirtualService → Spring Cloud Gateway → Microservices
                     (Port 80/443)           (Routing Rules)       (Port 8080)      (Internal)
```

## Traffic Flow

1. **External Request**: User accesses `https://api.one8pulse.devcloudzone.store/api/...`
2. **Istio Gateway**: Receives traffic on port 443, terminates TLS
3. **VirtualService**: Routes traffic based on path patterns
4. **Spring Cloud Gateway**: Receives traffic, routes to appropriate microservice
5. **Microservices**: Process the request and return response

## Monitoring and Observability

### View Istio Dashboard

```bash
# Install Kiali for observability
istioctl dashboard kiali
```

### View Traffic

```bash
# Install Istio addons (prometheus, grafana, kiali)
kubectl apply -f samples/addons

# Access dashboards
istioctl dashboard grafana
istioctl dashboard prometheus
istioctl dashboard kiali
```

## Troubleshooting

### Gateway Not Working

```bash
# Check gateway logs
kubectl logs -n istio-system deployment/istio-ingressgateway

# Check gateway status
kubectl describe gateway one8pulse-gateway -n one8pulse
```

### VirtualService Not Routing

```bash
# Check virtualservice status
kubectl describe virtualservice one8pulse-virtualservice -n one8pulse

# Check istio-proxy logs
kubectl logs <pod-name> -n one8pulse -c istio-proxy
```

### Connection Issues

```bash
# Check istio sidecar injection
kubectl get pod <pod-name> -n one8pulse -o jsonpath='{.spec.containers[*].name}'

# Verify sidecar is running
kubectl logs <pod-name> -n one8pulse -c istio-proxy
```

## Migration from ALB Ingress

If you're migrating from AWS ALB Ingress to Istio:

1. **Keep ALB for now**: Use Istio alongside ALB during migration
2. **Update DNS**: Point `api.one8pulse.devcloudzone.store` to Istio LoadBalancer
3. **Remove ALB**: Once Istio is stable, remove ALB resources
4. **Clean up**: Remove ALB ingress resources from Kubernetes

## Security Features

- **mTLS**: Mutual TLS between services (enabled by default)
- **TLS Termination**: At Istio Gateway
- **CORS**: Handled by Spring Cloud Gateway
- **JWT Validation**: Handled by Spring Cloud Gateway

## Performance Tuning

Adjust connection pool settings in `destinationrule.yaml` based on your traffic:

```yaml
connectionPool:
  tcp:
    maxConnections: 100  # Increase for high traffic
  http:
    http1MaxPendingRequests: 50  # Increase for high traffic
```

## Cleanup

To remove Istio configurations:

```bash
kubectl delete -f k8s/istio/destinationrule.yaml
kubectl delete -f k8s/istio/virtualservice.yaml
kubectl delete -f k8s/istio/gateway.yaml
```

To remove Istio from namespace:

```bash
kubectl label namespace one8pulse istio-injection-
```
