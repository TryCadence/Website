# Detection Strategies

Cadence uses 38 comprehensive detection strategies that work together to identify AI-generated content. Each strategy analyzes different aspects and contributes to the final suspicion score.

## Git Repository Detection Strategies

Cadence applies 18 strategies to Git commit analysis. Each examines specific patterns in commit metadata, code changes, and repository history.

### 1. Velocity Analysis

Measures how fast code is being added or deleted (additions/deletions per minute).

**How it works:**
- Calculates total additions and deletions in a commit
- Divides by the time taken to make the commit
- Compares against configured threshold

**Suspicious indicators:**
- 100+ additions per minute suggests automated or generated code
- Consistent high velocity across multiple commits
- Extreme values (1000+ per minute) indicate batch operations

**Example:**
- Commit: 5000 additions in 10 minutes = 500 adds/min (very suspicious)
- Human baseline: 20-50 adds/min is typical

### 2. Size Analysis

Flags commits that modify too many lines of code in a single commit.

**How it works:**
- Counts total additions and deletions per commit
- Compares against `suspicious_additions` and `suspicious_deletions` thresholds
- Flags if either exceeds configured limit

**Suspicious indicators:**
- Single commits with 500+ line additions
- 1000+ line deletions suggests bulk deletion
- Commits affecting many unrelated files

**Example:**
- Commit: 5000 additions (default threshold: 500) = suspicious
- Typical human commit: 50-200 lines

### 3. Timing Analysis

Detects unusual timing patterns between commits.

**How it works:**
- Measures seconds between consecutive commits
- Compares against `min_time_delta_seconds` threshold
- Flags rapid-fire commits suggesting automation

**Suspicious indicators:**
- Multiple commits within seconds of each other
- Perfectly regular intervals (e.g., every 60 seconds)
- Commits at unusual hours (2-6 AM consistently)

**Example:**
- Commits at 00:00, 00:01, 00:02 = suspicious pattern
- Typical human: varied intervals of minutes to hours

### 4. File Dispersion Analysis

Examines how many files are modified per commit.

**How it works:**
- Counts unique files modified in each commit
- Compares against `max_files_per_commit` threshold
- Flags commits affecting too many files

**Suspicious indicators:**
- Single commit touching 50+ files
- Changes across unrelated modules in one commit
- Systematic changes to entire codebase at once

**Example:**
- Commit touches: src/module1/, src/module2/, config/, tests/, docs/ = 30+ files (suspicious)
- Typical human: focused on 1-3 related files

### 5. Ratio Analysis

Analyzes the balance between additions and deletions.

**How it works:**
- Calculates additions vs deletions ratio
- Compares against `max_addition_ratio` threshold
- Flags imbalanced commits

**Suspicious indicators:**
- Heavily weighted toward additions (95%+ additions)
- No corresponding cleanup or deletion
- Suggests copy-paste or generated code without refactoring

**Example:**
- Commit: 1000 additions, 10 deletions = 99% additions (suspicious)
- Typical human: more balanced ratio of 60-70% additions

### 6. Commit Message Analysis

Detects vague, generic, or auto-generated commit messages.

**How it works:**
- Examines commit message text
- Flags generic phrases and single-word messages
- Detects boilerplate or template messages

**Suspicious indicators:**
- Single word messages: "fix", "update", "refactor"
- Generic phrases: "made changes", "code review", "improvements"
- Missing or whitespace-only messages
- Suspiciously generic English

**Example:**
- Message: "update" = generic (suspicious)
- Message: "Fix null pointer exception in UserService.handleAuth()" = specific (normal)

### 7. Naming Pattern Analysis

Examines variable and function naming conventions.

**How it works:**
- Analyzes identifiers in changed code
- Detects overly generic or uniform naming
- Flags inconsistent conventions

**Suspicious indicators:**
- Generic names: var1, temp, data, obj, item
- Inconsistent naming across files
- Missing semantic meaning
- Uniform patterns suggesting template generation

**Example:**
- Variables: `temp`, `x`, `i`, `d` = generic (suspicious)
- Variables: `userName`, `userEmail`, `userAge` = semantic (normal)

### 8. Structural Consistency Analysis

Detects overly uniform code structure.

**How it works:**
- Examines code organization and structure
- Flags repetitive patterns across files
- Detects template-like generation

