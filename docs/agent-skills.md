---
title: Agent Skills & Integration
description: Using Cadence as an AI agent skill with skills.sh ecosystem
---

# Agent Skills & Integration

Cadence is compatible with [Vercel's skills.sh](https://skills.sh/) ecosystem, allowing AI agents and tools to integrate Cadence's AI detection capabilities directly into their workflows.

## What are Agent Skills?

Agent skills are standardized interfaces that allow AI agents (like Claude, ChatGPT, or custom automation tools) to invoke specific functionality programmatically. Cadence exposes its detection capabilities as agent skills, making it easy to integrate AI content detection into larger workflows.

## Skill Definition

Cadence provides a `skills.json` file that defines two main skills following the skills.sh specification:

### 1. `analyze-repository`

Analyzes an entire Git repository for suspicious AI-generated commits.

**Input Schema:**
```json
{
  "repository": "https://github.com/user/repo",
  "branch": "main",
  "output_format": "json"
}
```

**Output Schema:**
```json
{
  "suspicious_commits": [
    {
      "hash": "abc1234",
      "confidence": 0.85,
      "reasons": ["High velocity", "Large commit"],
      "ai_analysis": "likely AI-generated"
    }
  ],
  "statistics": {
    "total_commits": 150,
    "total_suspicious": 3
  },
  "total_suspicious": 3
}
```

**Parameters:**
- `repository` (required): Local path or GitHub URL of the repository
- `branch` (optional): Specific branch to analyze (default: `main`)
- `output_format` (optional): Output format - `json` or `text` (default: `json`)

### 2. `detect-suspicious-commit`

Analyzes a single commit for AI-generation patterns.

**Input Schema:**
```json
{
  "commit_hash": "abc1234",
  "additions": "def hello_world():\n    print('Hello')\n    return True",
  "use_ai": true
}
```

**Output Schema:**
```json
{
  "suspicious": true,
  "confidence": 0.75,
  "reasons": ["High velocity", "Unusual pattern"],
  "ai_analysis": "possibly AI-generated (confidence: 75%)"
}
```

**Parameters:**
- `commit_hash` (required): Git commit hash
- `additions` (required): Code additions in the commit
- `use_ai` (optional): Enable AI-powered analysis (default: `false`)

## Installing as a Skill

### Using npx (Recommended)

```bash
# Install from GitHub repository
npx skills add CodeMeAPixel/Cadence

# Or specify a version
npx skills add CodeMeAPixel/Cadence@0.2.1
```

### Manual Installation

Download the `skills.json` file and register it with your agent tooling:

```bash
curl -o cadence-skills.json https://raw.githubusercontent.com/CodeMeAPixel/Cadence/main/skills.json
```

## Integration Examples

### With Claude Desktop / Code

Ask Claude to use Cadence for repository analysis:

```
Use Cadence to analyze if my repository has AI-generated commits.
Analyze https://github.com/user/my-repo
```

Claude will invoke the `analyze-repository` skill and provide results.

### With ChatGPT Custom Actions

Add Cadence as a custom action in ChatGPT:

1. Go to ChatGPT Settings → Actions
2. Import the `skills.json` file
3. Configure authentication if needed
4. Use in prompts: "Check this repository for AI-generated code"

### With Custom Agents (Programmatic)

If you're building custom AI agents, you can invoke Cadence skills programmatically:

**JavaScript/TypeScript Example:**
```typescript
import { SkillRegistry } from '@skills/registry'

const cadence = SkillRegistry.get('cadence-ai-detection')

const result = await cadence.invoke('analyze-repository', {
  repository: 'https://github.com/user/repo',
  branch: 'main',
  output_format: 'json'
})

console.log(`Found ${result.total_suspicious} suspicious commits`)
```

**Python Example:**
```python
from skills import SkillRegistry

cadence = SkillRegistry.get('cadence-ai-detection')

result = cadence.invoke('detect-suspicious-commit', {
    'commit_hash': 'abc1234',
    'additions': code_additions,
    'use_ai': True
})

if result['suspicious']:
    print(f"Confidence: {result['confidence']}")
    print(f"Reasons: {', '.join(result['reasons'])}")
```

## Configuration for Skills

When using Cadence as a skill, it respects standard configuration:

```yaml
thresholds:
  suspicious_additions: 500
  suspicious_deletions: 1000
  max_additions_per_min: 100

ai:
  enabled: true
  provider: openai
  model: gpt-4-mini
```

You can pass configuration via:
1. **Config file**: Place `.cadence.yaml` in your project directory
2. **Environment variables**: `CADENCE_AI_KEY`, `CADENCE_CONFIG`
3. **Skill parameters**: Override specific thresholds per invocation

## Environment Variables

When running Cadence as a skill:

- `CADENCE_AI_KEY` - OpenAI API key for AI-powered analysis
- `CADENCE_CONFIG` - Path to custom configuration file
- `CADENCE_LOG_LEVEL` - Logging level (`debug`, `info`, `warn`, `error`)

## Skill Metadata

Cadence skills include rich metadata for agent discovery:

```json
{
  "name": "cadence-ai-detection",
  "version": "0.2.1",
  "description": "AI-generated code detection skill for analyzing Git repositories",
  "author": "CodeMeAPixel",
  "repository": "https://github.com/CodeMeAPixel/Cadence",
  "license": "AGPL-3.0",
  "tags": ["ai-detection", "git-analysis", "code-quality", "security"],
  "keywords": ["AI-generated code", "commit analysis", "statistical anomaly"]
}
```

## Skill Features

**Token Efficient** - Only analyzes flagged commits, minimizing API costs

**AI Powered** - Optional GPT-4 Mini integration for enhanced accuracy

**Async Ready** - Works seamlessly with agent job queues

**Composable** - Chain with other skills for complex workflows

**Well Documented** - Clear input/output schemas with examples

**Type Safe** - JSON Schema validation for all inputs and outputs

## Use Cases

### Code Review Automation

Integrate Cadence into PR review workflows:

```typescript
// On PR creation, check for AI-generated code
const analysis = await cadence.invoke('analyze-repository', {
  repository: pr.headRepo,
  branch: pr.headBranch
})

if (analysis.total_suspicious > 0) {
  await github.createComment(pr.number, 
    `Warning: Found ${analysis.total_suspicious} potentially AI-generated commits`
  )
}
```

### Continuous Integration

Add Cadence checks to CI pipelines:

```yaml
# .github/workflows/ai-detection.yml
- name: Check for AI-generated code
  run: |
    npx skills run cadence analyze-repository \
      --repository . \
      --output ci-report.json
```

### Repository Auditing

Batch analyze multiple repositories:

```python
repos = ['user/repo1', 'user/repo2', 'user/repo3']

for repo in repos:
    result = cadence.invoke('analyze-repository', {
        'repository': f'https://github.com/{repo}',
        'output_format': 'json'
    })
    print(f"{repo}: {result['total_suspicious']} suspicious commits")
```

## Best Practices

1. **Cache Results**: Store analysis results to avoid re-analyzing unchanged repositories
2. **Rate Limiting**: Respect GitHub API limits when analyzing remote repositories
3. **AI Budget**: Enable AI validation selectively for high-confidence flags only
4. **Human Review**: Always follow up automated detection with human verification
5. **Privacy**: Ensure you have permission before analyzing private repositories

## Troubleshooting

### "Skill not found"

Ensure Cadence is properly installed:
```bash
npx skills list | grep cadence
```

### "Authentication failed"

Set your AI API key:
```bash
export CADENCE_AI_KEY="your-openai-key"
```

### "Invalid input schema"

Validate your input against the schema:
```bash
npx skills validate cadence analyze-repository input.json
```

## Contributing to Skills

To improve Cadence skills:

1. Fork the [repository](https://github.com/CodeMeAPixel/Cadence)
2. Modify `skills.json` with new capabilities
3. Add detection strategies in `internal/detector/patterns/`
4. Update documentation
5. Submit a pull request

See the [Contributing Guide](/docs/contributing) for details.

## Learn More

- [skills.sh Documentation](https://skills.sh/docs)
- [Cadence GitHub Repository](https://github.com/CodeMeAPixel/Cadence)
- [API & Webhook Documentation](/docs/api-webhooks)
- [Detection Strategies](/docs/detection-strategies)