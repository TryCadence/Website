# Configuration

Cadence uses YAML configuration files to customize detection thresholds and behavior.

## Quick Start

Create a configuration file:

```bash
cadence config init
```

This creates `.cadence.yaml` in the current directory. Use it with:

```bash
cadence analyze /path/to/repo --config cadence.yaml -o report.json
```

## Default Configuration

The default configuration that's generated:

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
```

## Understanding Thresholds

### Size-Based Detection

- **suspicious_additions**: Flag commits with more additions than this value
  - Default: 500 lines
  - Higher = less sensitive
  - Lower = more sensitive

- **suspicious_deletions**: Flag commits with more deletions than this value
  - Default: 1000 lines
  - Higher = less sensitive

**Example:**
- Repository with many large commits? Increase to 1000+
- Strict code quality? Decrease to 300-400

### Velocity-Based Detection

- **max_additions_per_min**: Flag if additions per minute exceeds this
  - Default: 100 lines/minute
  - Detects abnormally fast code generation

- **max_deletions_per_min**: Flag if deletions per minute exceeds this
  - Default: 500 lines/minute

**Example:**
- Automated bulk imports? Increase to 200+
- Strict AI detection? Decrease to 50-75

### Timing-Based Detection

- **min_time_delta_seconds**: Flag commits within this many seconds of previous commit
  - Default: 60 seconds
  - Detects rapid-fire commit bursts
  - 0 to disable

**Example:**
- Allow quick commits? Increase to 120-300
- Very strict? Keep at 30-60

### File Dispersion Detection

- **max_files_per_commit**: Flag commits modifying more files than this
  - Default: 50 files
  - Detects commits affecting too many files

**Example:**
- Large refactors allowed? Increase to 100+
- Small focused commits? Decrease to 20-30

### Ratio-Based Detection

- **max_addition_ratio**: Flag if additions ratio exceeds this (0.0-1.0)
  - Default: 0.95 (95% additions)
  - Detects mostly-add commits (suggests generated code)

**Example:**
- Allow mostly-additions? Increase to 0.98
- Strict balance? Decrease to 0.80

## Configuration Presets

### Preset 1: Sensitive (Strict)

For detecting even subtle AI patterns:

```yaml
thresholds:
  suspicious_additions: 300
  suspicious_deletions: 500
  max_additions_per_min: 50
  max_deletions_per_min: 200
  min_time_delta_seconds: 30
  max_files_per_commit: 20
  max_addition_ratio: 0.80
```

**Use when:** Code quality is critical, want to catch subtle issues

### Preset 2: Balanced (Default)

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

**Use when:** Want reasonable detection without noise

### Preset 3: Permissive (Lenient)

For fast-paced development:

```yaml
thresholds:
  suspicious_additions: 1000
  suspicious_deletions: 2000
  max_additions_per_min: 200
  max_deletions_per_min: 1000
  min_time_delta_seconds: 120
  max_files_per_commit: 100
  max_addition_ratio: 0.98
