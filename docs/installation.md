---
title: Installation
description: Get Cadence up and running on your system
---

# Installation

## Prerequisites

Before installing Cadence, ensure you have the following:

- **Go 1.24 or later** - [Download Go](https://golang.org/dl)
- **Git** - Required for repository analysis (typically pre-installed)

## Verify Go Installation

Check your Go version:

```bash
$ go version
go version go1.24 linux/amd64
```

## Build from Source

### 1. Clone the Repository

```bash
$ git clone https://github.com/CodeMeAPixel/cadence-tool.git
$ cd cadence-tool
```

### 2. Build the Binary

**Using Make (Linux/macOS):**

```bash
$ make build
# Binary will be created at ./bin/cadence
```

**Using PowerShell (Windows):**

```powershell
PS> .\scripts\build.ps1
# Binary will be created at .\bin\cadence.exe
```

**Or using Go directly:**

```bash
$ go build -o cadence ./cmd/cadence
```

## Verify Installation

Test that Cadence is working:

```bash
$ ./cadence version
# Shows current Cadence version
```

Or get help:

```bash
$ ./cadence --help
Detects AI-generated content in git repositories and websites

Usage:
  cadence [command]

Available Commands:
  analyze     Analyze git repository for AI-generated content
  web         Analyze website content for AI patterns
  config      Manage cadence configuration
  webhook     Start webhook server for continuous monitoring
  version     Show version information

Flags:
  -h, --help   help for cadence
```

## Add to PATH (Optional)

### Linux/macOS

```bash
# Copy binary to a directory in PATH
$ sudo cp cadence /usr/local/bin/

# Or create a symlink
$ sudo ln -s $(pwd)/cadence /usr/local/bin/

# Verify
$ cadence --help
```

### Windows (PowerShell as Admin)

```powershell
# Add current directory to PATH
PS> $env:PATH += ";$(Get-Location)\bin"

# Make it permanent (add to user profile)
PS> Add-Content $PROFILE `n'$env:PATH += ";C:\path\to\cadence\bin"'

# Verify
PS> cadence --help
```

## Troubleshooting

### Build Fails

Ensure you have Go 1.24 installed. If you're using an older version:

```bash
$ go install github.com/CodeMeAPixel/cadence-tool/cmd/cadence@latest
```

### Command Not Found

Make sure the binary is in your PATH. Use the full path to run it:

```bash
$ ./cadence --help
# Or
$ /path/to/cadence --help
```

## Next Steps

Now that you have Cadence installed, check out the [Quick Start](/docs/quick-start) guide to start analyzing.
