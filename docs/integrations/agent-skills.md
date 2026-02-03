# Agent Skills & Integration

Cadence exposes its detection capabilities through agent skills compatible with AI assistants and automation tools.

## Overview

Agent skills allow AI agents and automation tools to invoke Cadence's analysis capabilities programmatically. Cadence implements the skills.sh specification, making it compatible with Claude, ChatGPT, and other agent platforms.

## What are Agent Skills?

Agent skills are standardized interfaces that enable:

- **AI assistants** to invoke Cadence analysis directly in conversations
- **Automation tools** to integrate detection into workflows
- **Custom agents** to call detection APIs programmatically

## Available Skills

Cadence provides two core skills:

### 1. analyze-repository

Analyze an entire Git repository for AI-generated commits.

**Input:**

```json
{
  "repository": "https://github.com/owner/repo",
  "branch": "main",
  "output_format": "json"
}
```

**Parameters:**

- `repository` *(required)* - Local path or GitHub URL
  - Examples: `/path/to/repo`, `https://github.com/owner/repo`
- `branch` *(optional)* - Specific branch to analyze (default: `main`)
  - Examples: `main`, `develop`, `feature-branch`
- `output_format` *(optional)* - Output format: `json` or `text` (default: `json`)

**Output:**

```json
{
  "suspicious_commits": [
    {
      "hash": "abc1234",
      "confidence": 0.85,
      "reasons": ["velocity", "timing", "size"],
      "severity": "high"
    }
  ],
  "total_suspicious": 1,
  "statistics": {
    "total_commits": 50,
    "authors": 3,
    "date_range": "2024-01-01 to 2024-02-01"
  }
}
```

### 2. detect-suspicious-commit

Analyze a single commit for AI-generation patterns.

**Input:**

```json
{
  "commit_hash": "abc1234",
  "additions": "def hello():\n    print('Hello World')\n    return True",
  "use_ai": false
}
```

**Parameters:**

- `commit_hash` *(required)* - Git commit hash
- `additions` *(required)* - Code additions text from the commit
- `use_ai` *(optional)* - Enable OpenAI analysis (default: `false`)
  - Requires `OPENAI_API_KEY` if set to `true`

**Output:**

```json
{
  "suspicious": true,
  "confidence": 0.75,
  "reasons": ["velocity", "timing"],
  "severity": "medium",
  "ai_analysis": "Possibly AI-generated with 75% confidence"
}
```

## Installation

### Method 1: From GitHub

Download directly from repository:

```bash
curl -o skills.json https://raw.githubusercontent.com/TryCadence/Cadence/main/skills.json
```

### Method 2: NPM Registry (Coming Soon)

An npm module is coming soon for easier installation and management:

```bash
# Coming soon!
npm install @trycadence/cadence-skills
```

For now, use Method 1 (GitHub download) or Method 3 (local installation).

### Method 3: Local Installation

If running Cadence locally, reference the local `skills.json`:

```bash
# In Cadence repository
cat skills.json
```

## Usage with AI Assistants

### Claude (Claude.ai or Claude Code)

In conversation, describe what you want analyzed:

```
Analyze this repository for AI-generated commits:
https://github.com/owner/repo

Show me which commits are suspicious and why.
```

Claude will:
1. Recognize the request matches Cadence skills
2. Invoke `analyze-repository` skill
3. Present results in conversation

### ChatGPT (Custom Actions)

Add Cadence as a custom action:

1. Go to ChatGPT → My GPTs → Create → Custom actions
2. Add Cadence skill schema
3. Use in prompts: "Check if this repo has AI-generated code"

ChatGPT will invoke the skill and integrate results.

### Custom Agents (Programmatic)

**Python Example:**

```python
import requests
import json

# Repository analysis
response = requests.post("http://localhost:3000/api/analyze", json={
    "repository": "https://github.com/owner/repo",
    "branch": "main"
})

results = response.json()
print(f"Found {results['total_suspicious']} suspicious commits")

for commit in results['suspicious_commits']:
    print(f"  - {commit['hash']}: {commit['confidence']} confidence")
```

**JavaScript Example:**

```javascript
// Single commit analysis
const response = await fetch('http://localhost:3000/api/analyze-commit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commit_hash: 'abc1234',
    additions: 'code additions text',
    use_ai: false
  })
});

const results = await response.json();
console.log(`Confidence: ${results.confidence}`);
```

**Go Example:**

```go
import "net/http"

client := &http.Client{}
req, _ := http.NewRequest("POST", "http://localhost:3000/api/analyze", body)
req.Header.Set("Content-Type", "application/json")

resp, _ := client.Do(req)
// Parse response JSON
```

## Skills.json Specification

The `skills.json` file defines skills using JSON Schema:

