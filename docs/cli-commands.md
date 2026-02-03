---
title: CLI Commands Reference
description: Complete reference of all Cadence command-line interface commands
---

# CLI Commands Reference

Complete documentation of all Cadence CLI commands with examples and options.

## Root Command

```bash
cadence --help
```

Shows all available commands:

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
  completion  Generate shell completion script
  help        Help about any command

Global Flags:
  --config string   config file path
  -h, --help        help for cadence
```

## Core Commands

### 1. analyze - Git Repository Analysis

Analyze Git repositories for AI-generated commits.

#### Basic Usage

```bash
cadence analyze <repository> --output <file>
```

#### Arguments

- `<repository>` - Path to Git repository (local path or GitHub URL)

#### Options

```bash
-o, --output string              Output file path (required, .json or .txt)
    --suspicious-additions int64  Flag commits with more than N additions (0 to disable)
    --suspicious-deletions int64  Flag commits with more than N deletions (0 to disable)
    --max-additions-pm float     Max additions per minute (0 to disable)
    --max-deletions-pm float     Max deletions per minute (0 to disable)
    --min-time-delta int64       Min seconds between commits (0 to disable)
    --branch string              Branch to analyze
    --exclude-files strings      File patterns to exclude (e.g., *.log,*.tmp)
    --config string              Config file path
```

#### Examples

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
cadence analyze https://github.com/owner/repo/tree/main --output report.json
```

**With custom thresholds:**
```bash
cadence analyze /path/to/repo \
  --output report.json \
  --suspicious-additions 1000 \
  --suspicious-deletions 500 \
  --max-additions-pm 100 \
  --max-deletions-pm 500
```

**Exclude specific files:**
```bash
cadence analyze /path/to/repo \
  --output report.json \
  --exclude-files "package-lock.json,yarn.lock,.gitignore"
```

**With config file:**
```bash
cadence analyze /path/to/repo \
  --config cadence.yml \
  --output report.json
```

#### Output Formats

Output format is automatically detected from file extension:

**JSON Output (.json):**
```bash
cadence analyze /path/to/repo --output report.json
```

**Text Output (.txt):**
```bash
cadence analyze /path/to/repo --output report.txt
```

### 2. web - Website Content Analysis

Analyze websites for AI-generated content.

#### Basic Usage

```bash
cadence web <url> [flags]
```

#### Arguments

