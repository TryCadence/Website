# Advanced Configuration

Complete configuration reference for all Cadence options including detection thresholds, webhook server, AI analysis, and file patterns.

## Configuration File

Cadence loads configuration from `.cadence.yaml` in the working directory or specified via `--config`.

Generate default configuration:

```bash
cadence config init
```

## Complete Configuration Reference

```yaml
# Cadence Configuration File

# DETECTION THRESHOLDS
thresholds:
  # Size-based detection
  suspicious_additions: 500          # Flag commits with 500+ additions
  suspicious_deletions: 1000         # Flag commits with 1000+ deletions
  
  # Velocity-based detection (additions/deletions per minute)
  max_additions_per_min: 100         # Flag if 100+ additions/minute
  max_deletions_per_min: 500         # Flag if 500+ deletions/minute
  
  # Timing-based detection
  min_time_delta_seconds: 60         # Flag commits within 60 seconds
  
  # File dispersion detection
  max_files_per_commit: 50           # Flag commits touching 50+ files
  
  # Ratio-based detection (0.0-1.0)
  max_addition_ratio: 0.95           # Flag if 95%+ additions
  min_deletion_ratio: 0.95           # Flag if 95%+ deletions (inverted)
  min_commit_size_ratio: 100         # Minimum commit size consideration
  
  # Precision analysis
  enable_precision_analysis: true    # Enable advanced pattern analysis

# FILE EXCLUSION PATTERNS
exclude_files:
  - package-lock.json                # Node.js lock files
  - yarn.lock                        # Yarn lock files
  - Gemfile.lock                     # Ruby lock files
  - "*.min.js"                       # Minified JavaScript
  - "*.min.css"                      # Minified CSS
  - node_modules/**                  # Dependency directories
  - "dist/*"                         # Build output
  - build/**                         # Build artifacts
  - ".next/*"                        # Next.js output

# WEBHOOK SERVER CONFIGURATION
webhook:
  # Enable/disable webhook server
  enabled: false
  
  # Server binding
  host: "0.0.0.0"                    # Bind to all interfaces (0.0.0.0) or specific (127.0.0.1)
  port: 3000                         # Server port
  
  # Security
  secret: "your-webhook-secret"      # HMAC secret for signature verification (REQUIRED)
  
  # Performance
  max_workers: 4                     # Concurrent analysis workers
  read_timeout: 30                   # Request read timeout (seconds)
  write_timeout: 30                  # Response write timeout (seconds)

# AI ANALYSIS CONFIGURATION (Optional - requires API key)
ai:
  # Enable/disable AI-powered analysis
  enabled: false
  
  # AI provider (currently only "openai" supported)
  provider: "openai"
  
  # API key (can also use CADENCE_AI_API_KEY environment variable)
  api_key: ""
  
  # Model selection (gpt-4o-mini recommended for cost/performance)
  model: "gpt-4o-mini"
  # Available models:
  # - gpt-4o-mini: Fast, cheap, recommended
  # - gpt-4o: Slower, more expensive, higher accuracy
  # - gpt-4-turbo: Very slow, very expensive
```

## Configuration Options Explained

### Threshold Configuration

**suspicious_additions** (default: 500)
- Flag commits with more additions than this value
- Lower = more sensitive, more false positives
- Higher = less sensitive, may miss suspicious code
- Typical range: 300-1000

**suspicious_deletions** (default: 1000)
- Flag commits with more deletions than this value
- Same sensitivity trade-offs as additions
- Typical range: 500-2000

**max_additions_per_min** (default: 100)
- Flag if rate of additions exceeds this per minute
- Detects rapid code generation
- Typical range: 50-200 lines/minute

**max_deletions_per_min** (default: 500)
- Flag if rate of deletions exceeds this per minute
- Typical range: 200-1000 lines/minute

**min_time_delta_seconds** (default: 60)
- Flag if commits occur within this many seconds
- Detects rapid-fire commits (bot-like behavior)
- Set to 0 to disable
- Typical range: 30-120 seconds

**max_files_per_commit** (default: 50)
- Flag commits modifying more files than this
- Detects bulk changes across codebase
- Typical range: 20-100 files

**max_addition_ratio** (default: 0.95)
- Flag if additions ratio exceeds this (0.0-1.0)
- 0.95 = flag if 95%+ of changes are additions
- Detects unbalanced commits (mostly adding, not refactoring)
- Typical range: 0.80-0.98

**min_deletion_ratio** (default: 0.95)
- Inverse: flag if very few deletions
- Typical range: 0.80-0.98

**enable_precision_analysis** (default: true)
- Enable advanced pattern analysis
- Slightly slower but more accurate
- Recommended to keep enabled

### File Exclusion

Exclude patterns prevent certain files from triggering detection:

```yaml
exclude_files:
  # Lock files (often large, auto-generated)
  - package-lock.json
  - yarn.lock
  - Gemfile.lock
  - poetry.lock
  
  # Minified/compiled (often large, generated)
  - "*.min.js"
  - "*.min.css"
  - "*.bundle.js"
  
  # Build output (generated, not hand-written)
  - dist/**
  - build/**
  - "*.o"
  - "*.exe"
  
  # Dependency folders (not your code)
  - node_modules/**
  - vendor/**
  
  # Framework output
  - ".next/*"
  - ".venv/*"
  - "__pycache__/*"
```

### Webhook Configuration

**host** (default: "0.0.0.0")
- `0.0.0.0` - Listen on all network interfaces (recommended for Docker/servers)
- `127.0.0.1` - Listen only on localhost (for local testing)
- Specific IP - Bind to specific interface

**port** (default: 3000)
- Server port
- Use 8080, 9000, etc. for custom ports
- Requires root/admin for ports < 1024

