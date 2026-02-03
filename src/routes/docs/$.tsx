import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://noslop.tech";
const DOCS_IMAGE = `${SITE_URL}/og-docs.png`;

// Import all markdown files statically for Cloudflare Workers compatibility
// Getting Started section
import gettingStartedIndexMd from "../../../docs/getting-started/index.md?raw";
import gettingStartedInstallationMd from "../../../docs/getting-started/installation.md?raw";
import gettingStartedQuickStartMd from "../../../docs/getting-started/quick-start.md?raw";
import gettingStartedQuickReferenceMd from "../../../docs/getting-started/quick-reference.md?raw";
import gettingStartedConfigurationMd from "../../../docs/getting-started/configuration.md?raw";

import cliIndexMd from "../../../docs/cli/index.md?raw";
import cliCommandsMdNew from "../../../docs/cli/commands.md?raw";
import cliDetectionStrategiesMd from "../../../docs/cli/detection-strategies.md?raw";

import analysisIndexMd from "../../../docs/analysis/index.md?raw";
import analysisRepositoryMd from "../../../docs/analysis/repository.md?raw";
import analysisGitMd from "../../../docs/analysis/git.md?raw";
import analysisWebMd from "../../../docs/analysis/web.md?raw";

import aiIndexMd from "../../../docs/ai/index.md?raw";
import aiConfigurationMd from "../../../docs/ai/configuration.md?raw";
import aiExamplesMd from "../../../docs/ai/examples.md?raw";

import integrationsIndexMd from "../../../docs/integrations/index.md?raw";
import integrationsAgentSkillsMd from "../../../docs/integrations/agent-skills.md?raw";
import integrationsWebhooksMd from "../../../docs/integrations/webhooks.md?raw";

import referenceIndexMd from "../../../docs/reference/index.md?raw";
import referenceAdvancedConfigMd from "../../../docs/reference/advanced-configuration.md?raw";
import referenceBuildDevMd from "../../../docs/reference/build-development.md?raw";
import referenceTroubleshootingMd from "../../../docs/reference/troubleshooting.md?raw";
import referenceDisclaimerMd from "../../../docs/reference/disclaimer.md?raw";

import communityIndexMd from "../../../docs/community/index.md?raw";
import communityContributingMd from "../../../docs/community/contributing.md?raw";
import communitySecurityMd from "../../../docs/community/security.md?raw";

import { DocsLayout } from "../../components/layouts/DocsLayout";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";

const docsMap: Record<string, string> = {
	// Section index pages
	"getting-started": gettingStartedIndexMd,
	"cli": cliIndexMd,
	"analysis": analysisIndexMd,
	"integrations": integrationsIndexMd,
	"reference": referenceIndexMd,
	"community": communityIndexMd,
	
	// Getting Started section
	"getting-started/installation": gettingStartedInstallationMd,
	"getting-started/quick-start": gettingStartedQuickStartMd,
	"getting-started/quick-reference": gettingStartedQuickReferenceMd,
	"getting-started/configuration": gettingStartedConfigurationMd,
	
	// CLI section
	"cli/commands": cliCommandsMdNew,
	"cli/detection-strategies": cliDetectionStrategiesMd,
	
	// Analysis section
	"analysis/repository": analysisRepositoryMd,
	"analysis/git": analysisGitMd,
	"analysis/web": analysisWebMd,
	
	// AI section
	"ai": aiIndexMd,
	"ai/configuration": aiConfigurationMd,
	"ai/examples": aiExamplesMd,
	
	// Integrations section
	"integrations/agent-skills": integrationsAgentSkillsMd,
	"integrations/webhooks": integrationsWebhooksMd,
	
	// Reference section
	"reference/advanced-configuration": referenceAdvancedConfigMd,
	"reference/build-development": referenceBuildDevMd,
	"reference/troubleshooting": referenceTroubleshootingMd,
	"reference/disclaimer": referenceDisclaimerMd,
	
	// Community section
	"community/contributing": communityContributingMd,
	"community/security": communitySecurityMd,
	
	// Legacy routes (redirect to new locations)
	installation: gettingStartedInstallationMd,
	"quick-start": gettingStartedQuickStartMd,
	configuration: gettingStartedConfigurationMd,
	"quick-reference": gettingStartedQuickReferenceMd,
	"cli-commands": cliCommandsMdNew,
	"detection-strategies": cliDetectionStrategiesMd,
	"repository-analysis": analysisRepositoryMd,
	"git-analysis-guide": analysisGitMd,
	"web-analysis-guide": analysisWebMd,
	"agent-skills": integrationsAgentSkillsMd,
	"api-webhooks": integrationsWebhooksMd,
	"advanced-configuration": referenceAdvancedConfigMd,
	"build-development": referenceBuildDevMd,
	"troubleshooting-guide": referenceTroubleshootingMd,
	disclaimer: referenceDisclaimerMd,
	contributing: communityContributingMd,
	security: communitySecurityMd,
};

function parseMarkdown(content: string) {
	// Normalize line endings to LF
	const normalized = content.replace(/\r\n/g, "\n");
	const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
	const match = normalized.match(frontmatterRegex);

	if (match) {
		const frontmatter = match[1];
		const markdown = match[2];
		const title =
			frontmatter.match(/title:\s*(.+)/)?.[1]?.trim() || "Documentation";
		const description =
			frontmatter.match(/description:\s*(.+)/)?.[1]?.trim() || "";

		return { markdown, title, description };
	}

	// No frontmatter - extract title from first # heading
	const headingMatch = normalized.match(/^#\s+(.+)$/m);
	const title = headingMatch?.[1]?.trim() || "Documentation";
	
	// Extract description from first paragraph after the heading
	const descriptionMatch = normalized.match(/^#\s+.+\n\n(.+?)(?:\n\n|$)/m);
	const description = descriptionMatch?.[1]?.trim() || "";

	return { markdown: content, title, description };
}

export const Route = createFileRoute("/docs/$")({
	loader: ({ params }) => {
		const slug = params._splat || "index";
		const content = docsMap[slug];

		if (!content) {
			throw new Error(`Documentation not found: ${slug}`);
		}

		return { ...parseMarkdown(content), slug };
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: `${loaderData.title} | Cadence Docs` },
			{
				name: "description",
				content:
					loaderData.description ||
					"Cadence documentation for AI content detection.",
			},
			{ property: "og:title", content: `${loaderData.title} | Cadence Docs` },
			{
				property: "og:description",
				content:
					loaderData.description ||
					"Cadence documentation for AI content detection.",
			},
			{ property: "og:image", content: DOCS_IMAGE },
			{ property: "og:url", content: `${SITE_URL}/docs/${loaderData.slug}` },
			{ name: "twitter:image", content: DOCS_IMAGE },
			{ name: "twitter:title", content: `${loaderData.title} | Cadence Docs` },
			{
				name: "twitter:description",
				content:
					loaderData.description ||
					"Cadence documentation for AI content detection.",
			},
		],
	}),
	component: DocsPage,
});

function DocsPage() {
	const { markdown, title, description, slug } = Route.useLoaderData();

	return (
		<DocsLayout title={title} description={description} content={markdown} slug={slug}>
			<MarkdownRenderer content={markdown} />
		</DocsLayout>
	);
}
