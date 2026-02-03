---
title: Troubleshooting Guide
description: Common issues and solutions for Cadence AI detection tool
---

# Troubleshooting Guide

This guide covers common issues and solutions for running Cadence, both for Git and web analysis.

## Installation Issues

### Build Fails on Windows

**Problem:** `go build` fails with permission errors or path issues

**Solutions:**

1. Ensure Go is installed correctly:
```bash
go version  # Should show Go 1.20+
```

2. Update Go to latest:
```bash
go install golang.org/dl/go1.24@latest
~/sdk/go1.24/bin/go version
```

3. Use PowerShell instead of CMD:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd path\to\cadence
.\scripts\build.ps1
```

### Build Fails on macOS/Linux

**Problem:** Missing dependencies or permission issues

**Solutions:**

1. Ensure git is installed:
```bash
git --version
```

2. Install required dependencies:
```bash
# macOS
brew install git go libgit2

# Linux (Ubuntu)
sudo apt-get install git golang-go libgit2-dev
```

3. Check Go module cache:
```bash
go clean -modcache
go mod tidy
```

### "Command not found: cadence"

**Problem:** Executable not in PATH

**Solutions:**

1. Check build output:
```bash
make build  # or ./scripts/build.sh
ls -la bin/cadence
```

2. Add to PATH temporarily:
```bash
export PATH="$(pwd)/bin:$PATH"
cadence version
```

3. Install globally:
```bash
make install
# or
cp bin/cadence /usr/local/bin/
```

## Git Analysis Issues

### Clone Fails: "Repository not found"

**Problem:** `cadence analyze https://github.com/owner/repo` fails

**Causes:**
- Repository doesn't exist
- URL is incorrect
- Network connectivity issue
- Private repository without credentials

**Solutions:**

1. Verify repository exists:
```bash
curl -I https://github.com/owner/repo
```

2. Verify URL format:
```bash
# Correct formats:
cadence analyze https://github.com/owner/repo
cadence analyze https://github.com/owner/repo/tree/branch-name
cadence analyze /path/to/local/repo
```

3. Check network connectivity:
```bash
ping github.com
```

4. For private repositories, configure git:
```bash
git config --global credential.helper store
# Then enter credentials once
git clone https://github.com/owner/private-repo
```

### Clone Fails: "Network timeout"

**Problem:** Analysis takes too long or times out

**Causes:**
- Large repository
- Slow network connection
- GitHub rate limiting

**Solutions:**

1. Use shallow clone (faster):
```bash
cadence analyze https://github.com/owner/repo \
  --depth 1  # Only recent history
```

2. Analyze specific branch:
```bash
cadence analyze https://github.com/owner/repo/tree/main
# Rather than all branches
```

3. Increase timeout:
```bash
cadence analyze https://github.com/owner/repo \
  --timeout 300  # 5 minutes
```

4. Clone manually first:
```bash
git clone --depth 1 https://github.com/owner/repo
cadence analyze ./repo --output report.json
```

### Clone Fails: "Permission denied"

**Problem:** Cannot read files or write temp directory

**Causes:**
- Insufficient permissions
- Temp directory full
- Invalid file path

**Solutions:**

1. Check permissions:
```bash
# For local repo
ls -la /path/to/repo/.git
sudo chmod -R 755 /path/to/repo

# For temp directory
ls -la /tmp
df -h /tmp  # Check disk space
```

2. Use alternate temp directory:
```bash
TMPDIR=/var/tmp cadence analyze https://github.com/owner/repo
```

3. On Windows, ensure antivirus isn't blocking:
- Whitelist cadence executable
- Whitelist temp directory

### Analysis Hangs

**Problem:** `cadence analyze` appears frozen

**Causes:**
- Very large repository
- High system load
- Memory exhausted
- Git operations slow

**Solutions:**

1. Use timeout:
```bash
# Linux/macOS
timeout 30 cadence analyze /path/to/repo --output report.json

# PowerShell
$job = Start-Job { cadence analyze ... }
Wait-Job $job -Timeout 30
```

2. Check system resources:
```bash
# Linux/macOS
top -n 1 | head -20
free -h

# Windows PowerShell
Get-Process cadence | Select-Object Handles, CPU, Memory
```

