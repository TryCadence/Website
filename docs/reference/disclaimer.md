# Disclaimer

Important information about Cadence's capabilities, limitations, and responsible use.

## What Cadence Is

Cadence is a **detection tool** designed to assist in identifying AI-generated content through pattern analysis. It examines:

- **Git repositories** - Analyzes commit patterns, velocity, timing, and code structure
- **Websites** - Scans content for patterns common in AI-generated text

Cadence provides **probabilistic estimates** to flag suspicious content for human review.

## Critical Limitations

### No Perfect Accuracy

Cadence **cannot guarantee 100% accuracy**. AI detection is inherently challenging because:

- **AI is always evolving** - New models produce different outputs
- **Human writing varies** - Some humans write like AI naturally
- **Context matters** - Technical writing often uses formulaic language
- **Adversarial techniques** - Prompt engineering can evade detection

### False Positives

Cadence may flag human-written content as AI-generated when:

- Code is auto-generated but legitimate (build tools, generators, migrations)
- Writing follows formulaic patterns (technical docs, boilerplate, templates)
- Non-native English speakers exhibit different writing patterns
- Large refactors or bulk commits occur (legitimate developer activity)
- Boilerplate code is reused across modules

**Examples:**
- Lock files (package-lock.json) are technically auto-generated but legitimate
- Technical documentation often uses repetitive structure
- Large commits during refactoring aren't necessarily suspicious
- Consistent code style across a codebase isn't inherently problematic

### False Negatives

Cadence may miss AI-generated content when:

- AI models improve and create more "human-like" output
- Content is heavily edited after generation
- New AI generation techniques emerge
- Prompt engineering produces less detectable patterns
- Models are fine-tuned on human-written content

**Examples:**
- AI-generated code that's been hand-edited by humans
- New models not yet seen in training data
- Sophisticated prompting that produces legitimate-looking output
- AI used for legitimate assistance (not malicious intent)

## Confidence Scores

**What they mean:**
- Confidence scores are **probabilistic estimates**, not certainties
- Higher scores suggest higher likelihood of AI-generated content
- They are **not proof** of AI generation

**How to interpret:**
- **0.0-0.3** - Likely human-written
- **0.3-0.6** - Uncertain, manual review recommended
- **0.6-0.8** - Likely AI-generated, warrants investigation
- **0.8-1.0** - Very likely AI-generated, but verify manually

**Never rely on scores alone** for definitive conclusions.

## What Cadence Is NOT

Cadence is **not**:

- ❌ A definitive proof that content is AI-generated
- ❌ A replacement for human judgment and review
- ❌ A tool for making accusations without investigation
- ❌ Legally binding verification
- ❌ Suitable for punitive action without human review
- ❌ An endorsement that flagged content is malicious

## Recommended Use

### Good Uses

- ✅ **Initial screening** of large codebases or content libraries
- ✅ **Flagging suspicious content** for human review
- ✅ **Trend analysis** across repositories over time
- ✅ **Awareness** of potential AI-assisted contributions
- ✅ **Educational purposes** to understand AI patterns
- ✅ **Voluntary internal monitoring** of your own teams
- ✅ **Security testing** to identify potential vulnerabilities

### Problematic Uses

- ❌ **Automatic rejection** of flagged content without review
- ❌ **Public accusations** based on Cadence results alone
- ❌ **Disciplinary action** without human investigation
- ❌ **Mass surveillance** of developers or writers
- ❌ **Punitive systems** that penalize flagged content
- ❌ **Discrimination** based on Cadence scores
- ❌ **Replacing human expertise** with automated tools

## Ethical Considerations

Use Cadence responsibly:

### 1. Don't Make Accusations

- **Never** publicly claim code is AI-generated based solely on Cadence
- **Always** follow up with human review and investigation
- **Consider context** - AI assistance isn't inherently wrong

### 2. Investigate Thoroughly

Before taking action based on Cadence results:

- Review the actual code or content
- Consider alternative explanations
- Look for nuance and context
- Talk to the author if possible
- Consult domain experts

### 3. Respect Privacy and Laws

- **Respect privacy** when analyzing content
- **Follow applicable laws** in your jurisdiction (GDPR, CCPA, etc.)
- **Get permission** before analyzing others' content
- **Communicate transparently** about how/why you use detection tools

### 4. Consider Context

AI assistance isn't always bad:

- Some legitimate uses exist (code generation, refactoring suggestions)
- Different contexts have different appropriateness
- Blanket policies may harm legitimate users
- Nuance and judgment are required

### 5. Be Transparent

If using Cadence in professional settings:

- **Tell people** you're using detection tools
- **Explain limitations** transparently
- **Describe your process** for verification
- **Allow appeals** and human review
- **Avoid surprise accusations**

## Known Constraints

### Supported Languages

- **Git analysis** - Works with any programming language
- **Web analysis** - Currently optimized for English

### Repository Size

- Works with repositories of any size
- May be slow with extremely large repos (100,000+ commits)
- Recommend analyzing specific branches for very large repos

### Webhook Limitations

- Job timeout: 5 minutes per analysis
- Concurrent workers: Configurable (default 4)
- Job queue: 100 pending jobs

## Contributing to Improvement

Cadence is open source. You can help improve it:

- **Report false positives/negatives** - [GitHub Issues](https://github.com/TryCadence/Cadence/issues)
- **Submit improvements** - [Pull Requests](https://github.com/TryCadence/Cadence/pulls)
- **Share feedback** - [Discussions](https://github.com/TryCadence/Cadence/discussions)
- **Test detection** - Help identify accuracy issues
- **Star the repository** - Show support for the project

## Ongoing Development

Cadence is actively maintained and improved:

- **Detection refinement** - Continuously improving pattern recognition
- **New strategies** - Adding detection methods as AI evolves
- **Bug fixes** - Addressing issues as discovered
- **Performance** - Optimizing speed and accuracy
- **Documentation** - Keeping guides current

## Legal & Liability

### No Warranty

Cadence is provided "as is" without any warranty, express or implied.

### No Liability

The authors are not liable for:
- Damages from using this tool
- Consequences of Cadence's results
- False positives or false negatives
- Decisions made based on Cadence output
- Any other issues arising from use

### License

Cadence is licensed under **AGPL-3.0**. See [LICENSE](https://github.com/TryCadence/Cadence/blob/main/LICENSE) for details.

## Questions?

- 📖 See [Full Documentation](/docs)
- 🐛 [Report Issues](https://github.com/TryCadence/Cadence/issues)
- 💬 [GitHub Discussions](https://github.com/TryCadence/Cadence/discussions)
- 🔒 [Security Policy](/docs/security)

---

**Remember:** Cadence is a tool to **assist** human judgment, not replace it. Always use good judgment and conduct proper investigation before taking action based on Cadence results.
