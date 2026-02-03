import { createFileRoute } from "@tanstack/react-router";
import indexMd from "../../../docs/index.md?raw";
import { DocsLayout } from "../../components/layouts/DocsLayout";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";

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

export const Route = createFileRoute("/docs/")({
	loader: () => parseMarkdown(indexMd),
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