3. Analyze with limits:
```bash
cadence analyze /path/to/repo \
  --depth 1 \
  --exclude "*.node_modules,*.dist" \
  --output report.json
```

4. Use verbose mode to see progress:
```bash
cadence analyze /path/to/repo --verbose --output report.json
```

### "No commits found"

**Problem:** Analysis completes but shows no results

**Causes:**
- Repository is empty
- Branch has no history
- All commits filtered out
- Incorrect analysis range

**Solutions:**

1. Verify repository has commits:
```bash
git log --oneline | head -5
```

2. Check branch exists:
```bash
git branch -a
git log origin/branch-name --oneline | head -5
```

3. Review exclusion patterns:
```bash
cadence analyze /path/to/repo \
  --exclude ""  # Empty string to disable
```

4. Try analyzing specific branch:
```bash
cd /path/to/repo
git checkout main
cadence analyze .
```

### Inaccurate Results

**Problem:** Analysis seems wrong or flags legitimate commits

**Causes:**
- Configuration too strict
- Thresholds not suited for project
- False positives
- Small repository (limited data)

**Solutions:**

1. Review configuration:
```yaml
# cadence.yml
analysis:
  strategies:
    - velocity  # Commits per day
    - size      # Files changed per commit
    
  thresholds:
    velocity:
      suspicious_additions: 1000  # lines per commit
      suspicious_deletions: 500
```

2. Adjust thresholds for your workflow:
```bash
cadence analyze /path/to/repo \
  --suspicious-additions 2000 \  # Higher threshold
  --output report.json
```

3. Check result severity levels:
```bash
# Use --verbose to see reasoning
cadence analyze /path/to/repo --verbose --output report.json
```

## Web Analysis Issues

### Connection Fails: "Cannot reach URL"

**Problem:** `cadence web https://example.com` fails to connect

**Causes:**
- Site is down
- Network connectivity issue
- Firewall blocking
- CORS/content security

**Solutions:**

1. Test connectivity:
```bash
# Linux/macOS
curl -I https://example.com
# Windows PowerShell
Invoke-WebRequest https://example.com -Method Head
```

2. Try from browser first:
- Open URL in web browser
- Verify page loads correctly

3. Check network connectivity:
```bash
ping 8.8.8.8
nslookup example.com
```

4. Allow time for rate limiting:
```bash
# Wait before retry
sleep 60
cadence web https://example.com --output report.json
```

### Connection Fails: "SSL/TLS error"

**Problem:** Certificate validation fails

**Causes:**
- Self-signed certificate
- Certificate expired
- Certificate chain issue
- Corporate proxy

**Solutions:**

1. Verify certificate in browser:
- Open site in browser
- Check certificate details
- Verify domain matches

2. Skip certificate verification (use carefully):
```bash
cadence web https://example.com \
  --insecure \
  --output report.json
```

3. Update certificates:
```bash
# macOS
/Applications/Python\ 3.x/Install\ Certificates.command

# Linux
sudo update-ca-certificates

# Windows - update system
```

4. Configure corporate proxy:
```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=https://proxy.company.com:8080
cadence web https://example.com --output report.json
```

### "Content not found"

**Problem:** Analysis returns empty content

**Causes:**
- JavaScript-rendered content
- Content behind login
- Content blocked by robots.txt
- Dynamic page structure

**Solutions:**

1. Check if content is behind login:
```bash
curl https://example.com | grep -i "login\|sign in"
```

2. Verify robots.txt isn't blocking:
```bash
curl https://example.com/robots.txt
```

3. For JavaScript-rendered content:
```bash
# Note: Cadence analyzes static HTML
# JavaScript-rendered content won't be analyzed
# Use headless browser alternative:
# - Playwright
# - Puppeteer
```

4. Try with verbose output:
```bash
cadence web https://example.com --verbose --output report.json
```

### Timeout During Analysis

**Problem:** Web analysis takes too long or times out

**Causes:**
- Slow website
- Large page content
- Network issues
- Default timeout too short

**Solutions:**

1. Increase timeout:
```bash
cadence web https://example.com \
  --timeout 60 \  # 60 seconds
  --output report.json
```