**Suspicious indicators:**
- Every file follows identical structure
- Repetitive class/function patterns
- Uniform indentation and formatting across unrelated modules
- Suggests automated generation

**Example:**
- Every class has identical method ordering = suspicious
- Natural variation in code organization = normal

### 9. Error Handling Analysis

Evaluates presence and quality of error handling.

**How it works:**
- Detects missing try-catch blocks
- Identifies generic error handling
- Flags commits with no error checking

**Suspicious indicators:**
- Code lacking error handling entirely
- Generic error handlers catching all exceptions
- Missing validation for external inputs
- Suggests incomplete or AI-generated code

**Example:**
- Code with no error checking on API calls = suspicious
- Proper error handling with specific exceptions = normal

### 10. File Extension Pattern Analysis

Examines what types of files are being modified.

**How it works:**
- Tracks file extensions in commits
- Detects unusual patterns
- Flags test/temporary files in commits

**Suspicious indicators:**
- Commits touching only test files
- Modification of temporary or cache files
- Unusual file type combinations
- Suggests incomplete development

**Example:**
- Commit modifying only `.tmp`, `.log`, `__pycache__/` = suspicious
- Commit modifying `.py` source files = normal

### 11. Statistical Anomaly Detection

Identifies deviations from repository baseline patterns.

**How it works:**
- Calculates baseline metrics for the repository
- Detects commits that deviate significantly
- Flags statistical outliers

**Suspicious indicators:**
- Commit drastically different from repository average
- Sudden changes in velocity or file modification
- Outlier values in statistical analysis

**Example:**
- Repository average: 100 additions per commit
- Anomalous commit: 5000 additions = 50x deviation (suspicious)

### 12. Burst Pattern Analysis

Identifies clusters of rapid commits.

**How it works:**
- Detects multiple commits in quick succession
- Measures commit clustering
- Flags burst patterns

**Suspicious indicators:**
- 10+ commits in 1 minute
- Regular burst patterns (every X minutes)
- Synchronized bursts across multiple developers

**Example:**
- 20 commits in 30 seconds = burst pattern (suspicious)
- Commits spread throughout day = normal distribution

### 13. Timing Anomaly Detection

Detects commits at unusual times or frequencies.

**How it works:**
- Analyzes commit timestamps
- Detects non-human patterns
- Flags timezone inconsistencies

**Suspicious indicators:**
- Commits consistently at 3-5 AM
- Commits with no hours/days off
- Timezone inconsistencies between commits
- Suggests automated or scheduled jobs

**Example:**
- Commits: 2:00 AM, 2:30 AM, 3:00 AM every night = suspicious
- Commits during business hours with weekends off = normal

### 14. Merge Commit Detection

Analyzes merge commit patterns for unusual behavior.

**How it works:**
- Identifies merge commits in the commit history
- Analyzes merge patterns and frequency
- Detects unusual merge strategies

**Suspicious indicators:**
- Excessive or frequent merge commits
- Unusual merge patterns indicating automated branching
- Merge commits with no legitimate branch merges

### 15. Precision Analysis

Examines code pattern consistency and precision.

**How it works:**
- Analyzes consistency of code structure across commits
- Detects overly precise or mechanical patterns
- Compares against human-like variability

**Suspicious indicators:**
- Perfectly consistent code formatting across all commits
- Identical patterns repeated without variation
- No human-like inconsistencies or style variations

### 16. Template Pattern Detection

Identifies template-like or boilerplate code patterns.

**How it works:**
- Recognizes common template patterns in code
- Detects repetitive code blocks
- Flags systematic template application

**Suspicious indicators:**
- Extensive use of code templates
- Identical code blocks across files
- Systematic template application without customization

### 17. Emoji Usage Detection

Detects excessive or unusual emoji patterns in commit messages.

**How it works:**
- Analyzes emoji frequency in commits
- Detects emoji-only commits
- Calculates emoji-to-text ratios

**Suspicious indicators:**
- 3+ emojis per commit message
- Emoji-only commits
- Emoji ratio >20% of commit message

### 18. Special Character Detection

Identifies overused or unusual special character patterns.

**How it works:**
- Counts special characters (hyphens, asterisks, underscores)
- Detects consecutive patterns
- Analyzes special character density

**Suspicious indicators:**
- 5+ hyphens, 4+ asterisks, or 4+ underscores
- Consecutive special character patterns
- Unusual decorative character usage

