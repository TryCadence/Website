---
title: Repository Analysis Guide
description: Deep dive into analyzing Git repositories with Cadence
---

# Repository Analysis Best Practices

This guide provides advanced techniques for analyzing Git repositories with Cadence, covering everything from setup to interpretation of results.

## Understanding Repository Analysis

Cadence analyzes Git repositories by examining commit patterns, authorship data, timing, and content changes to identify potentially AI-generated commits.

### What Cadence Analyzes

**Commit Metadata:**
- Commit timestamps and frequency
- Author and committer information
- Commit message content and patterns
- Merge vs. regular commits

**Code Changes:**
- Number of files changed per commit
- Lines added/deleted
- Chunk patterns
- File types involved

**Patterns:**
- Temporal patterns (time-of-day, day-of-week)
- Author patterns (who commits when)
- Change magnitude patterns
- Merge frequency and patterns

## Setting Up Repository Analysis

### Local Repository

```bash
# Analyze a local repository
cadence analyze /path/to/repo --output report.json

# Verify git repository exists
cd /path/to/repo
git status
git log --oneline | head -5
```

### Remote GitHub Repository

```bash
# Analyze a GitHub repository (auto-clones)
cadence analyze https://github.com/owner/repo --output report.json

# Analyze specific branch
cadence analyze https://github.com/owner/repo/tree/develop --output report.json

# Analyze at specific commit
cadence analyze https://github.com/owner/repo/tree/abc123def --output report.json
```

### Private Repositories

```bash
# Configure git credentials first
git config --global credential.helper store
# Then enter credentials when prompted

# Now analyze the private repo
cadence analyze https://github.com/owner/private-repo --output report.json
```

### Repository with Submodules

```bash
# Cadence can follow submodules
cadence analyze https://github.com/owner/repo \
  --follow-submodules \
  --output report.json
```

## Analysis Scope Control

### Limit Analysis by Depth

```bash
# Analyze only the most recent 100 commits
cadence analyze /path/to/repo \
  --depth 100 \
  --output report.json

# Note: depth 0 = full history
```

### Limit Analysis by Count

```bash
# Analyze maximum 500 commits
cadence analyze /path/to/repo \
  --max-commits 500 \
  --output report.json
```

### Limit Analysis by Time Range

```bash
# Analyze commits from last 6 months
cadence analyze /path/to/repo \
  --since "6 months ago" \
  --output report.json

# Analyze commits from specific date range
cadence analyze /path/to/repo \
  --since "2024-01-01" \
  --until "2024-06-30" \
  --output report.json
```

### Exclude Specific Files/Directories

```bash
cadence analyze /path/to/repo \
  --exclude "*.lock,node_modules,dist" \
  --output report.json
```

## Understanding Results

### High-Level Score Interpretation

The overall score indicates likelihood of AI involvement:

| Score Range | Interpretation |
|-------------|-----------------|
| 0.0 - 0.2 | Very likely human-written |
| 0.2 - 0.4 | Probably human-written |
| 0.4 - 0.6 | Mixed signals or inconclusive |
| 0.6 - 0.8 | Probably AI-generated or AI-assisted |
| 0.8 - 1.0 | Very likely AI-generated |

### Individual Strategy Scores

Each detection strategy provides independent evidence:

```json
{
  "strategies": {
    "velocity": {
      "score": 0.85,
      "flagged": true,
      "reason": "Unusual commit rate spike"
    },
    "size": {
      "score": 0.72,
      "flagged": true,
      "reason": "Unusually large commits"
    },
    "timing": {
      "score": 0.45,
      "flagged": false,
      "reason": "Normal timing patterns"
    }
  }
}
```

### Confidence Scores

Confidence indicates how certain Cadence is about its assessment:

- **High confidence (0.8-1.0):** Multiple independent signals agree
- **Medium confidence (0.5-0.8):** Some signals present but not overwhelming
- **Low confidence (0-0.5):** Limited evidence, results inconclusive

