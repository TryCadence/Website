---
title: Build & Development
description: Building Cadence from source and development workflow
---

# Build & Development Guide

Complete guide to building Cadence from source, development setup, and using Make for convenience.

## Build Tools

### Prerequisites

**Required:**
- Git 2.20+
- Go 1.24+

**Optional:**
- golangci-lint (for linting)
- make (for convenience targets)

### Installation Check

```bash
# Verify Go installation
go version

# Verify Git installation
git version

# Check for Make (optional)
make --version
```

## Building from Source

### Quick Build

Choose your platform:

#### Linux/macOS with Make

```bash
cd cadence-tool
make build
```

#### Linux/macOS with Go

```bash
cd cadence-tool
./scripts/build.sh
```

#### Windows with Make

```bash
cd cadence-tool
make build
```

#### Windows with PowerShell

```powershell
cd cadence-tool
.\scripts\build.ps1
```

### Verify Build

```bash
# Linux/macOS
./bin/cadence version

# Windows
.\cadence.exe version
```

## Make Convenience Targets

Make provides convenient shortcuts for common development tasks. Run in the `cadence-tool` directory.

### Available Make Targets

```bash
make help
```

Shows all available targets:

```
Cadence Makefile targets:
  make build   - Build binary with automatic version injection from git tags
  make install - Install binary to $GOPATH/bin
  make test    - Run all tests
  make fmt     - Format code
  make tidy    - Tidy dependencies
  make lint    - Run linter
  make vet     - Run go vet
  make run     - Run application
  make clean   - Clean build artifacts
```

### Build Targets

#### Build Executable

```bash
make build
```

Creates binary in `bin/` directory with automatic version injection from Git tags.

**Features:**
- Cross-platform support (Windows, macOS, Linux)
- Automatic version detection from Git tags
- Commit hash injection
- Build timestamp injection

**Output:**
- Linux/macOS: `bin/cadence`
- Windows: `bin/cadence.exe`

#### Install Binary

```bash
make install
```

Installs Cadence to `$GOPATH/bin` for system-wide access.

**After installation:**
```bash
# Can run from anywhere
cadence --help
```

#### Clean Build

```bash
make clean
```

Removes build artifacts and `bin/` directory.

### Development Targets

#### Run Tests

```bash
make test
```

Runs all Go tests in the project.

**Example output:**
```
ok      github.com/codemeapixel/cadence/cmd/cadence        0.123s
ok      github.com/codemeapixel/cadence/internal/...       1.234s
ok      github.com/codemeapixel/cadence/internal/...       0.456s
```

#### Format Code

```bash
make fmt
```

Formats all Go source files using `gofmt`.

**What it does:**
- Applies Go standard formatting
- Fixes indentation
- Normalizes spacing

#### Tidy Dependencies

```bash
make tidy
```

Removes unused dependencies and updates `go.mod`:

**What it does:**
- Removes unused imports
- Adds missing dependencies
- Cleans up `go.mod` and `go.sum`

#### Lint Code

```bash
make lint
```

Runs `golangci-lint` (if installed).

**Checks for:**
- Code style issues
- Potential bugs
- Performance problems
- Security issues

**Note:** Continues even if linter not installed.

#### Run Go Vet

```bash
make vet
```

Runs `go vet` for static analysis.

**Detects:**
- Suspicious constructs
- Common mistakes
- Potential bugs

#### Run Application

```bash
make run
```

Builds and runs Cadence directly:

```bash
make run -- analyze /path/to/repo --output report.json
```

## Development Workflow

### Workflow 1: Quick Development

```bash
# Clone repository
git clone https://github.com/CodeMeAPixel/Cadence.git
cd cadence-tool

# Make changes
# ... edit Go files ...

# Test changes
make test

# Format code
make fmt

# Build binary
make build

# Test binary
./bin/cadence version
```

### Workflow 2: Full Development Cycle

```bash
# Setup
git clone https://github.com/CodeMeAPixel/Cadence.git
cd cadence-tool

# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ... edit files ...

# Test locally
make test

# Format and lint
make fmt
make lint

# Verify with vet
make vet

# Build for testing
make build

# Test manually
./bin/cadence analyze /test/repo --output test.json

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

### Workflow 3: Cross-Platform Testing

```bash
# On Linux/macOS
make build
./bin/cadence --help

# Or test with specific OS targeting
GOOS=linux GOARCH=amd64 go build -o bin/cadence-linux ./cmd/cadence
GOOS=darwin GOARCH=amd64 go build -o bin/cadence-macos ./cmd/cadence
GOOS=windows GOARCH=amd64 go build -o bin/cadence-windows.exe ./cmd/cadence
```

## Version Management

Cadence automatically injects version information from Git tags:

### Version Components

- **Version:** From Git tag (e.g., `v2.1.0`)
- **Commit:** Short Git commit hash
- **Build Time:** UTC timestamp

### Check Version

```bash
cadence version
```

Output:
```
Cadence version v2.1.0
Git Commit: abc123def456
Build Time: 2024-01-15T10:30:00Z
```

### Create Release Version

```bash
# Create Git tag
git tag -a v2.1.0 -m "Release v2.1.0"

