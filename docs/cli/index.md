# CLI Reference

Cadence is a command-line tool for detecting AI-generated content in Git repositories and websites. The CLI provides powerful analysis capabilities with flexible output formats and extensive configuration options.

## What is Cadence?

Cadence analyzes:

- **Git repositories** - Examines commit patterns, metadata, and code changes to detect suspicious commits
- **Websites** - Analyzes page content for patterns common in AI-generated text
- **Optional AI validation** - Uses OpenAI GPT-4o-mini to provide expert analysis on detected content

## Available Commands

| Command | Purpose |
|---------|---------|
| [`analyze`](/docs/cli/commands#analyze---git-repository-analysis) | Analyze Git repositories for suspicious commits |
| [`web`](/docs/cli/commands#web---website-content-analysis) | Scan websites for AI-generated content |
| [`webhook`](/docs/cli/commands#webhook---webhook-server) | Run a webhook server for Git platform integration |
| [`config`](/docs/cli/commands#config---configuration-management) | Generate and manage configuration files |
| [`version`](/docs/cli/commands#version---version-information) | Display version and build information |

## Quick Start

### Analyze a Local Repository

```bash
cadence config init          # Create default config
cadence analyze . -o report.json
```

### Analyze a GitHub Repository

```bash
cadence analyze https://github.com/owner/repo -o report.json
```

### Analyze Website Content

```bash
cadence web https://example.com -o report.json --verbose
```

### Start Webhook Server

```bash
cadence webhook --port 8080 --secret "webhook-secret"
```

## Global Flags

These flags work with any command:

```bash
--config string   Path to configuration file
-h, --help        Show command help
--version         Show version information
```

## Detection Overview

Cadence uses **13+ detection strategies** to identify suspicious content:

**Git Analysis Strategies:**
- Velocity analysis (additions/deletions per minute)
- Size analysis (commit line count thresholds)
- Timing analysis (commit intervals and patterns)
- File dispersion (files modified per commit)
- Ratio analysis (addition vs deletion balance)
- Commit message analysis (generic message detection)
- Naming pattern analysis (variable and function names)
- Structural consistency (code organization patterns)
- Error handling analysis (missing error handling)
- File extension patterns (file types being modified)
- Statistical anomalies (deviation from baseline)
- Burst pattern analysis (rapid commit clustering)
- Timing anomaly detection (unusual commit timing)

**Web Content Analysis Strategies:**
- Generic language detection (overused phrases)
- Perfect grammar detection (suspiciously uniform grammar)
- Placeholder pattern detection (filler content)
- Boilerplate content detection (reused text)
- Content uniformity (consistent structure across sections)
- Specificity analysis (lack of concrete details)
- Structural pattern detection (identical formatting patterns)

## Command Details

See [CLI Commands](/docs/cli/commands) for complete reference including all flags, options, and examples.

See [Detection Strategies](/docs/cli/detection-strategies) for in-depth documentation on each detection method.

## Configuration

Cadence uses YAML configuration files for thresholds and settings. Generate a default config with:

```bash
cadence config init
```

This creates `.cadence.yaml` with detection thresholds:

```yaml
thresholds:
  # Size-based detection
  suspicious_additions: 500
  suspicious_deletions: 1000
  
  # Velocity-based detection
  max_additions_per_min: 100
  max_deletions_per_min: 500
  
  # Timing-based detection
  min_time_delta_seconds: 60
  
  # File dispersion
  max_files_per_commit: 50
  
  # Ratio-based detection
  max_addition_ratio: 0.95
```

## Output Formats

Cadence supports multiple output formats, automatically detected from file extension:

**JSON Format:**
```bash
cadence analyze /repo -o report.json
```

**Text Format:**
```bash
cadence analyze /repo -o report.txt
```

## Common Workflows

**Quick repository scan:**
```bash
cadence analyze /path/to/repo -o report.json
```

**Analyze GitHub repository:**
```bash
cadence analyze https://github.com/owner/repo -o report.json
```

**Website analysis with details:**
```bash
cadence web https://example.com --verbose -o report.json
```

**Set up continuous monitoring:**
```bash
cadence webhook --port 8080 --secret "my-secret"
# Configure GitHub webhook to point to your server
```

## Next Steps

- [CLI Commands](/docs/cli/commands) - Complete reference with all options
- [Detection Strategies](/docs/cli/detection-strategies) - Learn how each strategy works
- [Repository Analysis](/docs/analysis/repository) - Real-world analysis examples
- [Configuration](/docs/configuration) - Advanced settings and customization
