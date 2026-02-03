---
title: AI Examples
description: Practical examples using Cadence with OpenAI analysis
---

# AI Examples

Practical examples for using Cadence with OpenAI analysis.

## Basic Usage

### Simple Repository Analysis

```bash
# Set up API key
export CADENCE_AI_ENABLED=true
export CADENCE_AI_PROVIDER=openai
export CADENCE_AI_KEY=sk-proj-your-key-here

# Run analysis with AI
cadence analyze ./my-project -o report.txt
```

### Without AI

```bash
# Disable AI analysis
export CADENCE_AI_ENABLED=false
cadence analyze ./my-project -o report.txt
```

## Model Selection

### Use Default Model (gpt-4o-mini)

```bash
export CADENCE_AI_ENABLED=true
export CADENCE_AI_PROVIDER=openai
export CADENCE_AI_KEY=sk-proj-...

# Uses gpt-4o-mini by default
cadence analyze ./repo -o report.txt
```

### Use GPT-4 for Critical Code

```bash
export CADENCE_AI_KEY=sk-proj-...
export CADENCE_AI_MODEL=gpt-4

cadence analyze ./security-critical-code -o critical-report.txt
```

### Use GPT-4-turbo for Balanced Performance

```bash
export CADENCE_AI_KEY=sk-proj-...
export CADENCE_AI_MODEL=gpt-4-turbo

cadence analyze ./repo -o report.txt
```

## Output Formats

### JSON Report with AI Insights

```bash
export CADENCE_AI_ENABLED=true
export CADENCE_AI_KEY=sk-proj-...

cadence analyze ./repo -o report.json
```

Example output includes AI analysis:

```json
{
  "suspicious_commits": [
    {
      "hash": "abc123def",
      "author": "user@example.com",
      "timestamp": "2024-01-15T10:30:00Z",
      "additions": 450,
      "deletions": 50,
      "flagged_by": ["suspicious_additions"],
      "ai_analysis": {
        "assessment": "likely AI-generated",
        "confidence": 0.85,
        "reasoning": "Code shows multiple AI indicators",
        "indicators": ["generic_variable_names", "missing_error_handling"]
      }
    }
  ]
}
```

### Text Report

```bash
cadence analyze ./repo -o report.txt
```

Includes AI findings for each flagged commit.

## Multiple Repositories

### Batch Analysis

```bash
#!/bin/bash
export CADENCE_AI_ENABLED=true
export CADENCE_AI_KEY=sk-proj-...

repos=("repo1" "repo2" "repo3")

for repo in "${repos[@]}"; do
  echo "Analyzing $repo..."
  cadence analyze "./$repo" -o "report-$repo.json"
done
```

### Analyze Changed Files Only

```bash
# Use git to find recently modified repos
export CADENCE_AI_KEY=sk-proj-...

for repo in $(find . -maxdepth 2 -name ".git" -type d); do
  repo_dir=$(dirname "$repo")
  echo "Analyzing $repo_dir..."
  cadence analyze "$repo_dir" -o "report-$(basename $repo_dir).txt"
done
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Cadence AI Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  cadence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for analysis

      - name: Install Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      - name: Install Cadence
        run: go install github.com/TryCadence/Cadence/cmd/cadence@latest

      - name: Run Cadence Analysis
        env:
          CADENCE_AI_ENABLED: true
          CADENCE_AI_KEY: ${{ secrets.OPENAI_API_KEY }}
          CADENCE_AI_MODEL: gpt-4o-mini
        run: |
          cadence analyze . \
            --output report.json \
            --suspicious-additions 500 \
            --max-additions-pm 100

      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: cadence-report
          path: report.json

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('report.json', 'utf8'));
            const suspicious = report.suspicious_commits.length;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🔍 Cadence Analysis: Found ${suspicious} suspicious commits`
            });
```

### GitLab CI

```yaml
cadence_analysis:
  image: golang:1.21
  script:
    - go install github.com/TryCadence/Cadence/cmd/cadence@latest
    - cadence analyze ./src --output report.json
  artifacts:
    paths:
      - report.json
    expire_in: 30 days
  only:
    - merge_requests
    - main
  variables:
    CADENCE_AI_ENABLED: "true"
    CADENCE_AI_KEY: $OPENAI_API_KEY
```

## Webhook Integration

### With Cadence Webhook Server

```bash
# Start webhook server with AI enabled
export CADENCE_AI_ENABLED=true
export CADENCE_AI_KEY=sk-proj-...
export CADENCE_WEBHOOK_ENABLED=true
export CADENCE_WEBHOOK_PORT=3000

cadence webhook
```

The webhook will automatically use AI analysis for all received webhooks.

## Configuration Files

### cadence.yml with AI

```yaml
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100
  max_deletions_per_min: 500
  min_time_delta_seconds: 60

ai:
  enabled: true
  provider: openai
  api_key: "${CADENCE_AI_KEY}"
  model: gpt-4-turbo

webhook:
  enabled: true
  port: 3000
  secret: your-webhook-secret
```

### Run with Config File

```bash
export CADENCE_AI_KEY=sk-proj-...
cadence analyze ./repo -o report.json
```

Automatically loads `cadence.yml` from current directory.

## Cost-Effective Workflows

### Two-Tier Analysis

Combine models for efficiency:

```bash
#!/bin/bash
export CADENCE_AI_KEY=sk-proj-...

# Phase 1: Quick scan with cheaper model
echo "Phase 1: Quick scan..."
export CADENCE_AI_MODEL=gpt-4o-mini
cadence analyze ./repo --output quick-scan.json

# Phase 2: Deep dive on flagged areas with better model
echo "Phase 2: Deep analysis..."
export CADENCE_AI_MODEL=gpt-4
cadence analyze ./flagged-sections --output detailed-scan.json
```

### Disable AI for Known-Good Code

```bash
# Skip analysis on vendor/dependencies
export CADENCE_AI_ENABLED=false
cadence analyze ./node_modules -o report.txt

# Enable for source code
export CADENCE_AI_ENABLED=true
export CADENCE_AI_KEY=sk-proj-...
cadence analyze ./src -o report.txt
```

## Troubleshooting

### Verify Configuration

```bash
# Check if key is set
echo $CADENCE_AI_KEY

# Verify model availability
curl -s https://api.openai.com/v1/models \
  -H "Authorization: Bearer $CADENCE_AI_KEY" | head -20
```

### Test API Connection

```bash
# Simple API test
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $CADENCE_AI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }' | jq .
```

### Handle Rate Limiting

```bash
#!/bin/bash
# Retry with backoff
retry_with_backoff() {
  local max_attempts=3
  local timeout=1
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    if cadence analyze ./repo -o report.json 2>/dev/null; then
      return 0
    fi
    echo "Attempt $attempt failed, retrying in ${timeout}s..."
    sleep $timeout
    timeout=$((timeout * 2))
    attempt=$((attempt + 1))
  done

  return 1
}

retry_with_backoff
```

## Next Steps

- [Configure AI](/docs/ai/configuration)
- [View detection strategies](/docs/cli/detection-strategies)
- [Set up webhooks](/docs/integrations/webhooks)
- [Read CLI commands](/docs/cli/commands)