# Build (automatically uses tag)
make build

# Verify version
./bin/cadence version
# Shows: Cadence version v2.1.0
```

## Building for Distribution

### Create Universal Binary

```bash
# Linux
GOOS=linux GOARCH=amd64 make build

# macOS (Intel)
GOOS=darwin GOARCH=amd64 make build

# macOS (Apple Silicon)
GOOS=darwin GOARCH=arm64 make build

# Windows
GOOS=windows GOARCH=amd64 make build
```

### Create Release Package

```bash
# Linux release
mkdir -p dist/cadence-v2.1.0-linux-amd64
cd dist/cadence-v2.1.0-linux-amd64
cp ../../bin/cadence .
cp ../../LICENSE .
cp ../../README.md .
tar -czvf ../cadence-v2.1.0-linux-amd64.tar.gz .

# Windows release
mkdir dist\cadence-v2.1.0-windows-amd64
cd dist\cadence-v2.1.0-windows-amd64
copy ..\..\cadence.exe .
copy ..\..\LICENSE .
copy ..\..\README.md .
# Create zip file
```

## Troubleshooting Build Issues

### Make Command Not Found

**Windows:**
```powershell
# Install Make via Chocolatey
choco install make

# Or use direct Go commands
go build -o bin/cadence ./cmd/cadence
```

**Linux/macOS:**
```bash
# Install Make
# Ubuntu/Debian
sudo apt-get install make

# macOS
brew install make
```

### Build Fails: "go: command not found"

```bash
# Install Go
# macOS
brew install go

# Linux
sudo apt-get install golang-go

# Or download from https://golang.org/dl
```

### Permission Denied on build.sh

```bash
# Make script executable
chmod +x scripts/build.sh

# Try again
./scripts/build.sh
```

### Version Not Injected

```bash
# Ensure Git tags exist
git tag

# If no tags, create one
git tag -a v2.1.0 -m "Release 2.1.0"

# Rebuild
make clean
make build

# Verify
./bin/cadence version
```

### Dependency Issues

```bash
# Clean and download dependencies
go clean -modcache
go mod download

# Try build again
make build
```

## Project Structure

```
cadence-tool/
├── Makefile              # Build convenience targets
├── go.mod               # Go module definition
├── go.sum               # Dependency checksums
├── scripts/
│   ├── build.sh        # Linux/macOS build script
│   └── build.ps1       # Windows build script
├── cmd/
│   └── cadence/        # CLI commands
├── internal/           # Core functionality
│   ├── analyzer/       # Analysis engine
│   ├── detector/       # Detection strategies
│   ├── git/            # Git operations
│   ├── web/            # Web analysis
│   ├── config/         # Configuration
│   └── ...
├── test/               # Integration tests
└── bin/                # Built binaries (after build)
```

## Development Best Practices

### 1. Format Before Committing

```bash
make fmt
make tidy
```

### 2. Test Before Pushing

```bash
make test
make vet
```

### 3. Run Linter Locally

```bash
make lint
```

### 4. Build Successfully

```bash
make build
./bin/cadence --help
```

### 5. Clean Before Distribution

```bash
make clean
make build
# Now ready to distribute ./bin/cadence
```

## Environment Variables for Build

### Go Build Variables

```bash
# Cross-compile
GOOS=linux GOARCH=amd64 make build

# Optimization
CGO_ENABLED=0 make build

# Debug build
go build -gcflags="all=-N -l" -o bin/cadence ./cmd/cadence
```

### Custom LDFLAGS

```bash
# Manual version injection
go build -ldflags="-X github.com/codemeapixel/cadence/internal/version.Version=custom" \
  -o bin/cadence ./cmd/cadence
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-go@v2
      - run: make build
      - run: make test
      - run: make lint
```

### GitLab CI Example

```yaml
build:
  image: golang:1.24
  script:
    - make build
    - make test
  artifacts:
    paths:
      - bin/cadence
```

## Performance Tips

### Faster Builds

```bash
# Parallel build (if system supports it)
GOMAXPROCS=8 make build

# Debug info optimization
go build -ldflags="-s -w" -o bin/cadence ./cmd/cadence
```

### Faster Tests

```bash
# Run tests in parallel
go test -parallel 8 ./...

# Run specific test
go test -run TestName ./...
```

## Next Steps

- [Installation Guide](../installation) - System-wide installation
- [Quick Start](../quick-start) - Start using Cadence
- [CLI Commands Reference](../cli-commands) - All CLI commands
- [Configuration Guide](../configuration) - Configure Cadence
