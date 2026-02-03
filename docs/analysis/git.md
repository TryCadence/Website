---
title: Git Analysis Details
description: Technical details on how Cadence analyzes Git repositories
---

# Git Analysis

Cadence uses sophisticated pattern recognition and statistical analysis to examine Git repositories and identify suspicious commits.

## Analysis Flow

### 1. Repository Reading

Cadence reads the Git history:
- Extracts all commits
- Gets commit metadata (hash, author, timestamp, message)
- Calculates differences between consecutive commits
- Groups changes by commit pair (previous commit → current commit)

### 2. Commit Pair Analysis

For each pair of consecutive commits, Cadence:
- Calculates time delta (seconds between commits)
- Counts additions and deletions
- Counts files changed
- Calculates velocity metrics
- Analyzes patterns

### 3. Strategy Application

Each detection strategy examines the commit pair independently:
- Velocity Strategy: How fast was code added/deleted?
- Size Strategy: How large was the change?
- Timing Strategy: How quickly did commits follow each other?
- And 9 more strategies...

### 4. Scoring

Cadence combines strategy results:
- Each flagged strategy contributes to the score
- More flags = higher confidence
- Score reflects likelihood of AI involvement

## Core Detection Strategies

### Velocity Analysis

**What it measures:** Changes per minute

**Formula:**
```
additions_per_minute = additions / (time_delta_seconds / 60)
```

**Example:**
- 1000 lines added in 5 minutes
- Velocity = 1000 / (300 / 60) = 200 adds/min
- If threshold is 100 adds/min → **FLAGGED**

**Why it matters:** AI code generation is much faster than human typing

**Typical thresholds:**
- Suspicious: 100-200 additions/min
- Very suspicious: 200+ additions/min

### Size Analysis

**What it measures:** Total lines changed per commit

**Triggers when:**
- Additions exceed threshold (default: 500)
- Deletions exceed threshold (default: 1000)

**Example:**
- Commit adds 2500 lines (threshold: 500)
- Commit deletes 50 lines
- **FLAGGED** for large additions

**Why it matters:** Humans make incremental changes; AI bulk-generates code

### Timing Analysis

**What it measures:** Time between consecutive commits

**Triggers when:**
- Commits are closer than minimum threshold (default: 60 seconds)

**Example:**
- Commit A at 10:00:00
- Commit B at 10:00:15 (15 seconds later)
- If threshold is 60 seconds → **FLAGGED**

**Why it matters:** Humans need time to test, write commit messages, etc.

### File Dispersion Analysis

**What it measures:** Number of files changed in single commit

**Triggers when:**
- Files changed exceed threshold (default: 50)

**Example:**
- Commit touches 200 files (threshold: 50)
- **FLAGGED**

**Why it matters:** 
- Humans fix related code in related files
- AI batch operations touch many unrelated files
- Common with `find & replace` operations

### Ratio Analysis

**What it measures:** Addition vs deletion balance

**Analyzes:**
- Addition ratio: additions / (additions + deletions)
- Deletion ratio: deletions / (additions + deletions)

**Example 1 (Pure additions):**
- Commit: 1000 additions, 0 deletions
- Ratio: 100% additions
- Suggests generated code, not refactoring

**Example 2 (Balanced):**
- Commit: 500 additions, 500 deletions
- Ratio: 50/50
- Suggests legitimate refactoring

**Why it matters:** Real refactoring has balanced changes; pure additions suggest code generation

### Commit Message Analysis

**What it detects:** Generic or AI-like messages

**Flagged patterns:**
- "implement" (too generic)
- "add functionality"
- "update code"
- "refactor code"
- Multiple generic patterns combined

**Example:**
- Message: "implement functionality for user service"
- 2+ generic patterns detected
- **FLAGGED**

**Why it matters:** AI generates generic, descriptive messages; humans use more natural language

### Naming Pattern Analysis

**What it detects:** Suspiciously generic variable names