- `<url>` - URL of website to analyze (e.g., https://example.com)

#### Options

```bash
-o, --output string    Output file path (format: .json or .txt)
    --verbose          Show detailed analysis with specific findings
    --json             Output as JSON (default: human-readable text)
    --config string    Config file path
```

#### Examples

**Analyze website:**
```bash
cadence web https://example.com --output report.json
```

**Verbose output (shows detailed findings):**
```bash
cadence web https://example.com --verbose --output report.json
```

**Text format:**
```bash
cadence web https://example.com --output report.txt
```

**JSON format:**
```bash
cadence web https://example.com --json --output report.json
```

**With AI validation:**
```bash
cadence web https://example.com \
  --config cadence.yml \
  --json \
  --output report.json
```

#### Output Formats

**JSON Output:**
```json
{
  "url": "https://example.com",
  "content": {
    "title": "Page Title",
    "word_count": 1500
  },
  "analysis": {
    "total_score": 0.72,
    "confidence": 0.85,
    "likely_ai_generated": true
  }
}
```

**Text Output:**
Human-readable report with highlighted sections and explanations.

### 3. config - Configuration Management

Create and manage Cadence configuration files.

#### Subcommands

**Show default configuration:**
```bash
cadence config
```

Prints sample configuration to stdout:
```bash
cadence config > cadence.yml
```

**Create configuration file:**
```bash
cadence config init
```

Creates `.cadence.yaml` in current directory with default settings.

**Use custom config:**
```bash
cadence analyze /path/to/repo --config /path/to/config.yml --output report.json
```

#### Configuration File Format

YAML format with thresholds and settings:

```yaml
# Cadence Configuration
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
  - package-lock.json
  - yarn.lock
```

#### Usage Workflow

1. **Generate default configuration:**
   ```bash
   cadence config init
   ```

2. **Customize the generated `.cadence.yaml`:**
   ```bash
   # Edit settings in .cadence.yaml
   ```

3. **Use in analysis:**
   ```bash
   cadence analyze /path/to/repo --config cadence.yml --output report.json
   ```

### 4. webhook - Webhook Server

Run the Cadence webhook server for Git platform integration.

#### Basic Usage

```bash
cadence webhook [flags]
```

#### Options

```bash
    --port int           Webhook server port (default: 8080)
    --host string        Host to listen on (default: localhost)
    --secret string      Webhook secret for verification
    --max-workers int    Maximum concurrent workers
    --config string      Config file path
```

#### Examples

**Start webhook server (default port 8080):**
```bash
cadence webhook
```

**Custom port:**
```bash
cadence webhook --port 9000
```

**With webhook secret:**
```bash
cadence webhook --port 8080 --secret "your-webhook-secret"
```

**With configuration file:**
```bash
cadence webhook --config cadence.yml --port 8080
```

#### Integration Steps

1. **Start webhook server:**
   ```bash
   cadence webhook --port 8080
   ```

2. **Configure GitHub webhook:**
   - Go to repository Settings → Webhooks
   - Add webhook: `https://your-server.com:8080/webhook`
   - Set secret for verification
   - Select events to trigger analysis

3. **Server processes push events:**
   - Clones repository automatically
   - Runs analysis on new commits
   - Returns results

### 5. version - Version Information

Display Cadence version and build information.

#### Basic Usage

```bash
cadence version
```

#### Output

```
Cadence version v2.1.0
Git Commit: abc123def456
Build Time: 2024-01-15T10:30:00Z
```

### 6. help - Command Help

Get help about any command.

#### Usage

```bash
cadence help
cadence help analyze
cadence help web
cadence help config
cadence help webhook
```

## Global Flags

These flags work with any command:

```bash
--config string   Path to configuration file
-h, --help        Show help for command
--version         Show version information
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Analysis or runtime error |
| 2 | Configuration error |
| 3 | Repository not found |
| 4 | Network error |

## Environment Variables

Configure Cadence via environment variables:

```bash
# Configuration file location
export CADENCE_CONFIG=/path/to/cadence.yml

# AI provider settings
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...

# Webhook settings
export CADENCE_WEBHOOK_PORT=8080
export CADENCE_WEBHOOK_SECRET=secret

# Git settings
export CADENCE_GIT_TIMEOUT=600
```

## Common Workflows

### Workflow 1: Quick Analysis

```bash
# Create config
cadence config init

# Customize settings
# (edit .cadence.yaml)

# Run analysis
cadence analyze /path/to/repo --output report.json

# View results
cat report.json
```

### Workflow 2: GitHub Repository Analysis

```bash
# Analyze directly from GitHub
cadence analyze https://github.com/owner/repo \
  --suspicious-additions 1000 \
  --output github-repo-analysis.json

# View results
cat github-repo-analysis.json
```

### Workflow 3: Webhook Integration

```bash
# Start webhook server
cadence webhook --port 8080 --secret "my-secret"

# Configure GitHub to send webhooks
# (Settings → Webhooks → Add webhook)

# Server automatically analyzes on push events
```

### Workflow 4: Web Analysis

```bash
# Analyze website content
cadence web https://blog.example.com --output web-analysis.json

# Verbose report
cadence web https://blog.example.com --verbose --output detailed.json

# Multiple websites
for url in site1.com site2.com site3.com; do
  cadence web "https://$url" --output "${url}_analysis.json"
done
```

### Workflow 5: Batch Analysis

```bash
# Analyze multiple repositories
repos=(
  "https://github.com/org/repo1"
  "https://github.com/org/repo2"
  "https://github.com/org/repo3"
)

for repo in "${repos[@]}"; do
  name=$(echo "$repo" | cut -d'/' -f5)
  cadence analyze "$repo" --output "analysis_${name}.json"
done
```

## Shell Completion

Generate shell completion for faster command entry:

```bash
# Bash
cadence completion bash | sudo tee /etc/bash_completion.d/cadence

# Zsh
cadence completion zsh | sudo tee /usr/share/zsh/site-functions/_cadence

# Fish
cadence completion fish | sudo tee /etc/fish/completions/cadence.fish
```

## Tips and Tricks

### Save Common Configurations

Create multiple config files for different scenarios:

```bash
# Sensitive code analysis
cadence config init --output cadence-strict.yml
# Edit: lower thresholds

# Quick scanning
cadence config init --output cadence-fast.yml
# Edit: higher thresholds

# Use as needed
cadence analyze repo --config cadence-strict.yml --output strict.json
cadence analyze repo --config cadence-fast.yml --output fast.json
```

### Pipe Results

```bash
# Format output
cadence analyze /repo --json --output - | jq .analysis.total_score

# Compare results
cadence analyze repo1 --json --output - > repo1.json
cadence analyze repo2 --json --output - > repo2.json
diff repo1.json repo2.json
```

### Parallel Analysis

```bash
# Analyze multiple repos in parallel
parallel cadence analyze {} --output {/.}.json ::: /repo1 /repo2 /repo3
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

```bash
# Ensure cadence is in PATH
export PATH="$(pwd)/bin:$PATH"
cadence --help

# Or use full path
./bin/cadence --help
```

### Config File Not Found

```bash
# Specify config explicitly
cadence analyze /repo --config /path/to/cadence.yml --output report.json

# Or place in current directory
cp /template/cadence.yml ./cadence.yml
cadence analyze /repo --output report.json
```

### Permission Denied

```bash
# Make executable
chmod +x ./bin/cadence

# Try again
./bin/cadence --help
```

## Next Steps

- [Quick Reference](../quick-reference) - Common commands quick lookup
- [Configuration Guide](../configuration) - Detailed config options
- [Advanced Configuration](../advanced-configuration) - Advanced setup
- [Git Analysis Guide](../git-analysis-guide) - Deep dive into analysis
- [Troubleshooting](../troubleshooting) - Resolve issues
