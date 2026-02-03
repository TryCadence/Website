---
title: Security Policy
description: Security practices, vulnerability reporting, and best practices for Cadence
---

# Security Policy

Cadence takes security seriously. This document outlines our security practices, how to report vulnerabilities, and best practices for using Cadence securely.

## Reporting a Vulnerability

If you discover a security vulnerability in Cadence, please **do not open a public GitHub issue**. Public disclosure can put users at risk before a fix is available.

### How to Report

**Preferred Method - Private Security Advisory:**

1. Go to [GitHub Security Advisories](https://github.com/CodeMeAPixel/Cadence/security/advisories/new)
2. Click "Report a vulnerability"
3. Fill out the form with details
4. Submit privately

**Alternative - Email:**

Send details to [hey@codemeapixel.dev](mailto:hey@codemeapixel.dev) with:
- Subject line: "SECURITY: [Brief Description]"
- Detailed description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact assessment
- Any proposed fixes (optional)

**Social Media (Urgent Only):**

For critical, time-sensitive issues: [@CodeMeAPixel](https://twitter.com/CodeMeAPixel) on Twitter/X

### What to Include

When reporting a vulnerability, please provide:

1. **Description**: Clear explanation of the vulnerability
2. **Impact**: Potential consequences if exploited
3. **Steps to Reproduce**: Detailed instructions to verify the issue
4. **Environment**: Cadence version, OS, Go version
5. **Proof of Concept**: Code or commands demonstrating the issue (if safe)
6. **Suggested Fix**: Your ideas for remediation (optional)
7. **Disclosure Timeline**: When you plan to disclose publicly (if at all)

**Example Report:**

```markdown
**Vulnerability:** Command injection in repository URL parsing

**Impact:** Attacker can execute arbitrary commands on the server 
by crafting malicious repository URLs.

**Steps to Reproduce:**
1. Run: cadence analyze "https://evil.com/repo; rm -rf /"
2. Observe shell command execution

**Environment:**
- Cadence: v0.2.1
- OS: Linux
- Go: 1.24.0

**Suggested Fix:** Sanitize URL input and use exec.Command 
with separate arguments instead of shell execution.
```

### Response Timeline

We aim to respond within:

- **48 hours**: Acknowledge receipt of your report
- **7 days**: Initial assessment and severity classification
- **30 days**: Patch development and testing (for non-critical issues)
- **Immediate**: Emergency patch for critical vulnerabilities

You'll receive updates on:
- Vulnerability confirmation
- Fix development progress
- Expected release date
- Public disclosure timeline

### Recognition

We appreciate responsible disclosure. If you'd like:

✅ **Credit in Security Advisory**: We'll acknowledge your contribution
✅ **Listed as Reporter**: Your name/handle in release notes
❌ **Anonymity**: We'll keep your identity private if requested

## Supported Versions

| Version | Status | Support Level |
|---------|--------|---------------|
| v0.2.x  | Current | Full support with security fixes, bug fixes, and features |
| v0.1.x  | Legacy | Security fixes only, no new features |
| < v0.1  | EOL | Not supported, please upgrade |

**Recommendation:** Always use the latest stable release for the best security posture.

### Checking Your Version

```bash
cadence version
```

### Updating Cadence

```bash
# Using Make
cd Cadence/cadence-tool
git pull
make build

# Or download latest release
# https://github.com/CodeMeAPixel/Cadence/releases/latest
```

## Security Updates

### Notification Channels

Stay informed about security updates:

1. **GitHub Security Advisories**: [View advisories](https://github.com/CodeMeAPixel/Cadence/security/advisories)
2. **Release Notes**: Check `CHANGELOG.md` for security fixes
3. **GitHub Watch**: Watch releases for notifications

### Severity Levels

We classify vulnerabilities using CVSS scores:

| Severity | CVSS Score | Response Time | Examples |
|----------|------------|---------------|----------|
| **Critical** | 9.0-10.0 | Immediate | Remote code execution, auth bypass |
| **High** | 7.0-8.9 | 7 days | Privilege escalation, data exposure |
| **Medium** | 4.0-6.9 | 30 days | DoS, information disclosure |
| **Low** | 0.1-3.9 | Next release | Minor info leaks, low-impact issues |

**Critical/High** issues trigger immediate patch releases.

## Security Best Practices

### Using Cadence Securely

#### 1. Configuration Files

**DON'T:**
```yaml
# .cadence.yaml - DON'T commit secrets!
ai:
  api_key: "sk-proj-AbCdEf..."  # Exposed in version control
```

**DO:**
```yaml
# .cadence.yaml
ai:
  api_key: "${CADENCE_AI_KEY}"  # Use environment variables

webhook:
  secret: "${WEBHOOK_SECRET}"
```

```bash
# .env (add to .gitignore)
export CADENCE_AI_KEY="sk-proj-AbCdEf..."
export WEBHOOK_SECRET="your-secret-key"
```

#### 2. Repository Analysis

**Analyzing untrusted repositories:**

```bash
# Use isolated environment (Docker container)
docker run --rm -v /tmp/analysis:/work cadence-cli \
  cadence analyze /work/untrusted-repo

# Or use a VM/sandbox
```

**Why?** Malicious repositories could contain harmful git hooks or scripts.

#### 3. Webhook Server Security

**Always use HTTPS in production:**

```nginx
# nginx configuration
server {
    listen 443 ssl http2;
    server_name cadence.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

**Generate strong secrets:**

```bash
# Generate webhook secret
openssl rand -hex 32
```

**Verify webhook signatures:**

Cadence automatically verifies HMAC signatures for GitHub and GitLab webhooks. Never disable this validation.

#### 4. API Key Management

**Environment Variables:**

```bash
# Set API key securely
export CADENCE_AI_KEY="sk-proj-..."

# Don't pass via command line (visible in process list)
# BAD: cadence analyze /repo --ai-key sk-proj-...
```

**Key Rotation:**

Rotate API keys regularly:

```bash
# 1. Generate new key from OpenAI dashboard
# 2. Update environment variable
export CADENCE_AI_KEY="sk-proj-NEW_KEY"
# 3. Revoke old key
```

#### 5. Network Security

**Firewall Configuration:**

```bash
# Only allow webhook endpoints from trusted IPs
ufw allow from 192.30.252.0/22 to any port 3000  # GitHub IPs
ufw allow from 34.74.90.64/28 to any port 3000   # GitLab IPs
```

**Rate Limiting:**

```yaml
# cadence.yaml
webhook:
  rate_limit: 100  # requests per minute
  max_workers: 4   # concurrent analysis jobs
```

#### 6. Data Privacy

**Sensitive Repositories:**

- Analyze locally without AI validation
- Use self-hosted OpenAI-compatible models
- Do not send proprietary code to external APIs without permission

```bash
# Analyze without AI (no external API calls)
cadence analyze /path/to/repo --config config.yaml

# Disable AI in config
# .cadence.yaml
ai:
  enabled: false
```

**GDPR Compliance:**

If analyzing repositories with EU contributors:
- Don't store commit author information long-term
- Provide data deletion on request
- Document data processing in privacy policy

### Deployment Security

#### Docker Security

**Non-root user:**

```dockerfile
# Dockerfile
FROM alpine:latest
RUN addgroup -g 1000 cadence && \
    adduser -D -u 1000 -G cadence cadence

USER cadence
CMD ["cadence", "webhook"]
```

**Read-only filesystem:**

```bash
docker run --read-only --tmpfs /tmp cadence-webhook
```

#### systemd Hardening

```ini
[Service]
# Run as non-root user
User=cadence
Group=cadence

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/cadence

# Restrict network
RestrictAddressFamilies=AF_INET AF_INET6
```

## Dependencies

Cadence uses the following key dependencies:

| Dependency | Purpose | Security Monitoring |
|------------|---------|---------------------|
| `go-git/v5` | Git operations | Active monitoring |
| `goquery` | HTML parsing | Active monitoring |
| `cobra` | CLI framework | Active monitoring |
| `fiber` | HTTP server | Active monitoring |
| `openai-go` | AI integration | Active monitoring |

### Dependency Updates

We monitor dependencies for vulnerabilities using:
- **GitHub Dependabot**: Automated security updates
- **Go vulnerability database**: `go list -m -json all | nancy sleuth`

### Supply Chain Security

**Verify releases:**

```bash
# Verify release signature (coming soon)
gpg --verify cadence-v0.2.1.tar.gz.sig

# Check release SHA256
sha256sum cadence-v0.2.1.tar.gz
```

**Build from source:**

For maximum security, build from audited source:

```bash
git clone https://github.com/CodeMeAPixel/Cadence.git
cd Cadence/cadence-tool
git verify-commit HEAD  # Verify commit signature
make build
```

## Known Security Considerations

### 1. AI Model Limitations

**Context sent to OpenAI:**

When AI validation is enabled, commit diffs are sent to OpenAI's API. This includes:
- Code changes
- Commit messages
- File names

**Mitigation:**
- Disable AI for sensitive repositories
- Use self-hosted models
- Review OpenAI's [data usage policy](https://openai.com/policies/api-data-usage-policies)

### 2. Git Clone Security

**Cloning untrusted repositories:**

Cadence clones repositories when analyzing GitHub URLs. Malicious repos could:
- Contain large files (DoS)
- Include malicious git hooks
- Exploit git vulnerabilities

**Mitigation:**
- Run in isolated environment
- Set resource limits (disk space, memory)
- Use shallow clones (automatic)

### 3. Webhook Server

**Public-facing server risks:**

The webhook server is a public HTTP endpoint. Risks:
- DoS attacks
- Brute force signature guessing
- Resource exhaustion

**Mitigation:**
- Use rate limiting
- Verify webhook signatures
- Set worker limits
- Monitor resource usage

## Security Features

### Current

✅ **HMAC Signature Verification**: GitHub and GitLab webhooks
✅ **Input Validation**: Sanitized repository URLs and paths
✅ **Resource Limits**: Configurable worker pools
✅ **Secure Defaults**: AI disabled by default, localhost binding
✅ **Environment Variables**: Secrets via env vars, not files

### Planned

🔄 **Release Signing**: GPG signatures for releases (v0.3.0)
🔄 **RBAC**: Role-based access control for webhook API (v0.4.0)
🔄 **Audit Logging**: Security event logging (v0.3.0)
🔄 **SBOM**: Software Bill of Materials (v0.3.0)

## Compliance

### Open Source License

Cadence is licensed under **AGPL-3.0**. Key implications:

- Free to use, modify, and distribute
- Source code available for audit
- Modifications must be disclosed if deployed as a service
- Derivative works must use compatible license

See [LICENSE](https://github.com/CodeMeAPixel/Cadence/blob/main/LICENSE) for details.

### No Warranty

Cadence is provided "as is" without warranty of any kind, express or implied. The authors are not liable for any damages or consequences arising from the use of this tool.

## Security Contact

For security-related questions (not vulnerability reports):

- **Email**: [hey@codemeapixel.dev](mailto:hey@codemeapixel.dev)
- **Discussions**: [GitHub Discussions](https://github.com/CodeMeAPixel/Cadence/discussions)

For vulnerability reports, use the [reporting process](#reporting-a-vulnerability) above.

---

**Last Updated**: February 2026  
**Next Review**: May 2026

Thank you for helping keep Cadence secure!
