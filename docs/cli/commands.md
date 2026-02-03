# CLI Commands Reference

Complete documentation of all Cadence CLI commands with options and examples.

## Root Command

```bash
cadence --help
```

Shows available commands:

```
Cadence analyzes git repositories and websites to detect AI-generated content.

Capabilities:
  • Git commits: Detects suspicious commits via patterns, velocity, and anomalies
  • Websites: Analyzes page content for AI-generated text patterns
  • Optional AI validation: Uses OpenAI GPT-4o-mini for expert analysis

Usage:
  cadence [command]

Available Commands:
  analyze     Analyze repository for suspicious commits
  config      Manage configuration
  web         Analyze a website for AI-generated content
  webhook     Run the Cadence webhook server
  version     Show version information
  help        Help about any command

Global Flags:
  --config string   config file path
  -h, --help        help for cadence
```

## analyze - Git Repository Analysis

Analyzes Git repositories to detect commits that may have been generated or heavily modified by AI.

### Usage

```bash
cadence analyze <repository> --output <file>
```

### Arguments

- `<repository>` - Local directory path or GitHub URL to a Git repository

### Flags

```bash
-o, --output string              Output file path (required, .json or .txt)
    --suspicious-additions int   Flag commits with more than N additions
    --suspicious-deletions int   Flag commits with more than N deletions
    --max-additions-pm float     Max additions per minute (0 to disable)
    --max-deletions-pm float     Max deletions per minute (0 to disable)
    --min-time-delta int         Min seconds between commits (0 to disable)
    --branch string              Branch to analyze (default: auto-detect)
    --exclude-files strings      File patterns to exclude (*.log, *.tmp, etc)
    --config string              Config file path
```

### Examples

**Analyze local repository:**
```bash
cadence analyze /path/to/repo --output report.json
```

**Analyze GitHub repository:**
```bash
cadence analyze https://github.com/owner/repo --output report.json
```

**Analyze specific branch:**
```bash
cadence analyze https://github.com/owner/repo/tree/develop --output report.json
```

**Custom detection thresholds:**
```bash
cadence analyze /path/to/repo \
  --output report.json \
  --suspicious-additions 1000 \
  --suspicious-deletions 500 \
  --max-additions-pm 100 \
  --max-deletions-pm 500
```

**Exclude lock files and generated code:**
```bash
cadence analyze /path/to/repo \
  --output report.json \
  --exclude-files "package-lock.json,yarn.lock,.gitignore,dist/*"
```

**With configuration file:**
```bash
cadence analyze /path/to/repo \
  --config cadence.yml \
  --output report.json
```

### Output

The command creates a report in the `reports/` directory. Reports are automatically formatted based on file extension:

**JSON output** contains:
- Flagged commits with suspicion scores
- Per-strategy analysis for each commit
- Repository statistics (total commits, authors, date range)
- Threshold configuration used

**Text output** contains:
- Human-readable summary
- Flagged commits with scores
- Analysis breakdown
- Recommendations

### How It Works

1. **Repository loading** - Reads Git history and commit metadata
2. **Analysis** - Applies 13+ detection strategies to each commit
3. **Scoring** - Combines strategy results into suspicion scores
4. **Detection** - Flags commits exceeding configured thresholds
5. **AI validation** (optional) - OpenAI validation if enabled in config
6. **Reporting** - Generates formatted report with findings

## web - Website Content Analysis

Analyzes website content to detect AI-generated text ("slop").

### Usage

```bash
cadence web <url> [flags]
```

### Arguments

