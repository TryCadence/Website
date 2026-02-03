---
title: Quick Start
description: Get started with Cadence in minutes
---

# Quick Start

## Git Repository Analysis

Analyze a Git repository to detect AI-generated commits:

### Basic Analysis

Analyze the current repository:

```bash
$ cadence analyze
Analyzing repository...

Suspicious Commits Found: 3
Risk Level: Medium

Commit a1b2c3d: 78% suspicious
  - Velocity anomaly: 750+ lines/min
  - Timing pattern: 3am commit
  - Large change set: +450 -120 lines
```

### Analyze a Specific Repository

```bash
$ cadence analyze /path/to/repo
# Or with a URL
$ cadence analyze https://github.com/user/repo
```

### JSON Output

Get results in JSON format for programmatic use:

```bash
$ cadence analyze --json
{
  "repository": ".",
  "suspicious_commits": 3,
  "risk_level": "medium",
  "results": [...]
}
```

### Save Output to File

```bash
$ cadence analyze --json --output report.json
Report saved to: report.json
```

## Website Analysis

Analyze website content for AI-generated text:

### Basic Website Scan

```bash
$ cadence web https://example.com
Analyzing website...

AI Content Detection: 78% suspicious
Risk Level: High

Detected Patterns:
  - Generic language (45 instances)
  - Perfect grammar (12 instances)
  - Overused phrases (8 instances)
```

### Multiple Pages

```bash
$ cadence web https://example.com --urls /about /blog /contact
# Analyzes multiple pages on the site
```

### With OpenAI Validation (Optional)

Enhance detection with GPT-4o analysis:

```bash
$ cadence web https://example.com --use-ai
# Requires OPENAI_API_KEY environment variable

OpenAI Analysis Results:
  - Content appears AI-generated: Yes
  - AI Model Likely Used: ChatGPT or similar
  - Confidence: 0.85
```

## Common Workflows

### Check a PR/Branch

```bash
$ git checkout feature-branch
$ cadence analyze --json > pr-analysis.json
$ git checkout main
```

### Batch Process Multiple Repos

```bash
$ for repo in ./projects/*; do
    echo "Analyzing $repo"
    cadence analyze "$repo" --json --output "$repo/cadence-report.json"
  done
```

### Webhook Server for CI/CD

```bash
$ cadence webhook --port 8080 --config cadence.yaml
# Webhook server running on http://localhost:8080
# POST /analyze to submit repositories for analysis
```

## Understanding the Results

### Confidence Score

Results range from 0 (not suspicious) to 1.0 (highly suspicious):

- **0.0 - 0.3**: Likely human-generated
- **0.3 - 0.6**: Possibly AI-generated, needs review
- **0.6 - 0.8**: Likely AI-generated
- **0.8 - 1.0**: Very likely AI-generated

### Detection Strategies

Cadence uses multiple strategies to detect AI content. Each triggered strategy contributes to the final score. See [Detection Strategies](/docs/detection-strategies) for details.

## What's Next?

- [Configuration Guide](/docs/configuration) - Learn how to customize detection thresholds
- [Detection Strategies](/docs/detection-strategies) - Understand how each strategy works
- [Webhook Server](/docs/webhook-server) - Deploy Cadence as a service
