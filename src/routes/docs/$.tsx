import { createFileRoute } from "@tanstack/react-router";
import advancedConfigurationMd from "../../../docs/advanced-configuration.md?raw";
import agentSkillsMd from "../../../docs/agent-skills.md?raw";
import apiWebhooksMd from "../../../docs/api-webhooks.md?raw";
import buildDevelopmentMd from "../../../docs/build-development.md?raw";
import cliCommandsMd from "../../../docs/cli-commands.md?raw";
import configurationMd from "../../../docs/configuration.md?raw";
import contributingMd from "../../../docs/contributing.md?raw";
import detectionStrategiesMd from "../../../docs/detection-strategies.md?raw";
import disclaimerMd from "../../../docs/disclaimer.md?raw";
import gitAnalysisGuideMd from "../../../docs/git-analysis-guide.md?raw";
// Import all markdown files statically for Cloudflare Workers compatibility
import installationMd from "../../../docs/installation.md?raw";
import quickReferenceMd from "../../../docs/quick-reference.md?raw";
import quickStartMd from "../../../docs/quick-start.md?raw";
import repositoryAnalysisMd from "../../../docs/repository-analysis.md?raw";
import securityMd from "../../../docs/security.md?raw";
import troubleshootingGuideMd from "../../../docs/troubleshooting-guide.md?raw";
import webAnalysisGuideMd from "../../../docs/web-analysis-guide.md?raw";
import { DocsLayout } from "../../components/layouts/DocsLayout";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";

const docsMap: Record<string, string> = {
	installation: installationMd,
	"quick-start": quickStartMd,
	configuration: configurationMd,
	"detection-strategies": detectionStrategiesMd,
	"git-analysis-guide": gitAnalysisGuideMd,
	"web-analysis-guide": webAnalysisGuideMd,
	"troubleshooting-guide": troubleshootingGuideMd,
	"advanced-configuration": advancedConfigurationMd,
	"repository-analysis": repositoryAnalysisMd,
	"quick-reference": quickReferenceMd,
	"cli-commands": cliCommandsMd,
	"build-development": buildDevelopmentMd,
	disclaimer: disclaimerMd,
	"agent-skills": agentSkillsMd,
	"api-webhooks": apiWebhooksMd,
	contributing: contributingMd,
	security: securityMd,
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

	return { markdown: content, title: "Documentation", description: "" };
}

export const Route = createFileRoute("/docs/$")({
	loader: ({ params }) => {
		const slug = params._splat || "index";
		const content = docsMap[slug];

		if (!content) {
			throw new Error(`Documentation not found: ${slug}`);
		}

		return parseMarkdown(content);
	},
	component: DocsPage,
});

function DocsPage() {
	const { markdown, title, description } = Route.useLoaderData();

	return (
		<DocsLayout title={title} description={description}>
			<MarkdownRenderer content={markdown} />
		</DocsLayout>
	);
}
