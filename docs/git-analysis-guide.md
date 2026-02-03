---
title: Git Analysis Guide
description: Comprehensive guide to analyzing Git repositories with Cadence for AI-generated commits
---

# Git Repository Analysis Guide

Cadence analyzes Git repositories to detect commits that may have been generated or significantly assisted by AI. This guide covers all aspects of Git analysis, from basic usage to advanced configurations.

## Overview

Git analysis examines commit patterns to identify suspicious activity that correlates with AI-generated code. Cadence uses multiple detection strategies to provide comprehensive analysis with confidence scoring.

### What Gets Analyzed

- **Commit sizes** - Unusually large additions/deletions
- **Commit velocity** - Changes per minute rates
- **Temporal patterns** - Timing between commits
- **File patterns** - Number of files modified per commit
- **Statistical anomalies** - Deviation from repository norms
- **Merge patterns** - Unusual merging behavior
- **Author consistency** - Divergence from historical patterns

## Basic Usage

### Analyze a Local Repository

```bash
cadence analyze /path/to/repository \
  --output report.json \
  --suspicious-additions 500 \
  --suspicious-deletions 1000
```

### Analyze a Remote Repository (GitHub)

Cadence can clone and analyze remote repositories directly:

```bash
# Analyze main branch
cadence analyze https://github.com/username/repo \
  --output report.json \
  --branch main

# Extract branch from URL
cadence analyze https://github.com/username/repo/tree/develop \
  --output report.json
```

**Supported URL formats:**
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `https://github.com/owner/repo/tree/branch-name`

The cloned repository is automatically cleaned up after analysis.

## Detection Strategies

Cadence uses eight detection strategies to identify suspicious commits:

### 1. Velocity Analysis

Detects commits with unusually high change rates.

```bash
cadence analyze /repo \
  --output report.json \
  --max-additions-pm 100 \
  --max-deletions-pm 500
```

**What it detects:** Commits with more additions or deletions per minute than the threshold
**Why it matters:** AI tools can generate code much faster than typical human development
**Example:** 1000 lines added in 2 minutes = 500 additions/min

### 2. Size Analysis

Flags commits that exceed size thresholds.

```bash
cadence analyze /repo \
  --output report.json \
  --suspicious-additions 500 \
  --suspicious-deletions 1000
```

**What it detects:** Commits exceeding line count thresholds
**Why it matters:** Humans typically make smaller, focused commits; AI tools generate larger batches
**Example:** A commit adding 2000 lines might indicate generated code

### 3. Timing Analysis

Detects commits with unusual time intervals.

```bash
cadence analyze /repo \
  --output report.json \
  --min-time-delta 300
```

**What it detects:** Commits separated by less than the specified seconds
**Why it matters:** Rapid-fire commits suggest automated generation
**Example:** 5 commits in 2 minutes with consistent 20-second gaps

### 4. Statistical Analysis

Compares individual commits against repository statistics.

**What it detects:**
- Commits with addition/deletion ratios outside normal range
- Commits with more files than typical
- Changes that deviate significantly from repository patterns

**Why it matters:** Identifies behavior that's unusual for that specific project

### 5. Merging Pattern Analysis

Identifies unusual merge behaviors.

**What it detects:**
- Unusual merge frequency
- Merge commits with suspicious content
- Patterns diverging from repository merge history

**Why it matters:** AI tools may handle merges differently than humans

### 6. Dispersion Analysis

Analyzes how changes are spread across files.

**What it detects:**
- Commits affecting too many files at once
- Unusual file modification patterns
- Inconsistent file relationships

**Why it matters:** Humans typically modify related files; scattered changes suggest generation

### 7. Ratio Analysis

Examines the balance of additions vs. deletions.

**What it detects:**
- Commits with extreme add/delete ratios
- Commits with very high addition percentages
- Commits with unusual deletion patterns

**Why it matters:** Different patterns suggest different origins

### 8. Precision Analysis

Provides detailed per-commit analysis.

**What it detects:**
- Commit message quality
- Code structure consistency
- Metadata inconsistencies

**Why it matters:** Provides granular detail for suspicious commits

## Configuration File

Create a `cadence.yml` file for consistent analysis:

```yaml
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100
  max_deletions_per_min: 500
  min_time_delta_seconds: 60
  max_files_per_commit: 50
  max_addition_ratio: 0.95
  min_deletion_ratio: 0.95
  min_commit_size_ratio: 100
  enable_precision_analysis: true

exclude_files:
  - "*.lock"
  - "*.min.js"
  - "dist/**"
  - "build/**"

ai:
  enabled: false
  provider: openai
  api_key: ${OPENAI_API_KEY}
  model: gpt-4o-mini

webhook:
  enabled: false
  host: localhost
  port: 8080
  secret: your-webhook-secret
  max_workers: 5
  read_timeout: 30
  write_timeout: 30
```

