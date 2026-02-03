---
title: Configuration
description: Configure Cadence detection thresholds and behavior
---

# Configuration

## Configuration Overview

Cadence uses a configuration file (typically `cadence.yaml`) to manage detection thresholds, enabled strategies, and analysis behavior.

## Creating a Configuration File

Create a `cadence.yaml` file in your project root:

```yaml
# cadence.yaml - Cadence Configuration

# Detection Thresholds
thresholds:
  # Git analysis thresholds
  git:
    # Velocity: lines per minute
    velocity:
      min: 500  # Minimum lines/min to flag
      max: 2000 # Maximum lines/min
    
    # Size: total lines changed
    size:
      min: 300
    
    # Timing: unusual commit hours
    timing:
      suspicious_hours: [0,1,2,3,4,5]
    
    # Statistical anomalies
    stats:
      outlier_threshold: 2.5
  
  # Web analysis thresholds
  web:
    generic_language_ratio: 0.15
    perfect_grammar_ratio: 0.10
    overused_phrases_ratio: 0.08
    uniformity_ratio: 0.20

# Enabled Strategies
strategies:
  git:
    - velocity
    - size
    - timing
    - statistics
    - merging
    - dispersion
    - ratios
    - precision
  
  web:
    - generic_language
    - perfect_grammar
    - overused_phrases
    - sentence_uniformity

# AI Validation (Optional)
ai:
  enabled: false
  model: "gpt-4o-mini"

# Analysis Options
analysis:
  min_confidence: 0.3
  max_commits: 1000
  exclude_patterns:
    - "*.lock"

# Reporter Options
reporting:
  format: "json"
  include_details: true
  sort_by: "confidence"
```

## Using Your Configuration

Load configuration with Cadence commands:

```bash
$ cadence analyze --config cadence.yaml
$ cadence web https://example.com --config cadence.yaml
```

## Next Steps

Learn about [Detection Strategies](/docs/detection-strategies) or check [API Reference](/docs/api-reference).
