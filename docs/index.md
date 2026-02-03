---
title: Documentation
description: Learn how to use Cadence to detect AI-generated content
---

# Welcome to Cadence

Cadence is an open-source CLI tool that detects AI-generated content in Git repositories and websites. It uses pattern-based detection strategies combined with optional AI validation to identify suspicious content.

Whether you're auditing code commits or analyzing web content, Cadence provides comprehensive analysis with confidence scores and detailed reporting.

## Get Started

### [Installation](/docs/installation)
Quick setup guide for all platforms including Windows, macOS, and Linux.

### [Quick Start](/docs/quick-start)
Get up and running with Cadence in just a few minutes with basic examples.

### [Quick Reference](/docs/quick-reference)
Fast lookup guide for common commands and configurations.

### [Configuration](/docs/configuration)
Customize detection thresholds and strategies to fit your needs.

### [Build & Development](/docs/build-development)
Build from source, use Make convenience targets, and set up your development environment.

## CLI & Usage

### [CLI Commands](/docs/cli-commands)
Complete reference of all Cadence commands including `analyze`, `web`, `config`, `webhook`, and `version`.

### [Detection Strategies](/docs/detection-strategies)
Overview of all 16 detection strategies for Git and web analysis.

## Analysis Guides

### [Repository Analysis](/docs/repository-analysis)
Best practices for analyzing Git repositories with real-world examples and workflows.

### [Git Analysis Deep Dive](/docs/git-analysis-guide)
Comprehensive guide to Git repository analysis including remote GitHub URL support.

### [Web Analysis Deep Dive](/docs/web-analysis-guide)
Complete guide to detecting AI-generated content on websites.

## Reference

### [Advanced Configuration](/docs/advanced-configuration)
Webhooks, AI validation, custom patterns, performance tuning, and multi-environment setup.

### [Troubleshooting](/docs/troubleshooting-guide)
Common issues, error messages, and solutions for Git analysis, web analysis, and configuration.

### [Disclaimer](/docs/disclaimer)
Important information about Cadence's limitations and ongoing development.

## Integration & Deployment

### [Agent Skills & Integration](/docs/agent-skills)
Use Cadence as an AI agent skill with Vercel's skills.sh ecosystem for programmatic integration.

### [API & Webhook Server](/docs/api-webhooks)
Deploy Cadence as a webhook server for continuous monitoring with GitHub, GitLab, and CI/CD integration.

## Community

### [Contributing Guide](/docs/contributing)
How to contribute to Cadence: setup, code style, testing, PR process, and community guidelines.

### [Security Policy](/docs/security)
Security practices, vulnerability reporting, supported versions, and best practices.

## Key Features

- **Git Repository Analysis**: Detect suspicious commits using 8 detection strategies
- **Remote Repository Support**: Analyze GitHub URLs directly with automatic cloning
- **Web Content Detection**: Analyze websites for AI-generated text patterns with 8 strategies
- **16 Detection Strategies**: Comprehensive pattern-based analysis for both Git and web
- **Confidence Scoring**: Get detailed scores with severity levels for each finding
- **Multiple Output Formats**: JSON and text reports with customizable output
- **Configuration Management**: Create configs with `cadence config init`
- **Webhook Server**: Deploy as a service for continuous monitoring
- **Optional AI Validation**: Integrate with OpenAI for additional analysis confidence
- **Make Convenience Targets**: Build, test, lint, and format with simple make commands

## Architecture

Cadence is built with Go (v1.24) for maximum performance and efficiency. It's designed as a modular system with a pluggable strategy architecture that allows for easy extension.

```
Cadence Architecture
├── Git Analysis Module
│   ├── Repository Analyzer
│   ├── Commit Pair Detection
│   └── Metrics Collection
├── Web Analysis Module
│   ├── Content Fetcher
│   ├── Pattern Detector
│   └── Optional AI Validation
├── Detection Strategies
│   ├── Core Strategies (Size, Velocity, Timing)
│   ├── Advanced Strategies (Precision, Consistency)
│   └── Custom Strategies (Pluggable)
├── Reporters
│   ├── JSON Reporter
│   ├── Text Reporter
│   └── Web Reporter
└── Webhook Server
    ├── API Handlers
    ├── Request Processor
    └── Result Storage
```