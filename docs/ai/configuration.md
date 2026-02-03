---
title: AI Configuration
description: Configure OpenAI integration for Cadence analysis
---

# AI Configuration

Configure Cadence to use OpenAI for enhanced commit analysis.

## Environment Variables

Configure AI using environment variables:

```bash
# Enable AI analysis
export CADENCE_AI_ENABLED=true

# Set provider (currently only "openai" supported)
export CADENCE_AI_PROVIDER=openai

# OpenAI API key (required)
export CADENCE_AI_KEY=sk-proj-your-api-key-here

# Model to use (optional, defaults to gpt-4o-mini)
export CADENCE_AI_MODEL=gpt-4-turbo
```

## Configuration File

In your `cadence.yml`:

```yaml
ai:
  enabled: true
  provider: openai
  api_key: "${CADENCE_AI_KEY}"  # Use environment variables
  model: gpt-4-turbo
```

Load environment variables before running:

```bash
export CADENCE_AI_KEY=sk-proj-...
cadence analyze ./repo -o report.txt
```

## Security Best Practices

**Never commit API keys to version control!**

### Using Environment Variables

```bash
# Set temporarily for single command
CADENCE_AI_KEY=sk-proj-... cadence analyze ./repo

# Set for session
export CADENCE_AI_KEY=sk-proj-...
cadence analyze ./repo1
cadence analyze ./repo2
```

### Using .env File

Create `.env` file (add to `.gitignore`):

```
CADENCE_AI_ENABLED=true
CADENCE_AI_PROVIDER=openai
CADENCE_AI_KEY=sk-proj-your-key
CADENCE_AI_MODEL=gpt-4-turbo
```

Load before running:

```bash
# Linux/macOS
source .env
cadence analyze ./repo

# Windows (PowerShell)
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*$|^\s*#') { return }
  $key, $value = $_ -split '=', 2
  [Environment]::SetEnvironmentVariable($key, $value)
}
cadence analyze ./repo
```

### Add to .gitignore

```
.env
.env.local
.env.*.local
*.key
```

### In CI/CD

Use secrets management:

**GitHub Actions:**
```yaml
env:
  CADENCE_AI_KEY: ${{ secrets.OPENAI_API_KEY }}
```

**GitLab CI:**
```yaml
variables:
  CADENCE_AI_KEY: $OPENAI_API_KEY  # Set in CI/CD Variables
```

**Generic:**
```bash
# In your CI/CD platform, set CADENCE_AI_KEY as a secret
# Then pass to the job as an environment variable
```

## Model Selection

### Default: gpt-4o-mini

```bash
export CADENCE_AI_ENABLED=true
export CADENCE_AI_PROVIDER=openai
export CADENCE_AI_KEY=sk-proj-...
# Model defaults to gpt-4o-mini
```

### High Accuracy: gpt-4

```bash
export CADENCE_AI_MODEL=gpt-4
```

### Balanced: gpt-4-turbo

```bash
export CADENCE_AI_MODEL=gpt-4-turbo
```

### List Available Models

```bash
# Via curl
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $CADENCE_AI_KEY" | jq '.data[].id'
```

## Disabling AI

To run without AI analysis:

```bash
# Don't set CADENCE_AI_ENABLED or set to false
export CADENCE_AI_ENABLED=false
cadence analyze ./repo -o report.txt

# Or simply omit the environment variables
cadence analyze ./repo -o report.txt
```

## Verifying Configuration

Check if AI is properly configured:

```bash
# Run analysis - if AI config is invalid, you'll see errors
cadence analyze ./test-repo -o test-report.txt

# Check logs for API errors
echo $CADENCE_AI_KEY  # Verify key is set
```

### Common Configuration Issues

**"API key is required"**
- Verify `CADENCE_AI_KEY` is set: `echo $CADENCE_AI_KEY`
- Check for accidental whitespace
- Ensure you're in the correct shell session

**"Invalid API key"**
- Verify key format: `sk-proj-...`
- Check key hasn't been revoked in OpenAI dashboard
- Try creating a new key

**"Unknown model"**
- Check model name spelling
- Verify model is available for your API tier
- Use `gpt-4o-mini` as fallback

**"Rate limit exceeded"**
- Wait before retrying
- Check OpenAI account rate limits
- Consider batching requests or upgrading API tier

## Advanced Configuration

### Custom API Base URL

For proxy or custom endpoints:

```bash
export OPENAI_API_BASE=https://your-proxy.com/v1
export CADENCE_AI_KEY=sk-proj-...
```

### Request Timeout

```bash
# Increase timeout for slow networks (seconds)
export CADENCE_AI_TIMEOUT=60
```

## Cost Optimization

### Use cheaper models for initial scans

```bash
export CADENCE_AI_MODEL=gpt-4o-mini  # Lowest cost
cadence analyze ./repo -o report.txt
```

### Reserve expensive models for critical analysis

```bash
export CADENCE_AI_MODEL=gpt-4  # Higher accuracy, higher cost
cadence analyze ./critical-section -o critical-report.txt
```

## Next Steps

- [View examples](/docs/ai/examples)
- [Understand detection strategies](/docs/cli/detection-strategies)
- [Read about webhooks integration](/docs/integrations/webhooks)