Load configuration:

```bash
cadence analyze /repo --config cadence.yml --output report.json
```

## Output Formats

### JSON Report

```bash
cadence analyze /repo --output report.json
```

**Report structure:**
```json
{
  "repository": {
    "path": "/path/to/repo",
    "branch": "main",
    "commits_analyzed": 150
  },
  "summary": {
    "total_commits": 150,
    "suspicious_commits": 8,
    "confidence_score": 0.75
  },
  "results": [
    {
      "hash": "abc123...",
      "author": "User <user@example.com>",
      "timestamp": "2024-01-15T10:30:00Z",
      "stats": {
        "additions": 250,
        "deletions": 50,
        "files_changed": 5
      },
      "flags": [
        {
          "strategy": "velocity_analysis",
          "severity": "high",
          "message": "Addition velocity too high..."
        }
      ],
      "confidence": 0.85
    }
  ]
}
```

### Text Report

```bash
cadence analyze /repo --output report.txt
```

Shows human-readable summary with commit details and flags.

## Advanced Usage

### Exclude Files and Patterns

```bash
cadence analyze /repo \
  --output report.json \
  --exclude-files "*.lock" \
  --exclude-files "dist/**" \
  --exclude-files "node_modules/**"
```

### Branch-Specific Analysis

```bash
cadence analyze /repo \
  --output report.json \
  --branch develop
```

### AI Validation (Optional)

Enable OpenAI analysis for expert verification:

```yaml
ai:
  enabled: true
  provider: openai
  api_key: sk-...
  model: gpt-4o-mini
```

The AI model reviews flagged commits and provides additional context.

## Understanding Results

### Confidence Scores

Each commit receives a confidence score (0-1) indicating likelihood of AI generation:

- **0.0-0.3**: Likely human-written
- **0.3-0.6**: Possibly human or AI-assisted
- **0.6-0.8**: Likely AI-generated
- **0.8-1.0**: Very likely AI-generated

### Flag Severity Levels

- **Low**: Pattern detected, but not conclusive alone
- **Medium**: Notable pattern, warrants review
- **High**: Strong indicator of AI generation
- **Critical**: Multiple factors strongly suggest AI

## Performance Considerations

### Large Repositories

For repositories with 1000+ commits:

```bash
# Analyze specific branch only
cadence analyze /repo --branch main --output report.json

# Exclude unnecessary file patterns
cadence analyze /repo \
  --exclude-files "dist/**" \
  --exclude-files "*.min.js" \
  --output report.json

# Consider analysis time (typically 1-5 minutes for 1000 commits)
```

### Memory Usage

- Small repo (0-100 commits): ~50MB
- Medium repo (100-1000 commits): ~200MB
- Large repo (1000+ commits): ~500MB+

## Troubleshooting

### Repository Clone Fails

```bash
# Check network connectivity
curl -I https://github.com

# Verify URL format
# Valid: https://github.com/owner/repo
# Valid: https://github.com/owner/repo/tree/branch
# Invalid: git@github.com:owner/repo.git (SSH URLs not supported)
```

### Analysis Takes Too Long

- Reduce repository size with `--branch` flag
- Use exclude patterns for generated files
- Consider analyzing recent commits only

### Missing Commits

- Verify branch name with `--branch` flag
- Ensure no fetch depth limitations
- Check file permissions on repository

## Real-World Examples

### Example 1: Reviewing Code for AI Assistance

```bash
cadence analyze ~/my-project \
  --output review.json \
  --suspicious-additions 300 \
  --max-additions-pm 150
```

Check `review.json` for flagged commits to understand where AI may have assisted.

### Example 2: Compliance Auditing

```bash
cadence analyze https://github.com/org/critical-repo \
  --output compliance-report.json \
  --config cadence.yml
```

Generate compliance report for organizational review.

### Example 3: Continuous Monitoring

```bash
# Monitor for new suspicious commits
cadence analyze /repo --branch main --output current.json
# Compare with previous analysis to identify new suspicious commits
```

## Best Practices

1. **Use Configuration Files** - Ensures consistent thresholds across analyses
2. **Review Flagged Commits** - Not all flags indicate AI generation
3. **Consider Context** - Large commits may be legitimate (initial import, refactoring)
4. **Enable AI Validation** - Provides additional confidence in results
5. **Monitor Trends** - Track changes over time rather than single snapshots
6. **Exclude Generated Files** - Avoid false positives from bundled code
7. **Review Multiple Strategies** - Single detection method may be inconclusive

## Next Steps

- [Web Analysis Guide](../web-analysis-guide) - Analyze websites for AI content
- [Configuration Reference](../configuration) - Full configuration options
- [Troubleshooting Guide](../troubleshooting) - Common issues and solutions
