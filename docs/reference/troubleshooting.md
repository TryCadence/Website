# Troubleshooting Guide

Solutions for common Cadence issues including installation, analysis errors, and performance problems.

## Installation & Build Issues

### "Command not found: go"

Go is not installed or not in PATH.

**Solutions:**

1. Install Go from [golang.org/dl](https://golang.org/dl)
2. Verify installation:
   ```bash
   go version
   ```
3. Add to PATH if needed (see installation guide)

### Build Fails on Windows

**Problem:** `go build` fails with permission errors or path issues.

**Solutions:**

1. Use PowerShell as Administrator:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\scripts\build.ps1
   ```

2. Use the Makefile instead:
   ```powershell
   make build
   ```

3. Ensure Go is installed for Windows (not WSL version)

### Build Fails on macOS/Linux

**Problem:** Missing dependencies or permission errors.

**Solutions:**

1. Verify dependencies:
   ```bash
   git --version
   go version
   ```

2. Install missing dependencies:
   ```bash
   # macOS
   brew install git golang libgit2
   
   # Ubuntu/Debian
   sudo apt-get install git golang-go libgit2-dev
   ```

3. Clean module cache:
   ```bash
   go clean -modcache
   go mod tidy
   go mod download
   ```

### "Command not found: cadence"

The binary isn't in PATH.

**Solutions:**

1. Use full path:
   ```bash
   ./bin/cadence --help
   /path/to/cadence --help
   ```

2. Add to PATH:
   ```bash
   # Linux/macOS
   export PATH="$(pwd)/bin:$PATH"
   
   # Windows PowerShell
   $env:PATH += ";$(Get-Location)\bin"
   ```

3. Install globally:
   ```bash
   make install
   # Or
   sudo cp bin/cadence /usr/local/bin/
   ```

## Git Analysis Issues

### Repository Clone Fails: "Repository not found"

**Problem:** `cadence analyze https://github.com/owner/repo` fails

**Solutions:**

1. **Verify repository exists:**
   ```bash
   curl -I https://github.com/owner/repo
   # Should return 200 OK
   ```

2. **Check URL format:**
   ```bash
   # Correct
   cadence analyze https://github.com/owner/repo
   cadence analyze https://github.com/owner/repo/tree/main
   cadence analyze /local/path/to/repo
   
   # Incorrect
   cadence analyze https://github.com/owner/repo.git  # Don't include .git
   ```

3. **Check network connectivity:**
   ```bash
   ping github.com
   ```

4. **For private repositories:**
   - Configure Git credentials:
     ```bash
     git config --global credential.helper store
     ```
   - Then clone once to cache credentials:
     ```bash
     git clone https://github.com/owner/private-repo
     ```

### Clone Takes Too Long or Times Out

**Problem:** Cloning large repository fails or takes forever.

**Solutions:**

1. **Use shallow clone:**
   ```bash
   cadence analyze https://github.com/owner/repo \
     --branch main \
     -o report.json
   # Cadence analyzes only the specified branch
   ```

2. **Increase timeout:**
   ```bash
   # Cadence uses 5-minute default timeout
   # For very large repos, try analyzing a specific branch
   cadence analyze https://github.com/owner/repo/tree/main
   ```

3. **Use local repository:**
   ```bash
   # If you have local copy
   cadence analyze /path/to/local/repo -o report.json
   ```

4. **Check network:**
   ```bash
   # Test connection speed
   curl -w "Time: %{time_total}s\n" -o /dev/null https://github.com
   ```

### Analysis Produces No Results

**Problem:** Cadence runs but produces empty results or no flagged commits.

**Solutions:**

1. **Check thresholds are appropriate:**
   ```bash
   cadence config
   # Review default thresholds
   ```

2. **Verify repository has commits:**
   ```bash
   git log --oneline | head -20
   ```

3. **Lower thresholds to find something:**
   ```bash
   cadence analyze /repo \
     --suspicious-additions 100 \
     --max-additions-pm 50 \
     -o report.json
   ```

4. **Use verbose output (if supported):**
   ```bash
   cadence analyze /repo --verbose -o report.json
   ```

### Analysis Very Slow

**Problem:** Analysis takes a very long time.

**Solutions:**

1. **Check repository size:**
   ```bash
   git rev-list --count HEAD  # Total commits
   du -sh .git                # Repository size
   ```

2. **Analyze recent history only:**
   ```bash
   # Analyze only recent commits
   cadence analyze /repo --branch main -o report.json
   ```

3. **Exclude large files/patterns:**
   ```yaml
   # In cadence.yaml
   exclude_files:
     - "*.lock"
     - "node_modules/**"
     - "dist/**"
     - "build/**"
   ```

4. **Optimize system resources:**
   - Close other applications
   - Increase available memory
   - Use faster storage (SSD)

## Configuration Issues

### "Config file not found"

**Problem:** Configuration file not found error.

**Solutions:**

1. **Create default config:**
   ```bash
   cadence config init
   # Creates .cadence.yaml
   ```

2. **Specify config explicitly:**
   ```bash
   cadence analyze /repo --config /path/to/cadence.yaml -o report.json
   ```

3. **Check file exists and is readable:**
   ```bash
   ls -la .cadence.yaml
   cat .cadence.yaml  # Verify content
   ```

4. **Ensure valid YAML:**
   - Check indentation (use spaces, not tabs)
   - Verify syntax with online YAML validator

### Configuration Values Ignored

**Problem:** Configuration settings don't affect analysis.

**Solutions:**

1. **Check precedence:** Command-line flags override config
   ```bash
   # This overrides config file value
   cadence analyze /repo --config cadence.yaml --suspicious-additions 1000
   ```

2. **Check environment variables:** They override config too
   ```bash
   # These override file and flags
   export CADENCE_THRESHOLDS_SUSPICIOUS_ADDITIONS=2000
   cadence analyze /repo --config cadence.yaml
   ```

3. **Verify config file is being used:**
   ```bash
   cadence analyze /repo --config ./cadence.yaml
   # Use explicit path instead of relying on auto-detection
   ```

## Webhook Server Issues

### Webhook Not Receiving Events

**Problem:** Push events aren't triggering webhooks.

**Solutions:**

1. **Verify server is running:**
   ```bash
   curl http://localhost:3000/health
   # Should return 200 with JSON
   ```

2. **Check firewall/network:**
   ```bash
   # From another machine
   curl http://your-server.com:3000/health
   ```

3. **Verify webhook is configured in GitHub/GitLab:**
   - Go to repository settings
   - Check webhook exists and is active
   - Look at "Recent Deliveries" to see if events were sent

4. **Check webhook secret matches:**
   ```bash
   # In GitHub webhook settings
   Secret: must match --secret flag
   
   # Start server
   cadence webhook --port 8080 --secret "my-secret"
   ```

### "Signature verification failed"

**Problem:** Webhook received but signature verification failed.

**Solutions:**

1. **Verify secrets match:**
   - GitHub setting: `Settings → Webhooks → Secret`
   - Cadence config: `--secret "same-secret"`
   - They must be identical

2. **Check secret format:**
   - Should be plain string
   - No quotes, no escaping needed

3. **Restart server after changing secret:**
   ```bash
   # Stop current server
   # Start with new secret
   cadence webhook --port 8080 --secret "new-secret"
   ```

### Job Status Shows "failed"

**Problem:** Webhook job fails during analysis.

**Solutions:**

1. **Check job details:**
   ```bash
   curl http://localhost:3000/jobs/550e8400-...
   # Look at "error" field for details
   ```

2. **Common causes:**
   - Repository access denied
   - Invalid branch name
   - Timeout (5-minute limit)
   - Configuration errors

3. **Increase workers if backlogged:**
   ```bash
   cadence webhook --workers 8 --secret "secret"
   ```

## AI Analysis Issues

### AI Analysis Not Working

**Problem:** AI analysis isn't being performed.

**Solutions:**

1. **Verify API key is set:**
   ```bash
   echo $OPENAI_API_KEY
   # Should show sk-... key
   ```

2. **Check configuration:**
   ```yaml
   ai:
     enabled: true
     provider: openai
     api_key: "${OPENAI_API_KEY}"  # Or hardcoded
     model: gpt-4o-mini
   ```

3. **Verify API key is valid:**
   - Should start with `sk-`
   - Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Check key hasn't been revoked

4. **Ensure account has credits:**
   - Check [platform.openai.com/account/billing](https://platform.openai.com/account/billing/usage)
   - May need to add payment method

### AI Analysis is Slow or Expensive

**Problem:** AI analysis takes too long or uses too many tokens.

**Solutions:**

1. **Disable AI for large repositories:**
   ```yaml
   ai:
     enabled: false  # Use pattern-based only
   ```

2. **Use cheaper model:**
   ```yaml
   ai:
     model: gpt-4o-mini  # Cheapest and fastest
   ```

3. **Analyze fewer commits:**
   ```bash
   cadence analyze /repo --branch main -o report.json
   # Only analyzes specified branch
   ```

## Performance Optimization

### Analysis Slow on Large Repository

**Solutions:**

1. **Analyze specific branch:**
   ```bash
   cadence analyze /repo --branch main -o report.json
   ```

2. **Exclude generated files:**
   ```yaml
   exclude_files:
     - "*.lock"
     - "node_modules/**"
     - "dist/**"
     - "build/**"
   ```

3. **Use local repository:**
   - Cloning from GitHub is slower
   - Use local copy: `cadence analyze /local/path`

4. **Increase system resources:**
   - More RAM available
   - Faster storage (SSD)
   - Close other applications

### Webhook Server Slow

**Solutions:**

1. **Increase worker count:**
   ```bash
   cadence webhook --workers 8 --secret "secret"
   ```

2. **Reduce max jobs queue:**
   - Default: 100 jobs buffered
   - System load determines optimal

3. **Monitor job queue:**
   ```bash
   curl http://localhost:3000/jobs
   # Check how many pending jobs
   ```

## Getting More Help

### Check Documentation

- [Installation Guide](/docs/getting-started/installation)
- [CLI Commands](/docs/cli/commands)
- [Configuration](/docs/reference/advanced-configuration)

### Check Logs

Enable verbose logging if available:

```bash
# Some commands support --verbose
cadence analyze /repo --verbose -o report.json
```

### Report Issues

Found a bug? [Open an issue on GitHub](https://github.com/TryCadence/Cadence/issues):

1. Describe the problem
2. Include command you ran
3. Include error message
4. Include system info (OS, Go version)
5. Provide minimal example if possible

### Community Support

- [GitHub Discussions](https://github.com/TryCadence/Cadence/discussions)
- [GitHub Issues](https://github.com/TryCadence/Cadence/issues)

## Next Steps

- [Advanced Configuration](/docs/reference/advanced-configuration) - Config options
- [Build & Development](/docs/reference/build-development) - Building from source
- [CLI Commands](/docs/cli/commands) - Command reference