```json
{
  "name": "cadence-ai-detection",
  "version": "0.1.0",
  "description": "AI-generated code detection skill",
  "author": "CodeMeAPixel",
  "repository": "https://github.com/TryCadence/Cadence",
  "license": "AGPL-3.0",
  "skills": [
    {
      "name": "analyze-repository",
      "description": "Analyze a Git repository for suspicious AI-generated commits",
      "input": {
        "type": "object",
        "properties": {
          "repository": { "type": "string" },
          "branch": { "type": "string" },
          "output_format": { "enum": ["json", "text"] }
        },
        "required": ["repository"]
      },
      "output": {
        "type": "object",
        "properties": {
          "suspicious_commits": { "type": "array" },
          "total_suspicious": { "type": "integer" }
        }
      }
    }
  ]
}
```

## Configuration for Agent Skills

### Enable AI Analysis

For GPT-4o analysis, set API key and enable in config:

```yaml
ai:
  enabled: true
  provider: openai
  model: gpt-4o-mini
  api_key: "${OPENAI_API_KEY}"
```

### Environment Setup

```bash
export OPENAI_API_KEY="sk-..."
export CADENCE_CONFIG="/path/to/cadence.yaml"
```

## Integration Workflows

### Workflow 1: Code Review Assistant

**User Request:**
"Review this PR for AI-generated code"

**Process:**
1. Claude invokes `analyze-repository` with PR branch
2. Gets list of suspicious commits
3. Claude presents findings with severity levels
4. Suggests manual review of flagged commits

### Workflow 2: Continuous Monitoring

**Automation:**
```python
# Scheduled analysis
while True:
    repos = get_my_repos()
    for repo in repos:
        result = invoke_skill('analyze-repository', {
            'repository': repo.url
        })
        alert_if_suspicious(result)
    sleep(86400)  # Daily
```

### Workflow 3: Commit Hook Integration

**Pre-commit Hook:**
```bash
#!/bin/bash
# .git/hooks/post-commit
COMMIT_HASH=$(git rev-parse HEAD)
ADDITIONS=$(git diff HEAD~1 HEAD)

cadence detect-suspicious-commit \
  --hash "$COMMIT_HASH" \
  --additions "$ADDITIONS"
```

## API Endpoints (Programmatic)

### POST /api/analyze

Analyze a repository.

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "https://github.com/owner/repo",
    "branch": "main"
  }'
```

### POST /api/analyze-commit

Analyze a single commit.

```bash
curl -X POST http://localhost:3000/api/analyze-commit \
  -H "Content-Type: application/json" \
  -d '{
    "commit_hash": "abc1234",
    "additions": "code text",
    "use_ai": false
  }'
```

## Best Practices

### For AI Assistants

1. **Clear Requests** - Specify exact repository and branch
2. **Understand Results** - Review flagged commits manually
3. **Context** - Provide context about development team velocity
4. **False Positives** - Some legitimate commits may flag (large refactors, auto-generated)

### For Custom Integration

1. **Error Handling** - Handle analysis timeouts and failures gracefully
2. **Caching** - Cache results to avoid redundant analyses
3. **Rate Limiting** - Respect rate limits on Git APIs
4. **Secrets Management** - Never expose API keys in code

## Troubleshooting

### Skill Not Recognized

1. Verify `skills.json` is accessible
2. Check JSON syntax is valid
3. Ensure agent platform supports skills.sh spec
4. Restart agent/assistant if needed

### Analysis Fails

1. Check repository is accessible
2. Verify branch exists
3. Ensure sufficient permissions
4. Check network connectivity

### AI Analysis Not Working

1. Verify `OPENAI_API_KEY` is set
2. Check API key is valid
3. Ensure OpenAI account has credits
4. Verify `ai.enabled: true` in config

## Examples

### Example 1: Detect Suspicious Repository

**Request:**
```json
{
  "repository": "https://github.com/owner/suspicious-repo",
  "branch": "main",
  "output_format": "json"
}
```

**Response:**
```json
{
  "suspicious_commits": [
    {
      "hash": "a1b2c3d",
      "confidence": 0.92,
      "reasons": ["high_velocity", "timing", "size"],
      "severity": "high"
    }
  ],
  "total_suspicious": 1,
  "statistics": {
    "total_commits": 100,
    "authors": 5,
    "date_range": "2024-01-01 to 2024-12-31"
  }
}
```

### Example 2: Check Single Commit

**Request:**
```json
{
  "commit_hash": "f1e2d3c",
  "additions": "def fetch_user(id):\n    db = connect()\n    return db.query(id)\ndef save_user(user):\n    db = connect()\n    db.insert(user)",
  "use_ai": true
}
```

**Response:**
```json
{
  "suspicious": true,
  "confidence": 0.68,
  "reasons": ["naming_pattern", "error_handling"],
  "severity": "medium",
  "ai_analysis": "Code structure appears consistent with generated code, but confidence moderate due to legitimate use case possibility"
}
```

## Next Steps

- [Webhook Integration](/docs/integrations/webhooks) - Webhook server setup
- [CLI Commands](/docs/cli/commands) - Command-line usage
- [Configuration](/docs/getting-started/configuration) - Advanced settings
