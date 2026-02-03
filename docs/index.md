---
title: Documentation
description: Learn how to use Cadence to detect AI-generated content
category: Reference
difficulty: Beginner
time_estimate: 5 min
prerequisites: []
---

# Welcome to Cadence

Cadence is an open-source CLI tool that detects AI-generated content in Git repositories and websites. It uses pattern-based detection strategies combined with optional AI validation to identify suspicious content.

Whether you're auditing code commits or analyzing web content, Cadence provides comprehensive analysis with confidence scores and detailed reporting.

## Documentation Sections

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">

### [Getting Started](/docs/getting-started)
Installation, quick start guides, and basic configuration to get you up and running.

### [CLI Reference](/docs/cli)
Complete command-line interface documentation including all commands and detection strategies.

### [Analysis](/docs/analysis)
Deep-dive guides for analyzing Git repositories and websites with best practices.

### [Integrations](/docs/integrations)
Connect Cadence to AI agents, CI/CD pipelines, and webhook-based workflows.

### [Reference](/docs/reference)
Advanced configuration, development guides, and troubleshooting resources.

### [Community](/docs/community)
Contributing guidelines, security policy, and community resources.

</div>

## Quick Links

| Section | Popular Pages |
|---------|--------------|
| **Getting Started** | [Installation](/docs/getting-started/installation) · [Quick Start](/docs/getting-started/quick-start) · [Configuration](/docs/getting-started/configuration) · [Quick Reference](/docs/getting-started/quick-reference) |
| **CLI** | [Commands](/docs/cli/commands) · [Detection Strategies](/docs/cli/detection-strategies) |
| **Analysis** | [Repository Analysis](/docs/analysis/repository) · [Git Analysis](/docs/analysis/git) · [Web Analysis](/docs/analysis/web) |
| **Integrations** | [Webhooks](/docs/integrations/webhooks) · [Agent Skills](/docs/integrations/agent-skills) |
| **Reference** | [Advanced Configuration](/docs/reference/advanced-configuration) · [Build & Development](/docs/reference/build-development) · [Troubleshooting](/docs/reference/troubleshooting) · [Disclaimer](/docs/reference/disclaimer) |

## Key Features

- **18 Git Detection Strategies**: Size, velocity, timing, merge commit, dispersion, ratio, precision, commit message, naming patterns, structural consistency, burst patterns, error handling, templates, file extensions, statistical anomalies, timing anomalies, emoji usage, and special characters
- **20 Web Detection Strategies**: Overused phrases, generic language, excessive structure, perfect grammar, boilerplate text, repetitive patterns, missing nuance, excessive transitions, uniform sentence length, AI vocabulary, emoji overuse, special characters, missing alt text, semantic HTML, accessibility markers, heading hierarchy, hardcoded values, form issues, link text quality, and generic styling
- **Remote Repository Support**: Analyze GitHub URLs directly with automatic cloning (Git 2.20+ support)
- **Confidence Scoring**: Get detailed scores (0.0-1.0) with severity levels and reasoning for each finding
- **Multiple Output Formats**: JSON, text, and optional web-based reporting
- **YAML Configuration**: Full control over thresholds, file exclusions, webhook settings, and AI integration
- **Webhook Server**: Deploy as CI/CD-integrated service with Fiber framework for continuous monitoring
- **Optional OpenAI Integration**: GPT-4o-mini validation for enhanced analysis accuracy
- **CLI Commands**: `cadence analyze`, `cadence web`, `cadence webhook`, `cadence config`
- **Performance**: Built in Go 1.24+ for high-speed analysis of large repositories

## Documentation Map & Learning Paths

## Learning Paths

**Analyze a Git repository:** [Installation](/docs/getting-started/installation) → [Quick Start](/docs/getting-started/quick-start) → [Repository Analysis](/docs/analysis/repository) → [Git Analysis Guide](/docs/analysis/git)

**Analyze a website:** [Installation](/docs/getting-started/installation) → [Quick Start](/docs/getting-started/quick-start) → [Web Analysis Guide](/docs/analysis/web)

**Understand how it works:** [Detection Strategies](/docs/cli/detection-strategies) → [Git Analysis Guide](/docs/analysis/git) or [Web Analysis Guide](/docs/analysis/web)