**secret** (REQUIRED)
- HMAC secret for webhook signature verification
- Must match secret configured in GitHub/GitLab
- Use cryptographically random string (32+ characters)

Generate strong secret:
```bash
# Linux/macOS
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToHexString([Random]::new().Next() | % { [byte]$_ })
```

**max_workers** (default: 4)
- Number of concurrent analysis jobs
- Higher = more parallelism, more resource usage
- Typical range: 2-8 for single server

**read_timeout/write_timeout** (default: 30 seconds each)
- Request/response timeout
- Increase for slow networks or large repositories
- Typical range: 30-120 seconds

### AI Configuration

**enabled** (default: false)
- Set to `true` to enable OpenAI analysis
- Requires valid `api_key`

**provider** (default: "openai")
- Currently only "openai" is supported
- Future: support for other providers

**api_key** (required if enabled)
- OpenAI API key
- Alternatively set `CADENCE_AI_API_KEY` environment variable
- Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**model** (default: "gpt-4o-mini")

| Model | Speed | Cost | Accuracy | Recommended |
|-------|-------|------|----------|-------------|
| gpt-4o-mini | Fast | Cheap | Good | ✅ Yes |
| gpt-4o | Medium | Higher | Better | For important analysis |
| gpt-4-turbo | Slow | Expensive | Best | For critical decisions |

## Configuration Precedence

Cadence applies settings in this order (highest priority first):

1. **Command-line flags** - `--suspicious-additions 1000`
2. **Environment variables** - `CADENCE_THRESHOLDS_SUSPICIOUS_ADDITIONS=1000`
3. **Configuration file** - `.cadence.yaml` values
4. **Built-in defaults** - Hardcoded in code

Example: If config has `suspicious_additions: 500` but you pass `--suspicious-additions 1000`, the flag wins.

## Environment Variables

Configure via environment variables (prefix: `CADENCE_`):

```bash
# Configuration file location
export CADENCE_CONFIG="/path/to/cadence.yaml"

# Detection thresholds (translate to camelCase with underscores)
export CADENCE_THRESHOLDS_SUSPICIOUS_ADDITIONS=500
export CADENCE_THRESHOLDS_MAX_ADDITIONS_PER_MIN=100
export CADENCE_THRESHOLDS_MIN_TIME_DELTA_SECONDS=60

# Webhook settings
export CADENCE_WEBHOOK_ENABLED=true
export CADENCE_WEBHOOK_PORT=8080
export CADENCE_WEBHOOK_HOST=0.0.0.0
export CADENCE_WEBHOOK_SECRET="webhook-secret"
export CADENCE_WEBHOOK_MAX_WORKERS=4

# AI settings
export CADENCE_AI_ENABLED=true
export CADENCE_AI_PROVIDER=openai
export CADENCE_AI_API_KEY="sk-..."
export CADENCE_AI_MODEL=gpt-4o-mini

# File exclusions
export CADENCE_EXCLUDE_FILES="*.lock,node_modules/*"
```

## Configuration Examples

### Example 1: Strict Code Quality

For high-quality projects with focused commits:

```yaml
thresholds:
  suspicious_additions: 300
  suspicious_deletions: 500
  max_additions_per_min: 50
  max_deletions_per_min: 200
  min_time_delta_seconds: 45
  max_files_per_commit: 20
  max_addition_ratio: 0.80
```

### Example 2: Balanced (Default)

Good for most repositories:

```yaml
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100
  max_deletions_per_min: 500
  min_time_delta_seconds: 60
  max_files_per_commit: 50
  max_addition_ratio: 0.95
```

### Example 3: Permissive (Fast-Paced Development)

For projects with large refactors and auto-generated code:

```yaml
thresholds:
  suspicious_additions: 1000
  suspicious_deletions: 2000
  max_additions_per_min: 200
  max_deletions_per_min: 1000
  min_time_delta_seconds: 120
  max_files_per_commit: 100
  max_addition_ratio: 0.98

exclude_files:
  - package-lock.json
  - yarn.lock
  - "*.min.js"
  - dist/**
  - build/**
  - ".next/*"
  - "__pycache__/*"
  - "*.o"
```

### Example 4: Enterprise (Large Teams + AI)

For large enterprises with multiple teams:

```yaml
thresholds:
  suspicious_additions: 750
  suspicious_deletions: 1500
  max_additions_per_min: 150
  max_files_per_commit: 75
  max_addition_ratio: 0.93

webhook:
  enabled: true
  port: 8080
  secret: "enterprise-secret-key"
  max_workers: 8

ai:
  enabled: true
  provider: openai
  model: gpt-4o
  api_key: "${OPENAI_API_KEY}"
```

## Troubleshooting Configuration

### Configuration Not Applied

1. Check file exists: `ls -la .cadence.yaml`
2. Verify YAML syntax (use YAML validator online)
3. Check file permissions (readable)
4. Try explicit path: `cadence analyze . --config /full/path/cadence.yaml`

### Thresholds Not Working

1. Verify flag overrides don't apply: `cadence analyze . --help`
2. Check environment variables don't override: `echo $CADENCE_THRESHOLDS_SUSPICIOUS_ADDITIONS`
3. Verify config file is valid YAML

### AI Analysis Not Working

1. Verify API key: `echo $OPENAI_API_KEY` (should show key)
2. Check config has `ai.enabled: true`
3. Verify API key is valid (starts with `sk-`)
4. Check account has credits

## Next Steps

- [Build & Development](/docs/reference/build-development) - Building from source
- [Troubleshooting](/docs/reference/troubleshooting) - Common issues
- [Getting Started](/docs/getting-started/configuration) - Basic configuration
