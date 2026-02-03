import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Bug,
	Calendar,
	ChevronDown,
	ChevronRight,
	Download,
	ExternalLink,
	GitCommit,
	Loader2,
	Plus,
	Tag,
	Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LogoIcon } from "../components/Logo";
import { Footer } from "../components/landing/Footer";

interface GitHubRelease {
	id: number;
	tag_name: string;
	name: string;
	body: string;
	published_at: string;
	html_url: string;
	prerelease: boolean;
	draft: boolean;
	assets: {
		name: string;
		download_count: number;
		browser_download_url: string;
	}[];
}

interface ParsedSection {
	type: "added" | "changed" | "fixed" | "technical" | "other";
	title: string;
	items: string[];
}

function parseReleaseBody(body: string): ParsedSection[] {
	if (!body) return [];

	const sections: ParsedSection[] = [];
	const normalized = body.replace(/\r\n/g, "\n");

	// Parse sections within the release body
	const sectionRegex =
		/### (Added|Changed|Fixed|Technical Details|Usage Examples|Known Limitations)\n([\s\S]*?)(?=###|$)/g;
	const sectionMatches = [...normalized.matchAll(sectionRegex)];

	for (const sectionMatch of sectionMatches) {
		const sectionTitle = sectionMatch[1];
		const sectionContent = sectionMatch[2].trim();

		let type: ParsedSection["type"] = "other";
		if (sectionTitle === "Added") type = "added";
		else if (sectionTitle === "Changed") type = "changed";
		else if (sectionTitle === "Fixed") type = "fixed";
		else if (sectionTitle === "Technical Details") type = "technical";

		// Parse items - look for bullet points or sub-sections
		const items: string[] = [];
		const lines = sectionContent.split("\n");
		let currentItem = "";

		for (const line of lines) {
			if (line.startsWith("- ") || line.startsWith("* ")) {
				if (currentItem) items.push(currentItem.trim());
				currentItem = line.slice(2);
			} else if (line.startsWith("#### ")) {
				if (currentItem) items.push(currentItem.trim());
				currentItem = `**${line.slice(5)}**`;
			} else if (line.trim() && currentItem) {
				currentItem += ` ${line.trim()}`;
			}
		}
		if (currentItem) items.push(currentItem.trim());

		if (items.length > 0) {
			sections.push({ type, title: sectionTitle, items });
		}
	}

	return sections;
}

function getSectionIcon(type: string) {
	switch (type) {
		case "added":
			return <Plus className="w-4 h-4" />;
		case "changed":
			return <Wrench className="w-4 h-4" />;
		case "fixed":
			return <Bug className="w-4 h-4" />;
		default:
			return <GitCommit className="w-4 h-4" />;
	}
}

function getSectionColor(type: string) {
	switch (type) {
		case "added":
			return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
		case "changed":
			return "text-amber-400 bg-amber-400/10 border-amber-400/20";
		case "fixed":
			return "text-red-400 bg-red-400/10 border-red-400/20";
		case "technical":
			return "text-blue-400 bg-blue-400/10 border-blue-400/20";
		default:
			return "text-white/60 bg-white/5 border-white/10";
	}
}

