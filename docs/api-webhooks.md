---
title: API & Webhook Server
description: Deploy Cadence as a webhook server for continuous repository monitoring
---

# API & Webhook Server

Cadence can run as a webhook server to automatically analyze repositories when push events occur. This enables continuous monitoring and integration with platforms like GitHub, GitLab, and custom Git hosting solutions.

## Quick Start

### Start the Webhook Server

```bash
# Generate config with webhook settings
cadence config init

# Edit webhook configuration
vim .cadence.yaml

# Start the server
cadence webhook --config .cadence.yaml
```

The server starts on `http://0.0.0.0:3000` by default.

## Configuration

### Webhook Settings

Add webhook configuration to `.cadence.yaml`:

```yaml
webhook:
  enabled: true
  host: "0.0.0.0"          # Bind to all interfaces
  port: 3000                # Server port
  secret: "your-webhook-secret-key-here"  # HMAC secret for signature verification
  max_workers: 4            # Concurrent analysis workers
  read_timeout: 30          # Request read timeout (seconds)
  write_timeout: 30         # Response write timeout (seconds)
```

### Security Best Practices

- **Always use HTTPS** in production (use a reverse proxy like nginx or Caddy)
- **Generate strong secrets**: Use cryptographically random strings for `webhook.secret`
- **Limit origins**: Configure CORS settings appropriately
- **Rate limiting**: Consider adding rate limiting at the reverse proxy level

### Command-Line Flags

Override configuration with CLI flags:

```bash
cadence webhook \
  --config .cadence.yaml \
  --port 8000 \
  --secret "my-webhook-secret" \
  --workers 8 \
  --read-timeout 60 \
  --write-timeout 60
```

## API Endpoints

### Health Check

Check if the server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "time": "2026-02-02T10:30:00Z"
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

---

### GitHub Webhook

Receive push events from GitHub repositories.

**Endpoint:** `POST /webhooks/github`

**Headers:**
```
X-Hub-Signature-256: sha256=<hmac_signature>
Content-Type: application/json
```

**Request Body:** GitHub push event payload (automatically sent by GitHub)

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

**Example Setup:**

1. Go to your GitHub repository → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/webhooks/github`
3. Set content type: `application/json`
4. Set secret: Your configured `webhook.secret`
5. Select event: "Just the push event"
6. Save webhook

---

### GitLab Webhook

Receive push events from GitLab repositories.

**Endpoint:** `POST /webhooks/gitlab`

**Headers:**
```
X-Gitlab-Token: <your_secret_token>
Content-Type: application/json
```

**Request Body:** GitLab push event payload

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "pending"
}
```

**Example Setup:**

1. Go to your GitLab project → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/webhooks/gitlab`
3. Set secret token: Your configured `webhook.secret`
4. Select trigger: "Push events"
5. Save webhook

---

### Get Job Status

Retrieve the status and results of a specific analysis job.

**Endpoint:** `GET /jobs/:id`

**Path Parameters:**
- `id` - Job UUID returned from webhook

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo": "username/repository",
  "branch": "main",
  "timestamp": "2026-02-02T10:30:00Z",
  "error": null,
  "result": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "repo_name": "username/repository",
    "total_commits": 5,
    "suspicious_commits": 2,
    "suspicions": [
      {
        "commit_hash": "abc1234",
        "confidence": 0.85,
        "reasons": ["High velocity", "Large additions"],
        "severity": "high"
      }
    ],
    "analyzed_at": "2026-02-02T10:30:15Z"
  }
}
```

**Job Statuses:**
- `pending` - Job queued, not yet started
- `processing` - Analysis in progress
- `completed` - Analysis finished successfully
- `failed` - Analysis encountered an error

**Example:**
```bash
curl http://localhost:3000/jobs/550e8400-e29b-41d4-a716-446655440000
```

---

### List Jobs

Get a list of recent analysis jobs.

**Endpoint:** `GET /jobs`

**Query Parameters:**
- `limit` (optional) - Maximum number of jobs to return (default: 50, max: 100)

**Response (200 OK):**
```json
{
  "total": 10,
  "jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "repo": "username/repository",
      "branch": "main",
      "timestamp": "2026-02-02T10:30:00Z",
      "author": "John Doe"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "status": "processing",
      "repo": "username/another-repo",
      "branch": "develop",
      "timestamp": "2026-02-02T10:32:00Z",
      "author": "Jane Smith"
    }
  ]
}
```

**Example:**
```bash
# Get last 20 jobs
curl http://localhost:3000/jobs?limit=20
```

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY . .
RUN go build -o cadence ./cmd/cadence

FROM alpine:latest
RUN apk --no-cache add ca-certificates git
COPY --from=builder /app/cadence /usr/local/bin/
COPY .cadence.yaml /etc/cadence/.cadence.yaml

EXPOSE 3000
CMD ["cadence", "webhook", "--config", "/etc/cadence/.cadence.yaml"]
```

Build and run:
```bash
docker build -t cadence-webhook .
docker run -p 3000:3000 \
  -e CADENCE_AI_KEY="your-api-key" \
  cadence-webhook
```

### systemd Service

Create `/etc/systemd/system/cadence-webhook.service`:

```ini
[Unit]
Description=Cadence AI Detection Webhook Server
After=network.target