2. Reduce content:
```bash
# Cadence reads only initial content
cadence web https://example.com \
  --max-content 50000 \  # 50KB max
  --output report.json
```

3. Try at different time:
- Sites may be slow at peak hours
- Try during off-peak times

### Results Seem Inaccurate

**Problem:** Analysis flags legitimate content

**Causes:**
- False positives (especially for technical content)
- Thresholds not suited for site type
- AI validation incorrectly configured
- Small sample size

**Solutions:**

1. Review flagged content manually:
```bash
# Use verbose output to see what's flagged
cadence web https://example.com --verbose --output report.json

# Check report JSON for specific phrases
grep -i "placeholder\|generic" report.json
```

2. Adjust sensitivity:
```bash
# Reduce detection sensitivity
cadence web https://example.com \
  --sensitivity low \
  --output report.json
```

3. Consider content type:
- Technical sites often score higher
- Documentation may have template patterns
- Product pages often reuse phrases

## Configuration Issues

### "Config file not found"

**Problem:** `cadence analyze` fails with config error

**Causes:**
- Config file in wrong location
- Wrong filename
- Missing environment variables

**Solutions:**

1. Check config file location:
```bash
# Cadence looks for:
# 1. ./cadence.yml (current directory)
# 2. ~/.cadence.yml (home directory)
# 3. /etc/cadence/cadence.yml (system)

ls -la cadence.yml
ls -la ~/.cadence.yml
```

2. Specify config explicitly:
```bash
cadence analyze /path/to/repo \
  --config /path/to/cadence.yml \
  --output report.json
```

3. Create minimal config:
```bash
# Create cadence.yml with minimal settings
cat > cadence.yml << 'EOF'
analysis:
  strategies:
    - velocity
    - size
EOF
```

### Configuration Not Applied

**Problem:** Settings in `cadence.yml` don't affect analysis

**Causes:**
- Command-line flags override config
- Wrong YAML syntax
- Config file not loaded
- Wrong section name

**Solutions:**

1. Check YAML syntax:
```bash
# Use online YAML validator
# Or check with Python:
python3 -c "import yaml; yaml.safe_load(open('cadence.yml'))"
```

2. Verify config is loaded:
```bash
cadence analyze /path/to/repo \
  --config cadence.yml \
  --verbose \  # Shows config details
  --output report.json
```

3. Command-line overrides config:
```bash
# This overrides config file value
cadence analyze /path/to/repo \
  --config cadence.yml \
  --suspicious-additions 2000  # Overrides config setting
```

## Performance Issues

### Analysis Takes Too Long

**Problem:** `cadence analyze` is very slow

**Causes:**
- Large repository
- Many commits
- Many strategies enabled
- System resource constraints

**Solutions:**

1. Disable unnecessary strategies:
```yaml
# cadence.yml
analysis:
  strategies:
    - velocity      # Keep most important
    # - size
    # - timing
    # - statistical
```

2. Analyze limited history:
```bash
cadence analyze /path/to/repo \
  --depth 100 \  # Only last 100 commits
  --output report.json
```

3. Use local analysis (faster than remote):
```bash
# Faster
cadence analyze /path/to/local/repo

# Slower
cadence analyze https://github.com/owner/repo
```

4. Monitor system resources:
```bash
# Allocate more memory if available
# Reduce other processes
# Analyze during off-peak times
```

### High Memory Usage

**Problem:** Cadence uses excessive memory

**Causes:**
- Very large repository
- Many commits to analyze
- Memory leak (rare)
- Insufficient system memory

**Solutions:**

1. Reduce analysis scope:
```bash
cadence analyze /path/to/repo \
  --depth 50 \  # Analyze fewer commits
  --max-commits 1000 \
  --output report.json
```

2. Check for memory leaks:
```bash
# Monitor during execution
watch -n 1 'ps aux | grep cadence'
```

3. Increase system swap (Linux):
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Output and Reporting

### "JSON output is invalid"

**Problem:** Report JSON can't be parsed

**Causes:**
- File not fully written
- Special characters not escaped
- Encoding issue

**Solutions:**