## Web Content Detection Strategies

Cadence analyzes website content with 20 distinct strategies for patterns commonly found in AI-generated text.

### 1. Generic Language Detection

Identifies overused, generic phrases common in AI output.

**Suspicious patterns:**
- "In today's world" or "In the modern era"
- "It is important to note that"
- "Cutting-edge solutions" or "innovative approach"
- "Maximize efficiency" or "optimize productivity"

**Why it matters:**
AI models are trained on common phrases and reuse them frequently. Human writing is more varied.

**Example:**
- Page full of: "In today's fast-paced world..." = suspicious
- Specific, unique phrasing = normal

### 2. Perfect Grammar Detection

Identifies passages with suspiciously uniform grammar and punctuation.

**Suspicious patterns:**
- Every sentence perfectly grammatical
- Uniform sentence structure across entire page
- No contractions or colloquialisms
- Excessively formal throughout

**Why it matters:**
Real human writing has natural variations and occasional imperfections. AI can produce text that's *too* correct.

**Example:**
- "The implementation was executed flawlessly. The results were optimized accordingly." (repeated pattern)
- Natural variation in structure = normal

### 3. Placeholder Pattern Detection

Finds common filler and placeholder patterns.

**Suspicious patterns:**
- "[noun] that [verb]" constructions repeated
- Generic section headers: "Overview", "Benefits", "Conclusion"
- Repetitive intro paragraphs
- Placeholder-style language

**Why it matters:**
AI often generates template-like content with repetitive structures. Human writing has more natural variation.

**Example:**
- Every section starts with identical structure = suspicious
- Varied section organization = normal

### 4. Boilerplate Content Detection

Identifies reused or templated text.

**Suspicious patterns:**
- Identical disclaimers appearing in content
- Standard license text in prose
- Repeated descriptions across pages
- Stock phrases in multiple contexts

**Why it matters:**
AI can generate identical sections. Humans typically adapt content to context.

**Example:**
- Same paragraph on 5 different product pages = suspicious
- Unique content per page = normal

### 8. Emoji Overuse Detection

Detects excessive or misplaced emoji usage in web content.

**How it works:**
- Counts emoji frequency in content
- Analyzes emoji-to-word ratios
- Flags inappropriate emoji usage

**Suspicious indicators:**
- High emoji density in professional content
- Emoji in unexpected contexts
- Random or decorative emoji placement

### 9. Special Character Detection

Identifies unusual special character patterns in web content.

**How it works:**
- Analyzes special character usage
- Detects decorative patterns
- Flags excessive punctuation

**Suspicious indicators:**
- Excessive dashes, asterisks, or underscores
- Decorative separators
- Unusual punctuation patterns

### 10. Missing Alt Text Detection

Flags images without accessibility descriptions.

**How it works:**
- Scans for `<img>` tags
- Checks for `alt` attribute presence
- Validates alt text quality

**Suspicious indicators:**
- Images without alt attributes
- Empty or placeholder alt text
- Low alt-to-image ratio

### 11. Semantic HTML Detection

Identifies improper HTML tag usage (excessive divs vs semantic tags).

**How it works:**
- Counts div vs semantic tag usage
- Analyzes HTML structure
- Flags poor semantic markup

**Suspicious indicators:**
- Excessive div usage (>70% of structure)
- Missing semantic tags (nav, header, section, etc.)
- Poor HTML semantics

### 12. Accessibility Markers Detection

Detects missing ARIA labels, roles, and language attributes.

**How it works:**
- Checks for ARIA attributes
- Validates language attributes
- Analyzes accessibility coverage

**Suspicious indicators:**
- Missing aria-label attributes
- No role definitions
- Missing lang attributes

### 13. Heading Hierarchy Detection

Identifies non-sequential heading levels in HTML.

**How it works:**
- Analyzes h1-h6 tag sequence
- Validates heading hierarchy
- Flags skipped levels or out-of-order headings

**Suspicious indicators:**
- Skipped heading levels (h1 to h3)
- Multiple h1 tags
- Improper heading structure

### 14. Hardcoded Values Detection

Detects hardcoded pixels, colors, and values instead of using CSS variables.

**How it works:**
- Scans for inline styles
- Detects pixel values
- Identifies hardcoded colors