function ReleaseSection({ section }: { section: ParsedSection }) {
	const [expanded, setExpanded] = useState(section.type === "added");

	return (
		<div className="border border-white/5 rounded-lg overflow-hidden">
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				className="w-full flex items-center gap-3 px-4 py-3 bg-white/2 hover:bg-white/4 transition-colors text-left"
			>
				<span
					className={`flex items-center justify-center w-7 h-7 rounded-md border ${getSectionColor(section.type)}`}
				>
					{getSectionIcon(section.type)}
				</span>
				<span className="flex-1 font-medium text-white">{section.title}</span>
				<span className="text-xs text-white/40 mr-2">
					{section.items.length} items
				</span>
				{expanded ? (
					<ChevronDown className="w-4 h-4 text-white/40" />
				) : (
					<ChevronRight className="w-4 h-4 text-white/40" />
				)}
			</button>

			{expanded && (
				<div className="px-4 py-3 space-y-2 border-t border-white/5">
						{section.items.map((item) => (
							<div key={item} className="flex gap-3 text-sm">
							<span className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />
							<span
								className="text-white/70"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown formatting
								dangerouslySetInnerHTML={{
									__html: item
										.replace(
											/\*\*(.*?)\*\*/g,
											'<strong class="text-white font-medium">$1</strong>',
										)
										.replace(
											/`(.*?)`/g,
											'<code class="px-1.5 py-0.5 bg-white/5 rounded text-xs font-mono">$1</code>',
										),
								}}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function ReleaseCard({
	release,
	isLatest,
}: {
	release: GitHubRelease;
	isLatest: boolean;
}) {
	const _version = release.tag_name.replace(/^v/, "");
	const formattedDate = new Date(release.published_at).toLocaleDateString(
		"en-US",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		},
	);
	const sections = parseReleaseBody(release.body);
	const totalDownloads = release.assets.reduce(
		(sum, asset) => sum + asset.download_count,
		0,
	);

	return (
		<div className="relative">
			{/* Timeline line */}
			<div className="absolute left-6 top-14 bottom-0 w-px bg-white/10" />

			<div className="relative flex gap-6">
				{/* Timeline dot */}
				<div
					className={`relative z-10 mt-1 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
						isLatest
							? "bg-emerald-500/20 border-2 border-emerald-500/50"
							: "bg-white/5 border border-white/10"
					}`}
				>
					<Tag
						className={`w-5 h-5 ${isLatest ? "text-emerald-400" : "text-white/50"}`}
					/>
				</div>

				{/* Content */}
				<div className="flex-1 pb-12">
					<div className="flex flex-wrap items-center gap-3 mb-4">
						<h2 className="text-2xl font-bold text-white">
							{release.tag_name}
						</h2>
						{isLatest && (
							<span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
								Latest
							</span>
						)}
						{release.prerelease && (
							<span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
								Pre-release
							</span>
						)}
						<div className="flex items-center gap-1.5 text-sm text-white/40">
							<Calendar className="w-3.5 h-3.5" />
							{formattedDate}
						</div>
						{totalDownloads > 0 && (
							<div className="flex items-center gap-1.5 text-sm text-white/40">
								<Download className="w-3.5 h-3.5" />
								{totalDownloads.toLocaleString()} downloads
							</div>
						)}
						<a
							href={release.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors"
						>
							<ExternalLink className="w-3.5 h-3.5" />
							View on GitHub
						</a>
					</div>

					{/* Release name if different from tag */}
					{release.name && release.name !== release.tag_name && (
						<p className="text-white/60 mb-4">{release.name}</p>
					)}

					{sections.length > 0 ? (
						<div className="space-y-3">
						{sections.map((section) => (
							<ReleaseSection key={section.title} section={section} />
							))}
						</div>
					) : release.body ? (
						<div className="prose prose-invert prose-sm max-w-none">
							<div
								className="text-white/70 whitespace-pre-wrap"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown content
								dangerouslySetInnerHTML={{
									__html: release.body
										.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
										.replace(
											/`(.*?)`/g,
											'<code class="px-1.5 py-0.5 bg-white/5 rounded text-xs">$1</code>',
										)
										.replace(/\n/g, "<br/>"),
								}}
							/>
						</div>
					) : (
						<p className="text-white/40 italic">No release notes provided.</p>
					)}

					{/* Download assets */}
					{release.assets.length > 0 && (
						<div className="mt-4 pt-4 border-t border-white/5">
							<p className="text-xs text-white/40 mb-2">Downloads</p>
							<div className="flex flex-wrap gap-2">
								{release.assets.map((asset) => (
									<a
										key={asset.name}
										href={asset.browser_download_url}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
									>
										<Download className="w-3 h-3" />
										{asset.name}
									</a>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/changelog")({
	component: ChangelogPage,
});

function ChangelogPage() {
	const [releases, setReleases] = useState<GitHubRelease[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchReleases() {
			try {
				const response = await fetch(
					"https://api.github.com/repos/CodeMeAPixel/Cadence/releases",
					{
						headers: {
							Accept: "application/vnd.github.v3+json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch releases: ${response.status}`);
				}

				const data: GitHubRelease[] = await response.json();
				// Filter out drafts
				setReleases(data.filter((r) => !r.draft));
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load releases",
				);
			} finally {
				setLoading(false);
			}
		}

		fetchReleases();
	}, []);

	return (
		<div className="min-h-screen bg-[#09090b] text-white">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full">
				<div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-md border-b border-white/5" />
				<div className="relative max-w-4xl mx-auto px-6">
					<div className="flex items-center justify-between h-14">
						<Link to="/" className="flex items-center gap-2 group">
							<LogoIcon size={20} />
							<span className="font-semibold text-white">Cadence</span>
						</Link>
						<nav className="flex items-center gap-4">
							<Link
								to="/docs"
								className="text-sm text-white/50 hover:text-white transition-colors"
							>
								Docs
							</Link>
							<a
								href="https://github.com/CodeMeAPixel/Cadence/releases"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
							>
								GitHub
								<ExternalLink className="w-3 h-3" />
							</a>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero */}
			<div className="relative border-b border-white/5">
				<div className="max-w-4xl mx-auto px-6 py-16">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>

					<h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
					<p className="text-lg text-white/60 max-w-2xl">
						All releases for Cadence, pulled directly from{" "}
						<a
							href="https://github.com/CodeMeAPixel/Cadence/releases"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/80 underline underline-offset-2 hover:text-white"
						>
							GitHub Releases
						</a>
						.
					</p>

					{/* Stats */}
					{!loading && !error && releases.length > 0 && (
						<div className="flex flex-wrap gap-6 mt-8">
							<div className="flex items-center gap-2 text-sm text-white/50">
								<div className="w-2 h-2 rounded-full bg-emerald-400" />
								<span className="text-white font-medium">
									{releases.length}
								</span>{" "}
								releases
							</div>
							<div className="flex items-center gap-2 text-sm text-white/50">
								<div className="w-2 h-2 rounded-full bg-blue-400" />
								Latest:{" "}
								<span className="text-white font-medium">
									{releases[0]?.tag_name}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Releases */}
			<main className="max-w-4xl mx-auto px-6 py-12">
				{loading && (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 text-white/50 animate-spin" />
					</div>
				)}

				{error && (
					<div className="text-center py-20">
						<p className="text-red-400 mb-4">{error}</p>
						<a
							href="https://github.com/CodeMeAPixel/Cadence/releases"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/60 hover:text-white underline"
						>
							View releases on GitHub instead
						</a>
					</div>
				)}

				{!loading && !error && releases.length === 0 && (
					<div className="text-center py-20">
						<p className="text-white/50">No releases found.</p>
					</div>
				)}

				{!loading && !error && releases.length > 0 && (
					<div className="space-y-0">
						{releases.map((release, idx) => (
							<ReleaseCard
								key={release.id}
								release={release}
								isLatest={idx === 0}
							/>
						))}
					</div>
				)}

				{/* End of timeline */}
				{!loading && !error && releases.length > 0 && (
					<div className="flex items-center gap-4 mt-8 pl-6">
						<div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
							<GitCommit className="w-5 h-5 text-white/30" />
						</div>
						<div>
							<p className="text-white/60">The beginning of Cadence</p>
							<p className="text-sm text-white/40">
								First release: {releases[releases.length - 1]?.tag_name}
							</p>
						</div>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
