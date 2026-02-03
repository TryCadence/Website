# Integrations

Cadence integrates with your development workflow through webhooks for Git platforms and agent skills for AI assistants.

## Integration Methods

### 1. Webhook Server

Run Cadence as a long-running webhook server to automatically analyze repositories when code is pushed.

**Best for:**
- Continuous monitoring of repositories
- CI/CD pipeline integration
- Automated analysis on every push
- GitHub, GitLab, Gitea, or custom Git platforms

**Setup:** [Webhook Server Guide](/docs/integrations/webhooks)

### 2. Agent Skills

Integrate Cadence with AI coding assistants and automation tools via the skills.sh ecosystem.

**Best for:**
- AI assistants (Claude, ChatGPT)
- Custom automation workflows
- Programmatic integration
- On-demand analysis

**Setup:** [Agent Skills Guide](/docs/integrations/agent-skills)

## How Cadence Handles Integrations

### Webhook Integration Architecture

```
Push Event
    ↓
Git Platform (GitHub/GitLab)
    ↓
Cadence Webhook Server (POST /webhooks/github or /webhooks/gitlab)
    ↓
Signature Verification (HMAC-SHA256)
    ↓
Job Queue (up to configurable workers)
    ↓
Analysis Processing
    ↓
Job Status Tracking
    ↓
Results Available via GET /jobs/:id
```

### Webhook Server Capabilities

- **Platform Support** - GitHub and GitLab push events
- **Signature Verification** - HMAC-SHA256 signature validation
- **Job Queue** - Configurable concurrent workers (default: 4)
- **Status Tracking** - Track analysis job status and results
- **Health Checks** - GET /health endpoint for monitoring
- **CORS Support** - Cross-origin request handling

### Agent Skills Implementation

Cadence exposes detection capabilities through `skills.json` following the skills.sh specification:

- **analyze-repository** - Full repository analysis for AI-generated commits
- **detect-suspicious-commit** - Single commit analysis
- Compatible with Claude, ChatGPT, and custom agents

## Quick Setup

### Webhook Server (5 minutes)

```bash
# Create configuration
cadence config init

# Start webhook server on port 8080
cadence webhook --port 8080 --secret "your-webhook-secret"

# In GitHub repo settings → Webhooks:
# - Payload URL: https://your-domain.com/webhooks/github
# - Content type: application/json
# - Secret: your-webhook-secret
# - Events: Push events
```

### Agent Skills (1 minute)

```bash
# Download skills.json
curl -o skills.json https://raw.githubusercontent.com/TryCadence/Cadence/main/skills.json

# Use with AI assistant
# "Analyze this repository: https://github.com/owner/repo"
```

## Webhook Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhooks/github` | POST | Receive GitHub push events |
| `/webhooks/gitlab` | POST | Receive GitLab push events |
| `/jobs/:id` | GET | Get analysis job status and results |
| `/jobs` | GET | List recent analysis jobs |
| `/health` | GET | Health check endpoint |

## Configuration

### Webhook Server Settings

```yaml
webhook:
  host: "0.0.0.0"           # Bind address
  port: 3000                # Server port
  secret: "your-secret"     # HMAC secret for signature verification
  max_workers: 4            # Concurrent analysis workers
  read_timeout: 30          # Request timeout (seconds)
  write_timeout: 30         # Response timeout (seconds)
```

### Threshold Configuration

Webhooks use the same detection thresholds as CLI analysis. Configure in `.cadence.yaml`:

```yaml
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100
  max_deletions_per_min: 500
  min_time_delta_seconds: 60
```

## Job Processing

### Job Lifecycle

1. **Webhook Received** - Platform sends push event
2. **Signature Verified** - HMAC-SHA256 validation ensures authenticity
3. **Job Queued** - Added to job queue with status `pending`
4. **Processing** - Worker analyzes repository, status `processing`
5. **Completed** - Results available, status `completed` or `failed`
6. **Retrieved** - Get results via GET /jobs/:id endpoint

### Job Status

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo": "owner/repo",
  "branch": "main",
  "timestamp": "2026-02-02T10:30:00Z",
  "error": null,
  "result": {
    "total_commits": 10,
    "suspicious_commits": 2,
    "suspicions": [
      {
        "commit_hash": "abc1234",
        "confidence": 0.85,
        "reasons": ["velocity", "timing"]
      }
    ]
  }
}
```

**Status Values:**
- `pending` - Job queued, waiting to start
- `processing` - Analysis in progress
- `completed` - Analysis finished, results available
- `failed` - Analysis error, check `error` field

## Security Considerations

### Signature Verification

Cadence verifies webhook signatures using HMAC-SHA256:

```
Signature header: X-Hub-Signature-256: sha256=<hmac>
Verified against: HMAC_SHA256(secret, body)
```

This ensures webhooks come from the expected platform.

### Best Practices

1. **Use HTTPS** - Always use HTTPS in production (reverse proxy recommended)
2. **Strong Secrets** - Generate cryptographically random webhook secrets
3. **Network Security** - Restrict webhook endpoint access if possible
4. **Rate Limiting** - Consider rate limiting at reverse proxy level
5. **Monitoring** - Monitor webhook endpoint for unusual activity

### Production Deployment

For production, use a reverse proxy (nginx, Caddy) for:

- HTTPS termination
- Load balancing
- Rate limiting
- Request logging

Example nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name cadence.example.com;
    
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Next Steps

- [Webhook Server Guide](/docs/integrations/webhooks) - Complete webhook setup
- [Agent Skills Guide](/docs/integrations/agent-skills) - AI assistant integration
- [CLI Commands](/docs/cli/commands) - Webhook command reference
