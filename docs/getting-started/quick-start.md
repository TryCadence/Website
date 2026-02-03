# Quick Start

Get started analyzing repositories and websites in 5 minutes.

## Prerequisite

You have [Cadence installed](/docs/getting-started/installation). Verify with:

```bash
cadence version
```

## Analyze Your First Repository

### Local Repository

Analyze the current directory:

```bash
cadence analyze . -o report.json
```

This creates a report at `reports/report.json` with:
- Flagged commits with suspicion scores
- Per-strategy analysis breakdown
- Repository statistics

### Remote Repository (GitHub)

Analyze a GitHub repository without cloning:

```bash
cadence analyze https://github.com/owner/repo -o report.json
```

Cadence automatically:
1. Clones the repository
2. Analyzes all commits
3. Saves results to `reports/report.json`
4. Cleans up temporary files

### Specific Branch

Analyze only a specific branch:

```bash
cadence analyze https://github.com/owner/repo/tree/develop -o report.json
```

## Customize Detection Thresholds

### Create a Configuration File

```bash
cadence config init
```

This creates `.cadence.yaml` with default detection thresholds. Edit to customize:

```yaml
thresholds:
  # Size-based detection
  suspicious_additions: 500      # Flag commits with 500+ additions
  suspicious_deletions: 1000     # Flag commits with 1000+ deletions
  
  # Velocity-based detection
  max_additions_per_min: 100     # Flag if 100+ additions/minute
  max_deletions_per_min: 500     # Flag if 500+ deletions/minute
  
  # Timing-based detection
  min_time_delta_seconds: 60     # Flag commits within 60 seconds

# Exclude specific files
exclude_files:
  - package-lock.json
  - yarn.lock
  - "*.log"
```

### Run Analysis with Configuration

```bash
cadence analyze /path/to/repo --config cadence.yaml -o report.json
```

Or override individual settings:

```bash
cadence analyze /path/to/repo \
  --suspicious-additions 1000 \
  --max-additions-pm 150 \
  -o report.json
```

## Analyze Website Content

Detect AI-generated text on websites:

```bash
cadence web https://example.com -o report.json
```

### Verbose Output

Show detailed analysis with content quality metrics:

```bash
cadence web https://example.com --verbose -o report.json
```

Shows:
- Word count and heading statistics
- Content quality score
- Detected patterns with confidence scores
- Specific text examples from the page

### Different Output Formats

**JSON format:**
```bash
cadence web https://example.com --json -o report.json
```

**Text format (human-readable):**
```bash
cadence web https://example.com -o report.txt
```

## Understanding Results

### Report Location

Reports are saved to `reports/` directory by default:

```bash
# View the report
cat reports/report.json
```

### JSON Report Structure

```json
{
  "suspicious_commits": [
    {
      "hash": "abc123",
      "timestamp": "2024-01-15T10:30:00Z",
      "author": "user@example.com",
      "score": 0.85,
      "strategies": {
        "velocity": 0.9,
        "timing": 0.8,
        "file_dispersion": 0.7
      }
    }
  ],
  "stats": {
    "total_commits": 100,
    "flagged_commits": 3,
    "risk_level": "medium"
  }
}
```

### Suspicion Scores

Scores range from 0 (not suspicious) to 1.0 (highly suspicious):

- **0.0 - 0.3** - Likely human-written
- **0.3 - 0.6** - Possibly AI-generated, review needed
- **0.6 - 0.8** - Likely AI-generated
- **0.8 - 1.0** - Very likely AI-generated

### Strategy Breakdown

Each flagged commit shows which strategies triggered:

- **Velocity** - Too many additions/deletions per minute
- **Timing** - Unusual commit timing (multiple commits quickly)
- **Size** - Single commit too large
- **File Dispersion** - Changes affecting too many files
- **Ratio** - Imbalanced additions/deletions
- Plus 8+ additional strategies

See [Detection Strategies](/docs/cli/detection-strategies) for details on each.

## Common Workflows

### Analyze Multiple Repositories

```bash
repos=(
  "https://github.com/org/repo1"
  "https://github.com/org/repo2"
  "https://github.com/org/repo3"
)

for repo in "${repos[@]}"; do
  name=$(echo "$repo" | rev | cut -d'/' -f1 | rev)
  cadence analyze "$repo" -o "$name-analysis.json"
done
```

### Check Specific Branch for PR

```bash
# Analyze feature branch
cadence analyze https://github.com/owner/repo/tree/feature-branch \
  -o branch-analysis.json

# Compare with main
cadence analyze https://github.com/owner/repo/tree/main \
  -o main-analysis.json

# Compare results
diff branch-analysis.json main-analysis.json
```

### Monitor Websites

```bash
# Analyze multiple sites
for site in blog.example.com docs.example.com learn.example.com; do
  cadence web "https://$site" -o "reports/${site}_analysis.json"
done
```

### Batch Process with Makefile

If you build from source, use Make for common tasks:

```bash
make build    # Build latest version
make test     # Run tests
make clean    # Clean artifacts
```

## Enable AI Validation (Optional)

For advanced analysis using OpenAI GPT-4o-mini:

### 1. Set API Key

```bash
export OPENAI_API_KEY="sk-..."
```

### 2. Enable in Configuration

Edit `.cadence.yaml`:

```yaml
ai:
  enabled: true
  provider: openai
  model: gpt-4o-mini
```

### 3. Run Analysis

```bash
cadence analyze /path/to/repo --config cadence.yaml -o report.json
```

The report will include AI analysis in the `ai_analysis` field.

## Troubleshooting

### "Repository not found"

Ensure the path or URL is correct:

```bash
# Local path must exist
cadence analyze ./existing-repo -o report.json

# GitHub URL format
cadence analyze https://github.com/owner/repo -o report.json
```

### "Config file not found"

Place `cadence.yaml` in the directory where you run the command, or specify the path:

```bash
cadence analyze /repo --config /path/to/cadence.yaml -o report.json
```

### "Content too short for analysis" (web)

Web analysis requires at least 50 words of content. Try a different page or check the website has actual content (not a redirect or error page).

## Next Steps

### Learn More

- [CLI Commands](/docs/cli/commands) - All commands and options
- [Detection Strategies](/docs/cli/detection-strategies) - How analysis works
- [Configuration](/docs/getting-started/configuration) - Advanced settings

### Real-World Usage

- [Repository Analysis Guide](/docs/analysis/repository) - Best practices and examples
- [Web Analysis Guide](/docs/analysis/web) - Website monitoring patterns

### Integration

- [CI/CD Integration](/docs/integrations) - Automate analysis in pipelines
