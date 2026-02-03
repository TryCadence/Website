---
title: Quick Reference
description: Quick command reference and common use cases for Cadence
---

# Cadence Quick Reference

Fast lookup guide for common Cadence commands and configurations.

## Installation & Build

### Quick Build with Make

```bash
# Clone repository
git clone https://github.com/CodeMeAPixel/Cadence.git
cd cadence-tool

# Build with Make (all platforms)
make build

# Verify installation
./bin/cadence version
```

### Alternative: Direct Build Scripts

```bash
# Linux/macOS
./scripts/build.sh

# Windows PowerShell
.\scripts\build.ps1
```

### Make Convenience Commands

```bash
make build     # Build binary with automatic version injection
make install   # Install to $GOPATH/bin
make test      # Run all tests
make fmt       # Format code
make lint      # Run linter
make clean     # Clean build artifacts
make help      # Show all make targets
```

## Common Commands

### Git Repository Analysis

```bash
# Analyze local repository
cadence analyze /path/to/repo --output report.json

# Analyze GitHub repository
cadence analyze https://github.com/owner/repo --output report.json

# Analyze specific branch
cadence analyze https://github.com/owner/repo/tree/main --output report.json

# Verbose output (detailed findings)
cadence analyze /path/to/repo --verbose --output report.json

# Limit analysis to recent commits
cadence analyze /path/to/repo --max-commits 500 --output report.json

# Analyze with time range
cadence analyze /path/to/repo --since "2024-01-01" --until "2024-12-31" --output report.json

# Exclude files/directories
cadence analyze /path/to/repo --exclude "node_modules,dist,build" --output report.json
```

### Web Content Analysis

```bash
# Analyze website content
cadence web https://example.com --output report.json

# Verbose output
cadence web https://example.com --verbose --output report.json

# Text report format
cadence web https://example.com --output report.txt

# JSON format (machine-readable)
cadence web https://example.com --json --output report.json

# With AI validation
cadence web https://example.com --ai-validation --output report.json
```

### Configuration

```bash
# Show default config
cadence config

# Create config file (.cadence.yaml in current directory)
cadence config init

# Use custom config file
cadence analyze /path/to/repo --config cadence.yml --output report.json

# Show version
cadence version

# Show help
cadence analyze --help
cadence web --help
```

### Webhook Server

```bash
# Start webhook server (default port 8080)
cadence webhook

# Custom port
cadence webhook --port 9000

# With webhook secret
cadence webhook --port 8080 --secret "webhook-secret"
```

## Output Formats

### JSON Output

```json
{
  "repository": "/path/to/repo",
  "timestamp": "2024-01-15T10:30:00Z",
  "analysis": {
    "total_score": 0.72,
    "confidence": 0.85,
    "suspicious_commits": 15
  },
  "strategies": {
    "velocity": {"score": 0.68, "flagged": true},
    "size": {"score": 0.75, "flagged": true},
    "timing": {"score": 0.45, "flagged": false}
  }
}
```

### Score Interpretation

| Score | Interpretation |
|-------|-----------------|
| 0.0-0.3 | Likely human-written |
| 0.3-0.5 | Probably human-written |
| 0.5-0.7 | Likely AI-generated |
| 0.7-1.0 | Very likely AI-generated |

## Configuration Snippets

### Minimal Configuration

```yaml
# cadence.yml
analysis:
  strategies:
    - velocity
    - size
```

### Advanced Configuration

```yaml
# cadence.yml
analysis:
  strategies:
    - velocity
    - size
    - timing
    - statistical
  
  thresholds:
    velocity:
      suspicious_additions: 1000
      suspicious_deletions: 500

ai:
  enabled: true
  provider: openai
  openai:
    api_key: ${OPENAI_API_KEY}
    model: gpt-4o-mini

webhook:
  enabled: true
  port: 8080
  endpoints:
    - event: analysis.complete
      url: https://example.com/webhook
```

### Environment Variables

```bash
# AI Configuration
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...

# Webhook
export CADENCE_WEBHOOK_ENABLED=true
export CADENCE_WEBHOOK_PORT=8080

# Git
export CADENCE_GIT_TIMEOUT=600
export CADENCE_GIT_MAX_COMMITS=5000
```

## Common Workflows

### Code Review Analysis

```bash
# Analyze pull request branch
git clone https://github.com/org/repo
cd repo
git checkout feature-branch
cadence analyze . --verbose --output pr-analysis.json

# Review findings
cat pr-analysis.json | jq '.strategies'
```

