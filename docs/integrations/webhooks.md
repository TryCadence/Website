# Webhook Server

Run Cadence as a webhook server to automatically analyze repositories when code is pushed to GitHub, GitLab, or other Git platforms.

## Overview

The Cadence webhook server:

- Receives push events from Git platforms
- Verifies webhook signatures (HMAC-SHA256)
- Queues analysis jobs with configurable worker count
- Processes jobs asynchronously
- Stores results for status tracking

## Quick Start

### 1. Create Configuration

```bash
cadence config init
```

This creates `.cadence.yaml` with webhook settings.

### 2. Start the Server

```bash
cadence webhook --port 8080 --secret "your-webhook-secret"
```

The server starts on `http://0.0.0.0:8080` (or specified port).

### 3. Configure Webhook in GitHub

1. Go to Repository → Settings → Webhooks
2. Click "Add webhook"
3. Set:
   - **Payload URL**: `https://your-domain.com/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Same as `--secret` above
   - **Events**: Select "Push events"
4. Click "Add webhook"

## Configuration

### Command-Line Flags

```bash
cadence webhook \
  --port 8080 \
  --host 0.0.0.0 \
  --secret "webhook-secret" \
  --workers 4 \
  --read-timeout 60 \
  --write-timeout 60 \
  --config cadence.yaml
```

**Flags:**

- `--port int` - Server port (default: 3000)
- `--host string` - Bind address (default: 0.0.0.0)
- `--secret string` - Webhook HMAC secret (required)
- `--workers int` - Concurrent analysis workers (default: 4)
- `--read-timeout int` - Request read timeout in seconds (default: 30)
- `--write-timeout int` - Request write timeout in seconds (default: 30)
- `--config string` - Configuration file path

### Configuration File

Add to `.cadence.yaml`:

```yaml
webhook:
  host: "0.0.0.0"
  port: 3000
  secret: "your-webhook-secret"
  max_workers: 4
  read_timeout: 30
  write_timeout: 30

# Detection thresholds (same as CLI analysis)
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100
  max_deletions_per_min: 500
  min_time_delta_seconds: 60

exclude_files:
  - package-lock.json
  - yarn.lock
```

### Environment Variables

Override configuration with environment variables:

```bash
export CADENCE_WEBHOOK_PORT=8080
export CADENCE_WEBHOOK_SECRET="webhook-secret"
export CADENCE_WEBHOOK_WORKERS=8
```

## API Endpoints

### POST /webhooks/github

Receive GitHub push events.

**Headers (sent by GitHub):**
```
X-Hub-Signature-256: sha256=<hmac_signature>
Content-Type: application/json
```

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

**Payload Example:**
GitHub automatically sends push event data when configured. Cadence extracts:
- Repository name and URL
- Branch
- Commits (hash, message, author, files changed)
- Pusher information

### POST /webhooks/gitlab

Receive GitLab push events.

**Headers (sent by GitLab):**
```
X-Gitlab-Token: <your_secret_token>
Content-Type: application/json
```

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "pending"
}
```

### GET /jobs/:id

Get analysis job status and results.

**Parameters:**
- `id` - Job UUID returned from webhook POST

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo": "owner/repo",
  "branch": "main",
  "timestamp": "2026-02-02T10:30:00Z",
  "error": null,
  "result": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "repo_name": "owner/repo",
    "total_commits": 5,
    "suspicious_commits": 2,
    "suspicions": [
      {
        "commit_hash": "abc1234",
        "message": "Velocity anomaly detected",
        "severity": "high",
        "reasons": ["High velocity", "Large commit"],
        "score": 0.85
      }
    ],
    "analyzed_at": "2026-02-02T10:30:15Z"
  }
}
```

**Status Values:**
- `pending` - Job queued, analysis not started
- `processing` - Analysis in progress
- `completed` - Analysis finished successfully
- `failed` - Analysis error (see `error` field)

### GET /jobs

List recent analysis jobs.

**Query Parameters:**
- `limit=10` - Maximum number of jobs to return (default: 10)

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "repo": "owner/repo",
    "branch": "main",
    "timestamp": "2026-02-02T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "processing",
    "repo": "owner/repo2",
    "branch": "develop",
    "timestamp": "2026-02-02T10:25:00Z"
  }
]
```

### GET /health

Health check endpoint.

**Response (200 OK):**
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

## Webhook Event Flow

### GitHub Push Event

```
1. Developer pushes to repository
   ↓
2. GitHub sends POST to /webhooks/github
   - Includes X-Hub-Signature-256 header
   - Body contains push event payload
   ↓
3. Cadence verifies signature
   - Computes HMAC-SHA256 of body
   - Compares with header signature
   ↓
4. If signature valid:
   - Extracts repository, branch, commits
   - Creates WebhookJob
   - Adds to job queue
   - Returns job_id with status "pending"
   ↓
5. Worker pool processes job:
   - Clones repository
   - Runs detection analysis
   - Stores results
   - Updates job status to "completed"
   ↓
6. Client polls GET /jobs/:id to get results
```

## Job Queue Processing

### Worker Pool

Cadence uses a configurable worker pool:

- **Default workers**: 4 concurrent analysis processes
- **Configurable**: `--workers` flag or `max_workers` in config
- **Queue size**: 100 pending jobs buffered

### Processing

Each job:

1. **Waiting** - Queued with status `pending`
2. **Processing** - Assigned to worker, status `processing`
3. **Analysis** - Runs detection analysis on commits
4. **Complete** - Status updated to `completed` with results or `failed` with error

### Timeout

Each job has a 5-minute timeout. If analysis exceeds 5 minutes, the job fails with error.

## Signature Verification

### How It Works

Cadence verifies webhook authenticity using HMAC-SHA256:

1. **GitHub sends**: `X-Hub-Signature-256: sha256=<hmac>`
2. **Cadence computes**: `HMAC_SHA256(secret, request_body)`
3. **Verification**: Computed signature must match header signature

### Security

This ensures:
- Webhook comes from the expected platform
- Request body hasn't been tampered with
- Secret is known only to your server and platform

### Example Verification

```go
// What Cadence does internally
signature := c.Get("X-Hub-Signature-256")  // From header
body := c.Body()                            // Request body
secret := "your-webhook-secret"

// Compute HMAC
h := hmac.New(sha256.New, []byte(secret))
h.Write(body)
computed := "sha256=" + hex.EncodeToString(h.Sum(nil))

// Verify
if !hmac.Equal([]byte(signature), []byte(computed)) {
  // Reject - signature mismatch
}
```

## Webhook Integration Setup

### GitHub

**Step 1: Start Cadence**
```bash
cadence webhook --port 8080 --secret "my-secret-key"
```

**Step 2: Configure Webhook**
- Go to Repo → Settings → Webhooks → Add webhook
- Payload URL: `https://your-server.com/webhooks/github`
- Secret: `my-secret-key`
- Content type: `application/json`
- Events: `Push events`

**Step 3: Test**
```bash
# Push code to trigger webhook
git push origin main

# Check job status
curl https://your-server.com/jobs
```

### GitLab

**Step 1: Start Cadence**
```bash
cadence webhook --port 8080 --secret "my-secret-key"
```

**Step 2: Configure Webhook**
- Go to Project → Settings → Webhooks
- URL: `https://your-server.com/webhooks/gitlab`
- Secret token: `my-secret-key`
- Trigger: `Push events`

**Step 3: Test**
Same as GitHub - push to trigger webhook.

## Monitoring and Debugging

### Check Server Status

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "time": "2026-02-02T10:30:00Z"
}
```

### List Recent Jobs

```bash
curl http://localhost:3000/jobs?limit=20
```

### Get Job Details

```bash
curl http://localhost:3000/jobs/550e8400-e29b-41d4-a716-446655440000
```

### View Server Logs

The server logs all requests and processing steps:

```
2026-02-02 10:30:00 [info] POST /webhooks/github
2026-02-02 10:30:00 [info] Webhook verified: owner/repo
2026-02-02 10:30:00 [info] Job queued: 550e8400-e29b-41d4-a716-446655440000
2026-02-02 10:30:02 [info] Job processing: 550e8400-e29b-41d4-a716-446655440000
2026-02-02 10:30:15 [info] Job completed: 550e8400-e29b-41d4-a716-446655440000
```

## Troubleshooting

### Webhook Not Triggering

1. **Check server is running**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Verify webhook in platform**
   - GitHub: Repo → Settings → Webhooks (check for deliveries)
   - GitLab: Project → Settings → Webhooks (check logs)

3. **Check network access**
   - Ensure your server is publicly accessible
   - Verify firewall allows incoming connections
   - Check reverse proxy configuration

### Signature Verification Failed

1. **Verify secrets match**
   - Check webhook secret in platform
   - Verify `--secret` flag matches

2. **Check secret format**
   - Should be string without special formatting
   - No quotes or extra spaces

### Analysis Taking Too Long

1. **Increase workers**
   ```bash
   cadence webhook --workers 8 --secret "secret"
   ```

2. **Check job timeout**
   - Default: 5 minutes per job
   - Jobs exceeding timeout will fail

3. **Monitor queue**
   ```bash
   curl http://localhost:3000/jobs?limit=100
   ```

## Production Deployment

### Using Reverse Proxy (Recommended)

Use nginx, Caddy, or similar for:

- HTTPS termination
- Load balancing
- Rate limiting
- Request logging

**Example nginx config:**

```nginx
server {
    listen 443 ssl http2;
    server_name cadence.example.com;
    
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Using systemd (Linux)

Create `/etc/systemd/system/cadence-webhook.service`:

```ini
[Unit]
Description=Cadence Webhook Server
After=network.target

[Service]
Type=simple
User=cadence
ExecStart=/usr/local/bin/cadence webhook --config /etc/cadence/config.yaml
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable cadence-webhook
sudo systemctl start cadence-webhook
```

## Next Steps

- [Agent Skills](/docs/integrations/agent-skills) - AI assistant integration
- [CLI Commands](/docs/cli/commands) - Webhook command reference
- [Configuration](/docs/getting-started/configuration) - Advanced settings
