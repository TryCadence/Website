---
title: AI Analysis
description: Use OpenAI to enhance Cadence detection with detailed code analysis
---

# AI Analysis

Cadence can integrate with OpenAI to provide deeper analysis of suspicious commits detected by its pattern-based detection engine.

## Overview

When enabled, Cadence uses OpenAI to:

- Analyze suspicious code additions for AI-generation indicators
- Provide confidence scores and detailed reasoning
- Identify specific patterns and red flags in detected commits
- Generate expert assessment with explanations

AI analysis runs **after** suspicious commits are flagged by Cadence's detection strategies, making it an optional enhancement.

## How It Works

1. **Pattern Detection**: Cadence first identifies suspicious commits using detection strategies
2. **AI Analysis** (optional): If enabled, suspicious code snippets are sent to OpenAI for analysis
3. **Assessment**: OpenAI returns:
   - Assessment: "likely AI-generated", "possibly AI-generated", or "unlikely AI-generated"
   - Confidence score: 0.0 - 1.0
   - Reasoning: Explanation of key indicators found
   - Indicators: Specific patterns detected

## Supported Models

Cadence uses OpenAI models via the `go-openai` client:

- **Default**: `gpt-4o-mini` (fast, cost-effective)
- **Recommended**: `gpt-4` or `gpt-4-turbo` for higher accuracy
- **Any OpenAI model**: Can be configured via `CADENCE_AI_MODEL`

## Getting Started

### Prerequisites

- OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
- Environment variables or config file setup

### Quick Setup

```bash
# Set your API key
export CADENCE_AI_ENABLED=true
export CADENCE_AI_PROVIDER=openai
export CADENCE_AI_KEY=sk-proj-your-key-here

# Run analysis
cadence analyze ./my-repo -o report.txt
```

## Configuration

See [AI Configuration](/docs/ai/configuration) for detailed setup instructions, including:
- Environment variables
- Config file options
- Security best practices
- Model selection

## Usage Examples

See [AI Examples](/docs/ai/examples) for:
- Running analysis with AI enabled
- Analyzing suspicious commits
- Using with webhooks
- Batch processing
- CI/CD integration

## Limitations

- **Token limits**: Large code changes are truncated to 2000 characters
- **API usage**: Each analysis incurs costs at OpenAI rates
- **Rate limiting**: Subject to OpenAI rate limits
- **Optional only**: AI analysis only enhances existing detection, doesn't replace it

## Costs

AI analysis adds API calls to each suspicious commit found. Typical costs:

- `gpt-4o-mini`: ~$0.0001-0.001 per commit analysis
- `gpt-4-turbo`: ~$0.001-0.01 per commit analysis
- `gpt-4`: ~$0.01-0.03 per commit analysis

Check [OpenAI pricing](https://openai.com/pricing) for current rates.

## Next Steps

- [Configure AI](/docs/ai/configuration)
- [View examples](/docs/ai/examples)
- [Understand detection strategies](/docs/cli/detection-strategies)