**Suspicious indicators:**
- Excessive inline styles
- Hardcoded pixel measurements
- Colors defined inline instead of in CSS

### 15. Form Issues Detection

Flags missing labels, improper input types, and form accessibility issues.

**How it works:**
- Analyzes form structure
- Checks for labels
- Validates input attributes

**Suspicious indicators:**
- Inputs without labels
- Missing placeholder text
- Improper input types

### 16. Generic Link Text Detection

Identifies generic link phrases like "click here" or "read more".

**How it works:**
- Extracts link text
- Matches against generic phrases
- Calculates link quality

**Suspicious indicators:**
- "Click here" links
- "Read more" without context
- Generic or non-descriptive link text

### 17. Generic Styling Detection

Detects default colors, missing custom theming, and lack of design personality.

**How it works:**
- Analyzes CSS variables and theming
- Detects media queries
- Checks for custom styling

**Suspicious indicators:**
- Default color schemes
- No CSS variables or theming
- Missing responsive design

### 18. Overused Phrases Detection

Identifies common AI phrases and clichés in content.

**How it works:**
- Scans for common AI phrases
- Analyzes phrase frequency
- Flags repetitive language

**Suspicious indicators:**
- "In today's world"
- "Furthermore" and excessive connectors
- "Cutting-edge" and "innovative" overuse

### 19. Perfect Grammar Detection

Flags unnaturally perfect grammar and sentence construction.

**How it works:**
- Analyzes sentence structure
- Detects missing contractions
- Flags overly polished writing

**Suspicious indicators:**
- No contractions in casual content
- Perfectly complex sentences
- Unnaturally perfect punctuation

### 20. Boilerplate Content Detection

Identifies template-like or cookie-cutter content patterns.

**How it works:**
- Recognizes boilerplate phrases
- Detects repetitive patterns
- Flags templated sections

**Suspicious indicators:**
- "Award-winning" repeated phrases
- "Our mission" and standard templates
- Identical sections across pages

## Summary

The 38 total strategies (18 Git + 20 Web) work together to identify AI-generated content with high accuracy. Each strategy contributes to a confidence score, with multiple triggering strategies indicating higher likelihood of AI generation.**Example:**
- Every product description: 3 paragraphs, 5 bullet points, identical structure = suspicious
- Varied content structure = normal

### 6. Specificity Analysis

Evaluates whether content lacks specific details.

**Suspicious patterns:**
- Vague descriptions without numbers or examples
- Missing concrete metrics or data
- No author attribution or credentials
- Lack of specific details about methods or results

**Why it matters:**
AI-generated content often avoids specifics. Human writing includes concrete details.

**Example:**
- "Improves performance" (no numbers) = suspicious
- "Reduced load time by 45% from 2.3s to 1.26s" = specific and normal

### 7. Structural Pattern Detection

Examines overall organization and formatting patterns.

**Suspicious patterns:**
- Identical heading/subheading hierarchy across pages
- Uniform whitespace and padding
- Every section has identical structure
- Overly symmetrical layout

**Why it matters:**
AI tends to generate perfectly structured content. Human writing has natural organic variation.

**Example:**
- Every page: H1, 3x H2, 2 paragraphs per H2 = suspicious
- Varied structure based on content = normal

## How Scoring Works

Cadence doesn't flag content based on a single strategy match. Instead:

1. **Individual scores** - Each strategy produces a score from 0-100
2. **Consensus** - Commitment is flagged when multiple strategies report high scores
3. **Weighting** - Some strategies are weighted more heavily
4. **Final result** - Overall suspicion from 0-100

A commit flagged by 5+ strategies is far more likely to be suspicious than one flagged by a single strategy.

## Configuring Strategies

Adjust detection sensitivity via configuration file:

```yaml
thresholds:
  # Adjust these values to tune detection sensitivity
  suspicious_additions: 500       # Lower = more sensitive
  suspicious_deletions: 1000
  max_additions_per_min: 100      # Lower = stricter
  min_time_delta_seconds: 60      # Higher = less sensitive
  max_files_per_commit: 50        # Lower = more restrictive
  max_addition_ratio: 0.95        # Lower = stricter
```

## Next Steps

- [Repository Analysis](/docs/analysis/repository) - How strategies combine for repository analysis
- [Web Analysis](/docs/analysis/web) - Web content analysis guide
- [CLI Commands](/docs/cli/commands) - How to run analyses