```

**Use when:** Large commits/refactors are normal, want minimal false positives

## Excluding Files

Prevent certain files from triggering detection:

```yaml
exclude_files:
  - package-lock.json
  - yarn.lock
  - "*.min.js"
  - dist/*
  - build/*
  - ".gitignore"
```

**Common patterns to exclude:**
- Lock files (package-lock.json, Gemfile.lock)
- Generated code (dist/, build/, .next/)
- Large compiled outputs (*.min.js)
- Dependency files (node_modules/)

## Optional: AI Analysis

Enable OpenAI GPT-4o-mini for expert validation:

```yaml
ai:
  enabled: false                    # Set to true to enable
  provider: openai                  # Currently only openai supported
  model: gpt-4o-mini               # Model to use
  api_key: "${OPENAI_API_KEY}"     # Environment variable reference
```

### Setup AI Analysis

1. **Get API key** - [OpenAI API keys](https://platform.openai.com/api-keys)

2. **Set environment variable:**
   ```bash
   export OPENAI_API_KEY="sk-..."
   ```

3. **Enable in config:**
   ```yaml
   ai:
     enabled: true
   ```

4. **Run analysis:**
   ```bash
   cadence analyze /repo --config cadence.yaml -o report.json
   ```

## Using Configuration Files

### Auto-detect Configuration

Cadence automatically looks for `.cadence.yaml` in the current directory:

```bash
# In directory with .cadence.yaml
cadence analyze /repo -o report.json
# Automatically uses .cadence.yaml
```

### Explicit Configuration

Specify configuration file explicitly:

```bash
cadence analyze /repo --config /path/to/config.yaml -o report.json
```

### Override Individual Settings

Command-line flags override configuration file:

```bash
cadence analyze /repo \
  --config cadence.yaml \
  --suspicious-additions 1000 \
  -o report.json
# Uses cadence.yaml but overrides suspicious_additions
```

## Using Environment Variables

Configure Cadence via environment variables:

```bash
# Configuration file location
export CADENCE_CONFIG=/path/to/cadence.yaml

# AI settings
export OPENAI_API_KEY=sk-...

# Webhook settings
export CADENCE_WEBHOOK_PORT=8080
export CADENCE_WEBHOOK_SECRET=secret
```

## Configuration Examples

### Web Development Project

Projects with auto-generated files, large lock files:

```yaml
thresholds:
  suspicious_additions: 750
  suspicious_deletions: 1500
  max_additions_per_min: 150
  max_files_per_commit: 75

exclude_files:
  - package-lock.json
  - yarn.lock
  - "*.min.js"
  - dist/*
  - ".next/*"
```

### Strict Code Quality

Projects requiring high code quality standards:

```yaml
thresholds:
  suspicious_additions: 250
  suspicious_deletions: 400
  max_additions_per_min: 40
  max_deletions_per_min: 150
  min_time_delta_seconds: 45
  max_files_per_commit: 15
  max_addition_ratio: 0.75
```

### Data Science / ML Project

Projects with data files and large generated outputs:

```yaml
thresholds:
  suspicious_additions: 2000
  suspicious_deletions: 3000
  max_additions_per_min: 300
  max_files_per_commit: 100

exclude_files:
  - "*.pkl"
  - "*.h5"
  - "*.pth"
  - "*.joblib"
  - data/*
```

### Enterprise Repository

Large enterprise projects with many contributors:

```yaml
thresholds:
  suspicious_additions: 1000
  suspicious_deletions: 2000
  max_additions_per_min: 200
  max_files_per_commit: 80
  max_addition_ratio: 0.97

ai:
  enabled: true
  model: gpt-4o-mini
```

## Per-Repository Configuration

Use different configurations for different projects:

```bash
# Project A with strict rules
cadence analyze ~/projects/projectA --config ~/.cadence/strict.yaml -o report.json

# Project B with lenient rules
cadence analyze ~/projects/projectB --config ~/.cadence/lenient.yaml -o report.json

# Project C with custom rules
cadence analyze ~/projects/projectC --config ./cadence.yaml -o report.json
```

## Troubleshooting Configuration

### "Config file not found"

Make sure the file exists and path is correct:

```bash
# Check file exists
ls -la cadence.yaml

# Use full path
cadence analyze /repo --config $(pwd)/cadence.yaml -o report.json
```

### Thresholds Have No Effect

Verify configuration is being loaded. Check if flags are overriding config:

```bash
# This overrides config value
cadence analyze /repo --config cadence.yaml --suspicious-additions 2000 -o report.json

# Use config only
cadence analyze /repo --config cadence.yaml -o report.json
```

### AI Analysis Not Working

Ensure:
1. API key is set: `echo $OPENAI_API_KEY`
2. Config has `enabled: true`
3. Valid API key (starts with `sk-`)

```bash
# Verify API key
echo $OPENAI_API_KEY

# Test with verbose output
cadence analyze /repo --config cadence.yaml -o report.json --verbose
```

## Next Steps

- [CLI Commands](/docs/cli/commands) - Learn all available commands
- [Quick Start](/docs/getting-started/quick-start) - Run your first analysis
- [Detection Strategies](/docs/cli/detection-strategies) - Understand what gets detected
