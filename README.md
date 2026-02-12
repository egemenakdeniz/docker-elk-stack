# 📊 ELK Stack with Filebeat & Metricbeat (Docker on macOS)

This project sets up a full **ELK Observability Stack** using Docker:

- **Elasticsearch** → Stores logs & metrics  
- **Logstash** → Processes incoming logs  
- **Kibana** → Visualization UI  
- **Filebeat** → Collects container logs  
- **Metricbeat** → Collects Docker & host metrics  

---

## Start the Stack

Run:

```bash
docker compose up -d
```

Check services:

```bash
docker ps
```
----
## Test Logging

Run a test container:

```bash
docker run --rm --name test-logger alpine sh -c 'i=0; while true; do echo "APP hello $i"; sleep 1; done'
```

Filebeat will detect logs `automatically.`