**Configure for your needs:** [Configuration](/docs/getting-started/configuration) → [Advanced Configuration](/docs/reference/advanced-configuration)

**Deploy & integrate:** [Webhooks](/docs/integrations/webhooks) → [Agent Skills](/docs/integrations/agent-skills)

**Troubleshoot issues:** [Troubleshooting Guide](/docs/reference/troubleshooting)

**Contribute:** [Build & Development](/docs/reference/build-development)

## Getting Started by Role

**New Users:** [Installation](/docs/getting-started/installation) → [Quick Start](/docs/getting-started/quick-start) → [Quick Reference](/docs/getting-started/quick-reference)

**Developers:** [Installation](/docs/getting-started/installation) → [CLI Commands](/docs/cli/commands) → [Build & Development](/docs/reference/build-development) → [Contributing](/docs/reference/build-development)

**DevOps/Integration:** [Installation](/docs/getting-started/installation) → [Configuration](/docs/getting-started/configuration) → [Advanced Configuration](/docs/reference/advanced-configuration) → [Webhooks](/docs/integrations/webhooks)

**Contributors:** [Build & Development](/docs/reference/build-development) → [Analysis Guides](/docs/analysis)

## Architecture

Cadence is built with Go 1.24+ for maximum performance and efficiency. It's designed as a modular system with a pluggable strategy architecture that allows for easy extension.

**Core Components:**
- **Git Analyzer** (`internal/git/`) - Repository analysis, commit pair detection, metrics collection
- **Detector** (`internal/detector/`) - 18 pluggable detection strategies for commit analysis
- **Web Analyzer** (`internal/web/`) - Content fetching, 20 pattern detection strategies, optional AI validation
- **Configuration** (`internal/config/`) - YAML-based config with environment variable overrides via spf13/viper
- **Webhook Server** (`internal/webhook/`) - Fiber-based HTTP server with HMAC-SHA256 verification and job queue
- **Reporters** (`internal/reporter/`) - JSON and text output formats
- **AI Integration** (`internal/ai/`) - Optional OpenAI integration for enhanced analysis

**Git Detection Strategies (18 total):**
1. Size (additions/deletions threshold)
2. Velocity (lines per minute)
3. Timing (commit frequency)
4. Merge Commit (merge detection)
5. Dispersion (files touched)
6. Ratio (addition/deletion balance)
7. Precision (pattern consistency)
8. Commit Message (message patterns)
9. Naming Pattern (variable/function naming)
10. Structural Consistency (code structure)
11. Burst Pattern (rapid commits)
12. Error Handling (exception patterns)
13. Template Pattern (code templates)
14. File Extension Pattern (file type modifications)
15. Statistical Anomaly (outlier detection)
16. Timing Anomaly (time pattern analysis)
17. Emoji Usage (excessive or unusual emoji patterns)
18. Special Characters (overused hyphens, asterisks, underscores)

**Web Detection Strategies (20 total):**
1. Overused Phrases (common AI phrases)
2. Generic Language (vague wording)
3. Excessive Structure (over-organization)
4. Perfect Grammar (unnatural perfection)
5. Boilerplate Text (templated content)
6. Repetitive Patterns (repeated structures)
7. Missing Nuance (lack of specificity)
8. Excessive Transitions (too many connectors)
9. Uniform Sentence Length (consistent pacing)
10. AI Vocabulary (characteristic word choices)
11. Emoji Overuse (excessive emoji patterns)
12. Special Characters (unusual special character usage)
13. Missing Alt Text (images without accessibility)
14. Semantic HTML (improper tag usage)
15. Accessibility Markers (missing ARIA attributes)
16. Heading Hierarchy (improper heading structure)
17. Hardcoded Values (fixed pixels/colors)
18. Form Issues (missing labels, improper inputs)
19. Generic Link Text (generic phrases like "click here")
20. Generic Styling (default colors, no custom theming)
9. Uniform Sentence Length (lack of variation)
10. AI Vocabulary (characteristic AI words)

**Additional Features:**
- Optional AI validation via OpenAI GPT-4o-mini