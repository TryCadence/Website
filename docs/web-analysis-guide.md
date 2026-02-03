---
title: Web Analysis Guide
description: Complete guide to analyzing websites for AI-generated content with Cadence
---

# Web Content Analysis Guide

Cadence analyzes website content to detect AI-generated text ("AI slop"). This guide covers how to identify AI patterns in web content, configure detection strategies, and interpret results.

## Overview

Web analysis examines page content for patterns commonly found in AI-generated text. While AI writing is improving, it still exhibits detectable patterns that differ from human writing.

### What Gets Analyzed

- **Language patterns** - Overused phrases and generic constructions
- **Grammar quality** - Suspiciously perfect or robotic grammar
- **Content structure** - Unusual formatting and organization
- **Placeholder text** - Generic filler content
- **Boilerplate patterns** - Repeated template content
- **Specificity** - Lack of details, examples, or nuance
- **Semantic consistency** - Contradictions or logical gaps

## Basic Usage

### Analyze a Single Page

```bash
cadence web https://example.com --output report.json
```

### Verbose Output

```bash
cadence web https://example.com --verbose --output report.json
```

Shows detailed analysis including specific content flagged and reasoning.

### Text vs JSON Output

```bash
# Human-readable text report
cadence web https://example.com --output report.txt

# Machine-readable JSON
cadence web https://example.com --json --output report.json
```

## Detection Strategies

Cadence uses eight detection strategies for web content:

### 1. Generic Language Detection

Identifies overused phrases and generic constructions.

**Examples flagged:**
- "As you can see..."
- "In conclusion..."
- "The bottom line is..."
- "It goes without saying..."
- "At the end of the day..."

**Why it matters:** AI models are trained on human writing containing these phrases and overuse them
**Severity:** Medium - common in both AI and low-effort human writing

### 2. Perfect Grammar Detection

Detects suspiciously perfect grammar and phrasing.

**Examples flagged:**
- Zero grammatical errors in long passages
- Overly formal constructions
- Consistent complex sentence structures
- No contractions or casual language patterns

**Why it matters:** Real human writing contains occasional errors; perfect prose suggests AI generation
**Severity:** Medium - context dependent

### 3. Overused Phrases

Detects common AI-generated phrases and templates.

**Examples flagged:**
- "Dive deep into..."
- "Explore the world of..."
- "Unlock the potential of..."
- "Take your X to the next level..."
- "Game-changing..."

**Why it matters:** AI models have learned specific phrase patterns from training data
**Severity:** Medium-High - strong indicator when clustered

### 4. Placeholder Pattern Detection

Identifies generic placeholder content.

**Examples flagged:**
- "There are many ways to..."
- "Some examples include..."
- "Additionally, [topic] is important..."
- "Consider the following..."

**Why it matters:** AI fills space with generic placeholders instead of specific content
**Severity:** High - clear indicator of AI generation

### 5. Content Uniformity Detection

Identifies suspiciously consistent writing style.

**Examples flagged:**
- Identical sentence structure throughout
- Consistent paragraph length
- Uniform vocabulary complexity
- No variations in tone or style

**Why it matters:** Human writing naturally varies; uniformity suggests automated generation
**Severity:** High - strong structural indicator

### 6. Content Structure Analysis

Analyzes overall page structure and organization.

**Examples flagged:**
- Lists with identical formatting
- Sections with identical structure
- Repetitive heading patterns
- Templated organization

**Why it matters:** AI generates content following training patterns; humans vary structure
**Severity:** Medium

### 7. Boilerplate Detection

Identifies reused boilerplate text across pages.

**Examples flagged:**
- Identical disclaimers
- Template-based footer text
- Standard "about us" patterns
- Copyright templates

**Why it matters:** AI often reuses learned patterns across multiple outputs
**Severity:** Low-Medium - common but not definitive

### 8. AI Model Fingerprinting

Analyzes semantic patterns specific to certain AI models.

**Patterns detected:**
- OpenAI (GPT) writing patterns
- Anthropic Claude patterns
- Google Bard patterns
- Other model-specific signatures

**Why it matters:** Different AI models have identifiable fingerprints
**Severity:** High - when confident in identification

## Configuration

### Basic Analysis

```bash
cadence web https://example.com \
  --output report.json \
  --verbose
```

### Advanced Configuration

Create `cadence.yml`:

```yaml
ai:
  enabled: true
  provider: openai
  api_key: ${OPENAI_API_KEY}
  model: gpt-4o-mini

web:
  timeout: 30
  follow_redirects: true
  user_agent: "Mozilla/5.0..."
```

## Output Formats

### JSON Report

