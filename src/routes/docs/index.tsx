import { createFileRoute } from "@tanstack/react-router";
import indexMd from "../../../docs/index.md?raw";
import { DocsLayout } from "../../components/layouts/DocsLayout";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";

const SITE_URL = "https://noslop.tech";
const DOCS_IMAGE = `${SITE_URL}/og-docs.png`;

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

export const Route = createFileRoute("/docs/")({
	loader: () => parseMarkdown(indexMd),
	head: ({ loaderData }) => ({
		meta: [
			{ title: `${loaderData.title} | Cadence Docs` },
			{
				name: "description",
				content:
					loaderData.description ||
					"Cadence documentation - Learn how to detect AI-generated content in Git repositories and websites.",
			},
			{ property: "og:title", content: `${loaderData.title} | Cadence Docs` },
			{
				property: "og:description",
				content:
					loaderData.description ||
					"Cadence documentation - Learn how to detect AI-generated content in Git repositories and websites.",
			},
			{ property: "og:image", content: DOCS_IMAGE },
			{ property: "og:url", content: `${SITE_URL}/docs/` },
			{ name: "twitter:image", content: DOCS_IMAGE },
			{ name: "twitter:title", content: `${loaderData.title} | Cadence Docs` },
			{
				name: "twitter:description",
				content:
					loaderData.description ||
					"Cadence documentation - Learn how to detect AI-generated content in Git repositories and websites.",
			},
		],
	}),
	component: DocsIndexPage,
});

function DocsIndexPage() {
	const { markdown, title, description } = Route.useLoaderData();

	return (
		<DocsLayout title={title} description={description}>
			<MarkdownRenderer content={markdown} />
		</DocsLayout>
	);
}