## Common Findings and What They Mean

### High Velocity Detection

**Finding:** Sharp increase in commit frequency

**What it means:**
- Sudden spike in commits per day/week
- Possible AI-generated content push
- Could be legitimate during sprint or deadline

**Context clues:**
- Multiple authors committing simultaneously
- Very large commit sizes
- Unusual commit message patterns
- Associated with project deadline or launch

### Size Anomalies

**Finding:** Commits much larger than typical

**What it means:**
- Many files changed in single commit
- Possible bulk AI generation
- Could be legitimate refactoring or merge

**Analysis approach:**
- Check if commits are merges
- Examine file types (code vs. auto-generated)
- Look for consistent patterns

### Timing Anomalies

**Finding:** Commits at unusual times

**What it means:**
- Commits at odd hours (3 AM commits from person normally offline)
- Potential CI/CD automation (legitimate)
- Potential AI generation (suspicious)
- Cross-timezone teams (legitimate)

**Verification steps:**
- Check author timezone
- Look for CI commit patterns
- Examine commit messages

### Author Pattern Changes

**Finding:** Author's commit pattern suddenly changes

**What it means:**
- Rapid increase in commits from specific author
- Different commit sizes or frequencies
- Possible account takeover or AI generation

**Investigation approach:**
- Compare "before" and "after" periods
- Check for commit message pattern changes
- Verify author identity

## Real-World Analysis Scenarios

### Scenario 1: Evaluating New Contributor

```bash
# Clone contributor's repository
git clone https://github.com/contributor/project
cd project

# Analyze with focus on recent commits
cadence analyze . \
  --since "1 month ago" \
  --verbose \
  --output contributor_analysis.json

# Review results
jq '.strategies, .suspicious_commits' contributor_analysis.json
```

**Decision factors:**
- Is score consistently high?
- Do multiple strategies flag content?
- Are commit messages relevant and detailed?
- Does author have history in other repos?

### Scenario 2: Code Review Quality Check

```bash
# Analyze specific branch before merge
cadence analyze /path/to/repo/branch-name \
  --since "branch created" \
  --output branch_analysis.json

# Compare with main branch statistics
cadence analyze /path/to/repo/main \
  --max-commits 1000 \
  --output main_analysis.json
```

**Comparison approach:**
- Compare strategy scores
- Check for pattern similarities
- Validate commit quality manually

### Scenario 3: Open Source Security Audit

```bash
# Analyze popular open-source project
cadence analyze https://github.com/popular/project \
  --ai-validation  # Use AI for additional confidence
  --output audit_report.json

# Focus on recent commits
cadence analyze https://github.com/popular/project \
  --max-commits 200 \
  --verbose \
  --output recent_commits_audit.json
```

**Security assessment:**
- Identify high-score commits
- Trace back to pull request
- Examine code review comments
- Verify functionality

### Scenario 4: Team Code Quality Baseline

```bash
# Establish baseline for your team
cadence analyze /path/to/team/repo \
  --output baseline_report.json

# Analyze individual author
cadence analyze /path/to/repo \
  --since "1 month ago" \
  --verbose \
  --output recent_work.json | jq '.detections[] | select(.author == "john@example.com")'
```

**Baseline understanding:**
- Know what "normal" looks like for your team
- Identify team coding patterns
- Set thresholds for alerts
- Distinguish false positives

## Advanced Analysis Techniques

### Batch Repository Analysis

```bash
# Analyze multiple repositories for comparison
repos=(
  "https://github.com/org/project1"
  "https://github.com/org/project2"
  "https://github.com/org/project3"
)

for repo in "${repos[@]}"; do
  name=$(echo "$repo" | cut -d'/' -f5)
  cadence analyze "$repo" \
    --max-commits 500 \
    --output "analysis_${name}.json"
done

# Compare results
jq -s 'map({repo: .repository, score: .analysis.total_score, flagged: .analysis.suspicious_commits})' analysis_*.json
```