- `<url>` - URL of website to analyze (e.g., https://example.com)

### Flags

```bash
-o, --output string   Output file path (saved in reports/ directory)
-v, --verbose         Show detailed analysis with specific findings
-j, --json            Output in JSON format (default: human-readable text)
    --config string   Config file path
```

### Examples

**Analyze website:**
```bash
cadence web https://example.com
```

**Save to JSON report:**
```bash
cadence web https://example.com --json --output example-analysis.json
```

**Verbose output with details:**
```bash
cadence web https://example.com --verbose --output example-detailed.json
```

**Text format report:**
```bash
cadence web https://example.com --output example-report.txt
```

**With AI validation:**
```bash
cadence web https://example.com \
  --config cadence.yml \
  --json \
  --output analysis.json
```

### Output

**Verbose mode** shows:
- Word count and heading count
- Content quality score
- Detected patterns with confidence scores
- Specific text examples from the page

**JSON format** includes:
- URL and fetch timestamp
- Content metadata (words, headings, structure)
- Analysis results with scores
- Detected patterns and reasoning
- AI validation (if enabled)

**Text format** provides:
- Human-readable analysis summary
- List of detected patterns
- Confidence scores
- Recommendations

### How It Works

1. **Fetching** - Downloads page HTML with proper HTTP headers
2. **Extraction** - Parses HTML and extracts meaningful content (body text, headings, metadata)
3. **Filtering** - Removes navigation, boilerplate, code blocks
4. **Analysis** - Examines text for 7+ AI-generation patterns
5. **AI validation** (optional) - Uses OpenAI to provide expert analysis
6. **Reporting** - Generates formatted report with findings

## config - Configuration Management

Creates and manages Cadence configuration files.

### Usage

```bash
cadence config [init]
```

### Subcommands

#### `cadence config` - Show default configuration

Prints sample configuration to stdout:

```bash
cadence config
cadence config > cadence.yml
```

#### `cadence config init` - Create configuration file

Creates `.cadence.yaml` in current directory:

```bash
cadence config init
```

### Configuration File Format

Cadence uses YAML format for configuration:

```yaml
# Cadence Configuration - AI-Generated Code Detection
# Analyzes git repositories to detect potential AI-generated code patterns

thresholds:
  # SIZE-BASED DETECTION
  suspicious_additions: 500
  suspicious_deletions: 1000
  
  # VELOCITY-BASED DETECTION
  max_additions_per_min: 100
  max_deletions_per_min: 500
  
  # TIMING-BASED DETECTION
  min_time_delta_seconds: 60
  
  # FILE DISPERSION DETECTION
  max_files_per_commit: 50
  
  # RATIO-BASED DETECTION
  max_addition_ratio: 0.95

# Exclude specific files from analysis
exclude_files:
  - package-lock.json
  - yarn.lock
  - "*.log"

# Optional: AI analysis configuration
ai:
  enabled: false
  provider: openai
  model: gpt-4o-mini
  api_key: "${OPENAI_API_KEY}"

# Optional: Webhook configuration
webhook:
  port: 3000
  host: 0.0.0.0
  secret: "${CADENCE_WEBHOOK_SECRET}"
  max_workers: 4
```

### Usage Workflow

1. **Generate configuration:**
   ```bash
   cadence config init
   ```

2. **Customize thresholds** in `.cadence.yaml` for your use case

3. **Use in analysis:**
   ```bash
   cadence analyze /path/to/repo --config cadence.yml --output report.json
   ```

### Configuration Examples

**Sensitive/Strict Analysis:**
```yaml
thresholds:
  suspicious_additions: 300
  suspicious_deletions: 500
  max_additions_per_min: 50
  max_files_per_commit: 20
```

**Quick/Fast Analysis:**
```yaml
thresholds:
  suspicious_additions: 1000
  suspicious_deletions: 2000
  max_additions_per_min: 200
  max_files_per_commit: 100
```

**Enable AI Validation:**
```yaml
ai:
  enabled: true
  provider: openai
  model: gpt-4o-mini
  api_key: "${OPENAI_API_KEY}"
```

## webhook - Webhook Server

Runs a webhook server for Git platform integration. The server listens for push events and triggers analysis.

### Usage

```bash
cadence webhook [flags]
```

### Flags

```bash
-p, --port int           Webhook server port (default: 3000)
    --host string        Host to listen on (default: 0.0.0.0)
    --secret string      Webhook secret for signature verification (required)
    --workers int        Number of concurrent workers (default: 4)
    --read-timeout int   Request read timeout in seconds (default: 30)
    --write-timeout int  Request write timeout in seconds (default: 30)
    --config string      Config file path
```

### Examples

**Start webhook server (default port 3000):**
```bash
cadence webhook --secret "your-webhook-secret"
```

**Custom port:**
```bash
cadence webhook --port 8080 --secret "your-webhook-secret"
```

**With configuration file:**
```bash
cadence webhook --config cadence.yml
```

**Custom worker configuration:**
```bash
cadence webhook \
  --port 8000 \
  --secret "webhook-secret" \
  --workers 8 \
  --read-timeout 60 \
  --write-timeout 60
```

### Setup Instructions

**1. Start the webhook server:**
```bash
cadence webhook --port 8080 --secret "my-secret-key"
```

**2. Configure GitHub webhook:**
- Go to Repository Settings → Webhooks → Add webhook
- Payload URL: `https://your-server.com:8080/webhook`
- Content type: `application/json`
- Secret: Same as `--secret` above
- Events: Select "Push events"
- Active: Check enabled

**3. Server processes events:**
- Receives push notifications
- Clones repository automatically
- Runs analysis on new commits
- Stores results in `reports/` directory

### How It Works

1. **Server startup** - Listens on configured host and port
2. **Webhook received** - Git platform sends push event
3. **Verification** - Validates webhook signature using secret
4. **Cloning** - Automatically clones the repository
5. **Analysis** - Runs detection analysis on new commits
6. **Results** - Saves analysis report to `reports/` directory

## version - Version Information

Display Cadence version and build information.

### Usage

```bash
cadence version
```

### Output

```
Cadence version v2.1.0
Git Commit: abc123def456
Build Time: 2024-01-15T10:30:00Z
```

## help - Command Help

Get help about any command.

### Usage

```bash
cadence help                # Show all commands
cadence help analyze        # Help for analyze command
cadence help web            # Help for web command
cadence help config         # Help for config command
cadence help webhook        # Help for webhook command
```

## Global Flags

These flags work with any command:

```bash
--config string   Path to configuration file (looks for cadence.yml in current directory)
-h, --help        Show help for command
--version         Show version information
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Analysis or runtime error |

## Environment Variables

Configure Cadence via environment variables (overridden by CLI flags):

```bash
# Configuration file location
CADENCE_CONFIG=/path/to/cadence.yml

# AI provider credentials
OPENAI_API_KEY=sk-...

# Webhook settings
CADENCE_WEBHOOK_PORT=8080
CADENCE_WEBHOOK_SECRET=webhook-secret
```

## Common Workflows

### Quick Repository Analysis

```bash
# Create default config
cadence config init

# Run analysis
cadence analyze /path/to/repo --output report.json

# View results
cat reports/report.json
```

### GitHub Repository Analysis

```bash
# Analyze directly from GitHub (no clone needed)
cadence analyze https://github.com/owner/repo --output repo-analysis.json
```

### Website Content Analysis

```bash
# Analyze single website
cadence web https://blog.example.com --output blog-analysis.json

# Verbose output with details
cadence web https://blog.example.com --verbose --output detailed.json

# Batch analyze multiple sites
for url in site1.com site2.com site3.com; do
  cadence web "https://$url" --output "reports/${url}_analysis.json"
done
```

### Continuous Monitoring with Webhook

```bash
# Start webhook server
cadence webhook --port 8080 --secret "my-secret"

# Configure GitHub webhook
# (Settings → Webhooks → Add webhook pointing to your server)

# Server automatically analyzes on push events
```

### Batch Repository Analysis

```bash
# Create list of repositories
repos=(
  "https://github.com/org/repo1"
  "https://github.com/org/repo2"
  "https://github.com/org/repo3"
)

# Analyze each
for repo in "${repos[@]}"; do
  name=$(echo "$repo" | rev | cut -d'/' -f1 | rev)
  cadence analyze "$repo" --output "reports/analysis_${name}.json"
done
```

## Tips and Tricks

### Save Multiple Configurations

Create different configs for different scenarios:

```bash
# Strict analysis
cadence config init --output cadence-strict.yml
# Edit to lower thresholds

# Quick analysis
cadence config init --output cadence-fast.yml
# Edit to higher thresholds

# Use as needed
cadence analyze /repo --config cadence-strict.yml -o strict.json
cadence analyze /repo --config cadence-fast.yml -o fast.json
```

### Filter JSON Results

```bash
# Extract just the flagged commits
cadence analyze /repo -o - --json | jq '.suspicious_commits'

# Count flagged commits
cadence analyze /repo -o - --json | jq '.suspicious_commits | length'
```

### Scheduled Analysis

Create a cron job for automated analysis:

```bash
# Run daily at 2 AM
0 2 * * * cadence analyze /repo \
  --config /etc/cadence/cadence.yml \
  --output /var/log/cadence/$(date +\%Y-\%m-\%d).json
```

## Troubleshooting

### Command Not Found

Ensure Cadence is in your PATH:

```bash
export PATH="$(pwd)/bin:$PATH"
cadence --help
```

Or use full path:

```bash
./bin/cadence --help
```

### Config File Not Found

Specify config explicitly or place in current directory:

```bash
cadence analyze /repo --config /path/to/cadence.yml --output report.json
```

### Permission Denied

Make the binary executable:

```bash
chmod +x ./bin/cadence
./bin/cadence --help
```

### Webhook Not Receiving Events

1. Check firewall allows port (default 3000)
2. Verify webhook secret matches GitHub configuration
3. Check server logs for connection issues
4. Ensure public URL is accessible from GitHub

## Next Steps

- [Detection Strategies](/docs/cli/detection-strategies) - Learn how each strategy works
- [Repository Analysis](/docs/analysis/repository) - Real-world analysis examples
- [Configuration Guide](/docs/configuration) - Advanced settings