**Flagged patterns:**
- Overuse of names like: `data`, `result`, `value`, `item`, `helper`, `manager`, `service`
- Overly consistent naming ("too clean")
- Naming conventions that feel template-like

**Why it matters:** AI tends toward generic names; experienced developers use specific names

### Structural Consistency Analysis

**What it detects:** Overly uniform code structure

**Flagged patterns:**
- Functions/classes of identical length
- Perfect indentation (no real-world variations)
- Repetitive structure across multiple functions
- Suspicious code uniformity

**Why it matters:** Real codebases have natural variation; uniform structure suggests generation

### Error Handling Analysis

**What it detects:** Missing or unusual error handling

**Flagged patterns:**
- Error-prone operations without error handling
- Generic error handling (catch-all with no action)
- Unused error variables
- Missing null checks

**Why it matters:** AI often neglects error handling; experienced developers handle errors

### Statistical Anomaly Detection

**What it measures:** Deviations from repository baseline

**Analyzes:**
- Average commit size in repository
- Average velocity in repository
- Average files per commit
- Identifies commits deviating significantly

**Example:**
- Repository average: 50 lines per commit
- This commit: 5000 lines
- Deviation: 100x normal
- **FLAGGED** as statistical anomaly

### Burst Pattern Analysis

**What it detects:** Multiple commits in rapid succession

**Example:**
- 20 commits in 1 hour (threshold: typically 10 per hour)
- **FLAGGED** for burst pattern

**Why it matters:** Humans don't commit that fast; suggests automated generation

### Timing Anomaly Detection

**What it detects:** Unusual commit timing patterns

**Analyzes:**
- Commits at unusual hours (3 AM, weekend patterns)
- Consistent patterns that don't match human behavior
- Bots/automation signatures

## Example: Analyzing a Commit

Given this commit pair:

```
Previous: 09:00 AM, 50 lines added
Current:  09:00:05 AM, 2000 lines added, 100 files changed
```

**Strategies that trigger:**

1. **Velocity**: 2000 lines in 5 seconds = 24,000 adds/min → **FLAGGED**
2. **Size**: 2000 additions > 500 threshold → **FLAGGED**
3. **Timing**: 5 seconds < 60 second threshold → **FLAGGED**
4. **File Dispersion**: 100 files > 50 threshold → **FLAGGED**
5. **Ratio**: 100% additions (no deletions) → **FLAGGED**

**Result:** 5 strategies flagged = high confidence (0.8+) of AI involvement

## Thresholds

All strategies are configurable via command-line flags or config file:

```bash
cadence analyze ./repo \
  --suspicious-additions 500 \
  --suspicious-deletions 1000 \
  --max-additions-pm 100 \
  --max-deletions-pm 500 \
  --min-time-delta 60 \
  --max-files-per-commit 50
```

## Next Steps

- [Repository Analysis](/docs/analysis/repository) - Practical usage guide
- [Configure Detection](/docs/cli/detection-strategies) - Adjust thresholds
- [CLI Commands](/docs/cli/commands) - Available options
- [AI Integration](/docs/ai) - Add AI analysis \
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

Cadence uses a `cadence.yml` configuration file to customize detection thresholds and behavior. 

**📖 For full configuration reference:** [Configuration Guide](/docs/configuration)

**Example:**
```yaml
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100

ai:
  enabled: false
  provider: openai
```

Load with analysis:
```bash
cadence analyze /repo --config cadence.yml --output report.json
```

**📖 See all options in:** [Configuration Reference](/docs/configuration) | [Advanced Configuration](/docs/advanced-configuration)

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

**Analyze other sources:**
- [Web Analysis Guide](/docs/web-analysis-guide) - Analyze websites for AI content
- [Quick Start](/docs/quick-start) - Getting started quickly

**Or configure:**
- [Configuration Reference](/docs/configuration) - Customize behavior
- [Advanced Configuration](/docs/advanced-configuration) - AI validation, webhooks, more
- [Troubleshooting Guide](/docs/troubleshooting-guide) - Common issues and solutions