### Trend Analysis

```bash
# Analyze same repository at different times
dates=("2024-01-01" "2024-04-01" "2024-07-01" "2024-10-01")

for date in "${dates[@]}"; do
  cadence analyze /path/to/repo \
    --until "$date" \
    --max-commits 1000 \
    --output "trend_${date}.json"
done

# Plot trends
jq -s 'map({date: .timestamp, score: .analysis.total_score})' trend_*.json
```

### Commit Message Analysis

```bash
# Extract and analyze commit messages
git log --format=%B | cadence analyze \
  --analyze-content \
  --output message_analysis.json
```

**Message patterns to check:**
- Generic placeholder text
- Repetitive structure
- Lack of specific details
- AI-typical phrasing

### File Pattern Analysis

```bash
# Analyze changes in specific file types
cadence analyze /path/to/repo \
  --include "*.py,*.js" \
  --output code_analysis.json

# Compare with documentation
cadence analyze /path/to/repo \
  --include "*.md,*.txt" \
  --output docs_analysis.json
```

## Interpreting Different Scenarios

### All Green (Low Scores)

**Result:** Consistently low scores across strategies

**Meaning:**
- Likely legitimate human contributions
- Normal commit patterns
- Standard coding practice

**Action:** No further investigation needed

### Mixed Signals (Medium Scores)

**Result:** Some strategies flag content, others don't

**Meaning:**
- Could be AI-assisted (human + AI)
- Could be legitimate with some unusual patterns
- Requires manual review

**Action:**
- Review flagged commits manually
- Examine commit messages
- Check code quality
- Verify with author if needed

### Clear Flags (High Scores)

**Result:** Multiple strategies flag content

**Meaning:**
- Strong indication of AI generation
- Multiple independent evidence sources agree
- Likely automated contribution

**Action:**
- Review pull request and code
- Check for functionality issues
- Verify code quality
- Consider rejecting if company policy prohibits AI-generated code

## Performance Optimization

### Large Repository Tips

```bash
# For large repositories, use shallow clone
cadence analyze https://github.com/megarepo/project \
  --depth 50 \
  --max-commits 500 \
  --exclude "node_modules,dist,build" \
  --timeout 600 \
  --output report.json
```

### Memory-Constrained Systems

```bash
# Reduce analysis scope
cadence analyze /path/to/repo \
  --max-commits 100 \
  --depth 50 \
  --output report.json

# Monitor resource usage
time cadence analyze /path/to/repo --output report.json
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: Repository Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-go@v2
      
      - name: Install Cadence
        run: make build
      
      - name: Analyze Repository
        run: |
          ./bin/cadence analyze . \
            --output analysis.json \
            --json
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('analysis.json'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Cadence Analysis\n\n**Score:** ${report.analysis.total_score}\n**Confidence:** ${report.analysis.confidence}`
            });
```

### GitLab CI

```yaml
analyze_repository:
  image: golang:1.24
  script:
    - make build
    - ./bin/cadence analyze . --output analysis.json --json
  artifacts:
    reports:
      codequality: analysis.json
```

## Best Practices Summary

1. **Establish Baseline** - Understand normal patterns for your project
2. **Use Context** - Consider project phase, team size, and activities
3. **Review Manually** - Don't rely solely on automated scores
4. **Track Trends** - Monitor changes over time
5. **Adjust Thresholds** - Calibrate for your specific needs
6. **Combine Signals** - Look for multiple strategy agreements
7. **Verify Results** - Double-check high-confidence flagged commits
8. **Document Decisions** - Keep records of analysis and conclusions

## Next Steps

- [Git Analysis Guide](../git-analysis-guide) - Detailed Git strategy explanations
- [Web Analysis Guide](../web-analysis-guide) - Analyze websites for AI content
- [Advanced Configuration](../advanced-configuration) - Custom patterns and thresholds
- [Troubleshooting Guide](../troubleshooting) - Resolve common issues
