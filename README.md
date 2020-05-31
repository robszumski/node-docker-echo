# node-docker-echo

Track CPU and RAM as submitted and recorded as GET parameters.

## Run with Kubernetes

###
```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: echo
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: echo
        type: 'web'
      annotations:
        scheduler.alpha.kubernetes.io/affinity: >
          {
            "nodeAffinity": {
              "requiredDuringSchedulingIgnoredDuringExecution": {
                "nodeSelectorTerms": [
                  {
                    "matchExpressions": [
                      {
                        "key": "master",
                        "operator": "DoesNotExist"
                      }
                    ]
                  }
                ]
              }
            }
          }
    spec:
      containers:
      - name: echo
        image: quay.io/robszumski/echo-server:latest
        ports: 
        - containerPort: 3000
          name: web
          protocol: TCP
        readinessProbe:
         httpGet:
           path: /
           port: 3000
           scheme: HTTP
        livenessProbe:
         initialDelaySeconds: 10
         timeoutSeconds: 1
         httpGet:
           path: /
           port: 3000
           scheme: HTTP
        imagePullPolicy: Always
```

### Write Values
```sh
curl http://example.com/path?cpu=100&ram=12345
```

### Read Values

```json
{
  "cpu":"100%",
  "ram":"12345.00"
}
```