```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T10:30:00Z",
  "content": {
    "title": "Page Title",
    "word_count": 1500,
    "character_count": 8234,
    "language": "en"
  },
  "analysis": {
    "total_score": 0.72,
    "confidence": 0.85,
    "likely_ai_generated": true
  },
  "detections": [
    {
      "strategy": "generic_language",
      "severity": "medium",
      "score": 0.68,
      "phrases": [
        {
          "phrase": "As you can see",
          "count": 3,
          "context": "As you can see from the data..."
        }
      ]
    },
    {
      "strategy": "placeholder_patterns",
      "severity": "high",
      "score": 0.82,
      "examples": [
        {
          "pattern": "There are many ways to",
          "found": 2,
          "context": "There are many ways to solve this problem"
        }
      ]
    }
  ],
  "summary": {
    "flagged_phrases": 24,
    "suspicious_sections": 5,
    "ai_signature_strength": "high"
  }
}
```

### Text Report

Shows human-readable summary with highlighted sections and explanations.

## Scoring System

### Overall Score (0-1)

- **0.0-0.3**: Likely human-written
- **0.3-0.5**: Mixed signals (AI-assisted or edited)
- **0.5-0.7**: Likely AI-written
- **0.7-1.0**: Very likely AI-generated

### Severity Levels

- **Low**: Pattern detected, could be legitimate
- **Medium**: Notable pattern, warrants attention
- **High**: Strong indicator of AI generation
- **Critical**: Multiple high-severity indicators

## Real-World Examples

### Example 1: Blog Content Review

```bash
cadence web https://blog.example.com/article \
  --verbose \
  --output blog-analysis.json
```

Check for:
- Overused phrases and generic language
- Perfect grammar despite complexity
- Placeholder patterns
- Lack of specific examples

### Example 2: Website Quality Audit

```bash
# Analyze multiple pages
for url in https://example.com/about \
           https://example.com/services \
           https://example.com/blog; do
  cadence web "$url" --output "${url##*/}.json"
done
```

Compare results across pages to identify systematic AI generation.

### Example 3: Competitive Analysis

```bash
cadence web https://competitor-site.com/product \
  --verbose \
  --output competitor-analysis.json
```

Assess content quality and identify if competitors use AI writing.

## Advanced Techniques

### Detecting Model-Specific Patterns

Different AI models have identifiable characteristics:

**OpenAI/ChatGPT patterns:**
- Formal transitions
- Listed information
- Consistent paragraph structure

**Anthropic Claude patterns:**
- Thoughtful introductions
- Clear reasoning chains
- Measured tone

**Google Bard patterns:**
- Information synthesis
- Multiple perspectives
- Source citations

### Content Authenticity Verification

```bash
# Analyze original content
cadence web https://original-site.com --json --output original.json

# Compare with potential copy
cadence web https://suspicious-site.com --json --output suspicious.json

# Similar scores may indicate plagiarism
```

### Detecting AI-Assisted Writing

Mixed human-AI content shows:
- Variable consistency (human sections vary, AI sections uniform)
- Scattered placeholders
- Good ideas with generic execution
- Specific examples with generic explanations

## Limitations and Considerations

### What Cadence Cannot Detect

- **Heavily edited AI content** - With significant human revision, patterns become harder to detect
- **Model-specific watermarks** - Current models don't add detectable watermarks
- **Multi-language content** - Analysis works best on English
- **Code blocks and technical content** - Primarily designed for prose

### False Positives

These may be flagged as AI but aren't:
- **Technical documentation** - Often has generic patterns
- **Legal documents** - Template-based language
- **Corporate copy** - Standardized phrasing
- **Translated content** - May have unusual patterns
- **Academic writing** - Formal and structured

### Context Matters

**Higher confidence scores when:**
- Multiple strategies flag content
- Severe patterns detected
- Consistent patterns throughout
- No human editing indicators

**Lower confidence when:**
- Only one strategy flags content
- Mild patterns only
- Sporadic detections
- Content appears edited

## Best Practices

1. **Review Content Manually** - Scores are indicators, not definitive proof
2. **Check Multiple Pages** - Single page analysis may be insufficient
3. **Consider Context** - Technical sites may have higher scores legitimately
4. **Look for Patterns** - Multiple detections across pages are more conclusive
5. **Use AI Validation** - OpenAI review provides additional confidence
6. **Compare Baseline** - Know what typical human writing scores in your domain
7. **Update Regularly** - As AI improves, detection methods must evolve

## Performance Tips

### Fast Analysis

```bash
cadence web https://example.com --output report.json
# Typical time: 2-5 seconds
```

### Detailed Analysis

```bash
cadence web https://example.com --verbose --output report.json
# Typical time: 5-15 seconds (with AI validation)
```

### Batch Analysis

```bash
# Analyze multiple URLs
parallel cadence web {} --output {/.}.json ::: \
  https://site1.com \
  https://site2.com \
  https://site3.com
```

## Next Steps

- [Git Analysis Guide](../git-analysis-guide) - Analyze repositories for AI commits
- [Configuration Reference](../configuration) - Full configuration options
- [Troubleshooting Guide](../troubleshooting) - Common issues and solutions