1. Validate JSON:
```bash
# Linux/macOS
jq . report.json

# PowerShell
ConvertFrom-Json (Get-Content report.json -Raw)
```

2. Check file completeness:
```bash
tail -c 100 report.json  # Should end with }
```

3. Re-run analysis:
```bash
cadence analyze /path/to/repo --json --output report.json
```

### Missing Report File

**Problem:** `--output` flag doesn't create file

**Causes:**
- Directory doesn't exist
- Permission denied
- Wrong path specified

**Solutions:**

1. Create output directory:
```bash
mkdir -p reports/
cadence analyze /path/to/repo --output reports/analysis.json
```

2. Check permissions:
```bash
ls -la reports/
# Ensure write permission (rwx for user)
```

3. Use absolute path:
```bash
cadence analyze /path/to/repo \
  --output /home/user/reports/analysis.json
```

## API and Webhook Issues

### Webhook Not Receiving Events

**Problem:** Webhook endpoint not called after analysis

**Causes:**
- Webhook not configured
- URL unreachable
- Firewall blocking
- Webhook server not running

**Solutions:**

1. Verify webhook config:
```yaml
# cadence.yml
webhook:
  enabled: true
  url: https://example.com/webhook
  method: POST
  timeout: 10
```

2. Start webhook server:
```bash
cadence webhook --port 8000
```

3. Test webhook connectivity:
```bash
curl -X POST https://example.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

4. Check firewall:
```bash
# Ensure port is open
sudo netstat -tulpn | grep :8000
```

### Webhook Timeout

**Problem:** Webhook processing times out

**Causes:**
- Webhook endpoint is slow
- Timeout too short
- Network latency

**Solutions:**

1. Increase timeout:
```yaml
webhook:
  timeout: 30  # seconds
```

2. Implement async processing:
- Don't process in webhook handler
- Queue job for background processing
- Return 200 immediately

## Getting Help

### Enable Debug Logging

```bash
# Enable verbose output
cadence analyze /path/to/repo --verbose --output report.json

# Enable debug logging (if supported)
DEBUG=cadence cadence analyze /path/to/repo --output report.json
```

### Collect Diagnostic Information

```bash
# Create diagnostic bundle
echo "=== Cadence Version ===" > diagnostic.txt
cadence version >> diagnostic.txt

echo -e "\n=== Go Version ===" >> diagnostic.txt
go version >> diagnostic.txt

echo -e "\n=== Environment ===" >> diagnostic.txt
env | grep -i cadence >> diagnostic.txt

echo -e "\n=== Git Version ===" >> diagnostic.txt
git --version >> diagnostic.txt

echo -e "\n=== Config File ===" >> diagnostic.txt
cat cadence.yml >> diagnostic.txt 2>&1
```

### Contact Support

When reporting issues, include:

1. **Version information:**
   ```bash
   cadence version
   go version
   git --version
   ```

2. **Command that failed:**
   ```bash
   cadence analyze /path/to/repo --verbose --output report.json
   ```

3. **Full error output:**
   ```bash
   cadence analyze /path/to/repo 2>&1 | tee error.log
   ```

4. **Configuration file** (without secrets)

5. **System information:**
   - OS and version
   - Available memory
   - Available disk space

6. **Steps to reproduce** the issue

## Common Error Messages

### "fatal: not a git repository"

**Meaning:** Specified path is not a git repository

**Fix:**
```bash
cd /path/to/repo
git status
```

### "EOF before newline in commit message"

**Meaning:** Malformed commit in repository

**Fix:**
```bash
git fsck --full
git log --oneline | head -5
```

### "Connection timeout"

**Meaning:** Network operation took too long

**Fix:**
- Increase timeout value
- Check network connectivity
- Try at different time

### "Insufficient memory"

**Meaning:** Not enough RAM to complete analysis

**Fix:**
- Close other applications
- Increase swap space
- Analyze smaller repository section

## Next Steps

- [Configuration Reference](../configuration) - Configure Cadence for your needs
- [Git Analysis Guide](../git-analysis-guide) - Deep dive into Git analysis
- [Web Analysis Guide](../web-analysis-guide) - Deep dive into web analysis
- [Quick Start](../quick-start) - Get started quickly