[Service]
Type=simple
User=cadence
WorkingDirectory=/opt/cadence
ExecStart=/usr/local/bin/cadence webhook --config /opt/cadence/.cadence.yaml
Restart=on-failure
RestartSec=10
Environment=CADENCE_AI_KEY=your-api-key

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable cadence-webhook
sudo systemctl start cadence-webhook
sudo systemctl status cadence-webhook
```

### nginx Reverse Proxy

Configure nginx to proxy requests with HTTPS:

```nginx
server {
    listen 443 ssl http2;
    server_name cadence.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Cloudflare Workers / Serverless

For serverless deployments, use the CLI with cron triggers or edge functions:

```javascript
// Example Cloudflare Worker
export default {
  async scheduled(event, env, ctx) {
    // Trigger Cadence analysis on schedule
    const response = await fetch('https://api.github.com/repos/user/repo/commits')
    const commits = await response.json()
    
    // Process with Cadence
    for (const commit of commits) {
      await analyzeCommit(commit)
    }
  }
}
```

## Integration Patterns

### CI/CD Pipeline Integration

#### GitHub Actions

```yaml
name: Cadence AI Detection

on:
  push:
    branches: [main, develop]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Analyze commits
        run: |
          curl -X POST https://cadence.yourdomain.com/webhooks/github \
            -H "Content-Type: application/json" \
            -H "X-Hub-Signature-256: sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)" \
            -d "$PAYLOAD"
        env:
          SECRET: ${{ secrets.WEBHOOK_SECRET }}
          PAYLOAD: ${{ toJson(github.event) }}
```

#### GitLab CI

```yaml
stages:
  - analyze

ai-detection:
  stage: analyze
  script:
    - |
      curl -X POST https://cadence.yourdomain.com/webhooks/gitlab \
        -H "X-Gitlab-Token: $WEBHOOK_SECRET" \
        -H "Content-Type: application/json" \
        -d "$CI_PIPELINE_SOURCE"
  only:
    - main
    - develop
```

### Slack Notifications

Poll job status and send Slack notifications:

```bash
#!/bin/bash

JOB_ID=$1
STATUS_URL="http://localhost:3000/jobs/$JOB_ID"

# Poll until job completes
while true; do
  RESULT=$(curl -s $STATUS_URL)
  STATUS=$(echo $RESULT | jq -r '.status')
  
  if [ "$STATUS" = "completed" ]; then
    SUSPICIOUS=$(echo $RESULT | jq '.result.suspicious_commits')
    
    # Send Slack notification
    curl -X POST $SLACK_WEBHOOK_URL \
      -H 'Content-Type: application/json' \
      -d "{\"text\": \"Cadence detected $SUSPICIOUS suspicious commits\"}"
    break
  fi
  
  sleep 5
done
```

### Custom Dashboard

Build a dashboard to monitor analysis results:

```typescript
import { useEffect, useState } from 'react'

function Dashboard() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/jobs?limit=50')
      .then(res => res.json())
      .then(data => setJobs(data.jobs))
  }, [])

  return (
    <div>
      <h1>Cadence Analysis Dashboard</h1>
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.repo}</h3>
          <p>Status: {job.status}</p>
          <p>Branch: {job.branch}</p>
        </div>
      ))}
    </div>
  )
}
```

## Monitoring & Logging

### Health Checks

Set up monitoring with periodic health checks:

```bash
# Using curl
*/5 * * * * curl -f http://localhost:3000/health || alert_team

# Using uptime monitoring service
# Point to: https://cadence.yourdomain.com/health
```

### Log Analysis

Cadence webhook server logs to stdout. Configure log collection:

```bash
# Using journalctl
journalctl -u cadence-webhook -f

# Using Docker
docker logs -f cadence-webhook

# Export to file
cadence webhook --config config.yaml 2>&1 | tee cadence.log
```

### Metrics Collection

Monitor key metrics:
- Request rate (webhooks received/sec)
- Processing time (analysis duration)
- Queue depth (pending jobs)
- Success/failure rate

## Troubleshooting

### Webhook not receiving events

1. **Check firewall**: Ensure port 3000 (or your configured port) is open
2. **Verify secret**: Webhook secret must match in both Cadence config and GitHub/GitLab
3. **Check logs**: Look for signature verification errors
4. **Test connectivity**: Use `curl` to send a test request

```bash
# Test webhook manually
curl -X POST http://localhost:3000/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=test" \
  -d '{"repository": {"name": "test"}}'
```

### Signature verification failed

Ensure your webhook secret matches:

```bash
# GitHub signature format
echo -n '{"test": "data"}' | openssl dgst -sha256 -hmac "your-secret"
```

### Jobs stuck in "pending"

Check worker configuration:

```yaml
webhook:
  max_workers: 4  # Increase if you have many concurrent requests
```

Restart the server to clear stuck jobs.

### High memory usage

Reduce concurrent workers or add rate limiting:

```yaml
webhook:
  max_workers: 2  # Reduce concurrent processing
```

## Security Considerations

### Authentication

- **Webhook secret**: Always verify HMAC signatures
- **API tokens**: Consider adding Bearer token authentication for `/jobs` endpoints
- **IP whitelisting**: Restrict webhook endpoints to known IPs (GitHub, GitLab)

### Rate Limiting

Add rate limiting in your reverse proxy:

```nginx
# nginx rate limiting
limit_req_zone $binary_remote_addr zone=cadence:10m rate=10r/s;

location /webhooks {
    limit_req zone=cadence burst=20;
    proxy_pass http://localhost:3000;
}
```

### Data Privacy

- **Don't log sensitive data**: Avoid logging commit contents or secrets
- **Secure storage**: Store analysis results securely if persisting
- **GDPR compliance**: Ensure compliance if analyzing public contributor data

## Next Steps

- [Agent Skills Integration](/docs/agent-skills) - Use Cadence as an AI agent skill
- [Detection Strategies](/docs/detection-strategies) - Understand what Cadence detects
- [Advanced Configuration](/docs/advanced-configuration) - Fine-tune detection thresholds
- [Contributing Guide](/docs/contributing) - Help improve Cadence