### Team Baseline Establishment

```bash
# Establish baseline for your team
cadence analyze /path/to/main/repo \
  --max-commits 1000 \
  --output baseline.json

# Analyze new contributor
cadence analyze https://github.com/contributor/repo \
  --output contributor.json

# Compare scores
jq '.analysis.total_score' baseline.json contributor.json
```

### Continuous Monitoring

```bash
# Analyze repository daily
0 2 * * * cadence analyze /path/to/repo \
  --output /var/log/cadence/daily-$(date +\%Y-\%m-\%d).json
```

### Batch Analysis

```bash
# Analyze multiple repositories
for repo in repo1 repo2 repo3; do
  cadence analyze /path/to/$repo \
    --output analysis_$repo.json
done
```

## Troubleshooting Quick Fixes

### Clone fails: Repository not found
```bash
# Verify repository exists
curl -I https://github.com/owner/repo

# For private repos, configure git first
git config --global credential.helper store
```

### Analysis hangs
```bash
# Use timeout and reduce scope
timeout 60 cadence analyze /path/to/repo \
  --max-commits 100 \
  --depth 50 \
  --output report.json
```

### High memory usage
```bash
# Reduce analysis scope
cadence analyze /path/to/repo \
  --max-commits 50 \
  --depth 25 \
  --output report.json
```

### Connection timeout
```bash
# Increase timeout
cadence web https://example.com \
  --timeout 60 \
  --output report.json
```

### Config not applied
```bash
# Verify config syntax
python3 -c "import yaml; yaml.safe_load(open('cadence.yml'))"

# Use explicit config path
cadence analyze /path/to/repo \
  --config /path/to/cadence.yml \
  --output report.json
```

## Detection Strategies Reference

### Git Strategies (8 total)

1. **Velocity** - Unusual commit rate changes
2. **Size** - Unusually large commits
3. **Timing** - Unusual temporal patterns
4. **Statistical** - Statistical anomalies
5. **Merging** - Merge pattern analysis
6. **Dispersion** - Author dispersion
7. **Ratio** - Metric ratio analysis
8. **Precision** - Precision measurements

### Web Strategies (8 total)

1. **Generic Language** - Overused phrases
2. **Perfect Grammar** - Suspiciously perfect grammar
3. **Overused Phrases** - AI-typical phrasing
4. **Placeholder Patterns** - Generic filler content
5. **Content Uniformity** - Consistent writing style
6. **Content Structure** - Unusual structure patterns
7. **Boilerplate** - Reused template content
8. **AI Fingerprinting** - Model-specific signatures

## API Reference

### Webhook Event: analysis.complete

```json
{
  "event": "analysis.complete",
  "timestamp": "2024-01-15T10:30:00Z",
  "analysis_id": "abc123",
  "repository": "https://github.com/owner/repo",
  "results": {
    "total_score": 0.72,
    "confidence": 0.85,
    "suspicious_commits": 15
  }
}
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Analysis error |
| 2 | Configuration error |
| 3 | Repository not found |
| 4 | Network error |

## Performance Tips

### Fast Analysis
```bash
# Analyze only recent commits
cadence analyze /path/to/repo \
  --max-commits 100 \
  --depth 50
```

### Parallel Processing
```bash
# Analyze multiple repos in parallel
parallel cadence analyze {} --output {/.}.json ::: \
  /repo1 /repo2 /repo3
```

### Caching Results
```yaml
# cadence.yml
performance:
  cache:
    enabled: true
    ttl: 3600
```

## Documentation Links

- [Full Installation Guide](../installation)
- [Quick Start](../quick-start)
- [Git Analysis Guide](../git-analysis-guide)
- [Web Analysis Guide](../web-analysis-guide)
- [Configuration Reference](../configuration)
- [Advanced Configuration](../advanced-configuration)
- [Troubleshooting Guide](../troubleshooting)
- [Repository Analysis](../repository-analysis)

## Support Resources

### Getting Help
1. Check [Troubleshooting Guide](../troubleshooting)
2. Review [Documentation](../index)
3. Search [GitHub Issues](https://github.com/CodeMeAPixel/Cadence/issues)
4. Check command help: `cadence --help`

### Reporting Issues
Include:
- Cadence version: `cadence version`
- Command that failed
- Full error output
- System info (OS, Go version)
- Configuration file (without secrets)
