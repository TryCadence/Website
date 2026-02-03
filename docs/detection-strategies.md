---
title: Detection Strategies
description: Learn how each detection strategy identifies AI-generated content
---

# Detection Strategies

Cadence uses multiple detection strategies that work together to identify AI-generated content. Each strategy analyzes different aspects of the content and contributes to the final confidence score.

## Git Repository Strategies

### 1. Velocity Anomalies
Detects unusually high commit velocity (lines added/removed per minute).

- **Normal velocity**: 50-200 lines/minute
- **Suspicious**: 500+ lines/minute

**Why it matters:** Humans typically edit incrementally. Large commits with thousands of lines in minutes suggest automated or AI-generated code.

### 2. Size Analysis
Flags individual commits with unusually large changesets.

- **Normal commit**: 50-300 lines
- **Suspicious**: 500+ lines in single commit

**Why it matters:** Large commits without corresponding message detail suggest batch generation rather than thoughtful development.

### 3. Timing Patterns
Detects commits at unusual hours (typically 12am-6am).

- **Normal hours**: 8am-10pm
- **Suspicious**: 12am-6am (late night automated jobs)

**Why it matters:** Humans don't typically work at 3am, but scheduled automated processes and AI tools do.

### 4. Statistical Markers
Analyzes distribution of changes across files and modules.

- **Human changes**: Clustered in 2-3 files
- **AI changes**: Distributed across many files (>10)

**Why it matters:** AI tends to generate comprehensive changes across entire codebases rather than targeted fixes.

### 5. Merge Behavior
Detects unusual merge patterns and commit sequencing.

**Why it matters:** AI-generated commits often have irregular merge patterns or inconsistent branching behavior.

### 6. File Dispersion
Analyzes how changes are spread across the file system.

**Why it matters:** Focused human work affects specific directories. Wide dispersion suggests automated generation.

### 7. Ratio Analysis
Compares additions/deletions ratio and file modification patterns.

- **Human ratio**: Often 1:1 (add and remove)
- **AI ratio**: Heavy additions (5:1 or higher)

**Why it matters:** Humans typically refactor and clean up. AI tends to add without removing.

### 8. Precision Metrics
Examines code quality indicators and comment patterns.

**Why it matters:** AI code often has too-perfect formatting or generic comments that differ from human patterns.

## Web Content Strategies

### 1. Generic Language Detection
Detects overuse of vague, generic phrases common in AI output.

Examples: "In today's fast-paced world", "cutting-edge solutions"

**Why it matters:** AI language models are trained on common patterns and reuse these phrases frequently.

### 2. Perfect Grammar Sections
Identifies passages with unusually perfect grammar and punctuation.

**Why it matters:** Human writing has natural variations and occasional typos. Perfectly polished text across long sections suggests AI writing.

### 3. Overused Phrases
Detects repeated use of identical or near-identical phrases throughout content.

**Why it matters:** AI models generate variations of common phrases. High repetition suggests AI generation.

### 4. Sentence Uniformity
Analyzes sentence structure consistency and variation patterns.

- **Human writing**: Variable sentence length
- **AI writing**: Similar sentence lengths (±10 words)

**Why it matters:** AI models tend to generate similarly-structured sentences. Human writing naturally varies.

### 5. Excessive Structure
Detects overly uniform formatting and structure in content.

**Why it matters:** AI tends to generate perfectly structured, repetitive layouts. Human writing is more organic.

### 6. Boilerplate Text
Identifies common boilerplate patterns and filler text.

**Why it matters:** AI commonly generates placeholder and filler content. Detection of patterns indicates AI generation.

### 7. Custom Pattern Detection
Allows custom regex patterns for domain-specific AI detection.

**Why it matters:** Different industries and content types have unique AI signatures. Custom patterns catch these.

### 8. AI Validation (Optional)
Uses GPT-4o-mini to validate AI content and provide additional insights.

**Why it matters:** AI validation provides independent verification and confidence. Requires OpenAI API key.

## How Scoring Works

Cadence combines multiple strategies to produce a final confidence score:

1. Each strategy produces a score between 0 and 1
2. Triggered strategies (threshold met) contribute to the final score
3. Final confidence is weighted by strategy importance
4. Result: Overall suspicion level from 0 (not AI) to 1.0 (definitely AI)

## Configuring Strategies

See the [Configuration Guide](/docs/configuration) to enable/disable specific strategies and adjust thresholds.
