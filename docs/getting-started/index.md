# Getting Started

Welcome to Cadence! This guide will help you install, configure, and start analyzing Git repositories and websites for AI-generated content.

## What is Cadence?

Cadence is a command-line tool that detects AI-generated content using pattern-based analysis:

- **Git Analysis** - Examines commit patterns, velocity, timing, and code changes
- **Web Analysis** - Analyzes website content for AI-generation patterns
- **Optional AI Validation** - OpenAI GPT-4o-mini provides expert analysis

## Prerequisites

Before getting started, ensure you have:

- **Git** - For repository analysis (usually pre-installed)
- **Go 1.24+** - Required for building from source

Check your Go version:

```bash
go version
```

If you don't have Go, [download it here](https://golang.org/dl).

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/TryCadence/Cadence.git
cd Cadence
```

### 2. Build Cadence

**On macOS/Linux:**
```bash
make build
```

**On Windows (PowerShell):**
```powershell
.\scripts\build.ps1
```

**Or with Go directly (all platforms):**
```bash
go build -o cadence ./cmd/cadence
```

### 3. Verify Installation

```bash
./cadence version
```

You should see the version output.

### 4. Analyze Your First Repository

```bash
./cadence analyze . -o report.json
```

That's it! You've completed your first analysis. The report is saved to `reports/report.json`.

## Next Steps

### New to Cadence?
Start with [Quick Start](/docs/getting-started/quick-start) for step-by-step examples.

### Want to Customize Detection?
See [Configuration](/docs/getting-started/configuration) to adjust thresholds.

### Need Command Reference?
Check [CLI Commands](/docs/cli/commands) for all options.

### Looking for Quick Lookups?
Use [Quick Reference](/docs/getting-started/quick-reference) for common commands.

## Installation Methods

### Method 1: Build from Source (Recommended)

Best for development and having the latest version:

```bash
git clone https://github.com/TryCadence/Cadence.git
cd Cadence
make build
./bin/cadence --help
```

### Method 2: Go Install

Install directly from Go:

```bash
go install github.com/TryCadence/Cadence/cmd/cadence@latest
```

Then run:
```bash
cadence --help
```

### Method 3: Manual Build

```bash
mkdir cadence && cd cadence
git clone https://github.com/TryCadence/Cadence.git .
go build -o cadence ./cmd/cadence
./cadence --help
```

## Adding to PATH (Optional)

Make Cadence available from anywhere:

**macOS/Linux:**
```bash
sudo cp cadence /usr/local/bin/
```

**Windows (PowerShell as Admin):**
```powershell
$env:PATH += ";$(Get-Location)"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, "User")
```

## Common First Steps

### 1. Create a Configuration File

```bash
cadence config init
# Creates .cadence.yaml with default thresholds
```

### 2. Analyze a Repository

```bash
cadence analyze /path/to/repo -o report.json
```

### 3. Analyze a Website

```bash
cadence web https://example.com -o report.json
```

### 4. View Results

```bash
cat report.json
```

## Troubleshooting

### "command not found: cadence"

Ensure the binary is in your PATH or use the full path:
```bash
./cadence --help
# Or
/path/to/cadence --help
```

### Build fails

Make sure Go 1.24+ is installed:
```bash
go version
```

If you have an older version, update from [golang.org/dl](https://golang.org/dl).

### Permission denied (macOS/Linux)

Make the binary executable:
```bash
chmod +x ./cadence
./cadence --help
```

## Next: Quick Start

Ready to analyze? Head to [Quick Start](/docs/getting-started/quick-start) for step-by-step examples of analyzing repositories and websites.
