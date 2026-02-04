import { ChevronDown, Home, List, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useVersion } from "../../lib/useVersion";
import { LogoIcon } from "../Logo";
import { Button } from "../ui/Button";

interface LayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
	content?: string;
	slug?: string;
}

interface NavSection {
	title: string;
	slug: string;
	description: string;
	links: { href: string; label: string }[];
}

interface TocItem {
	id: string;
	text: string;
	level: number;
}

const navSections: NavSection[] = [
	{
		title: "Getting Started",
		slug: "getting-started",
		description: "Installation and setup",
		links: [
			{ href: "/docs/getting-started", label: "Overview" },
			{ href: "/docs/getting-started/installation", label: "Installation" },
			{ href: "/docs/getting-started/quick-start", label: "Quick Start" },
			{
				href: "/docs/getting-started/quick-reference",
				label: "Quick Reference",
			},
			{ href: "/docs/getting-started/configuration", label: "Configuration" },
		],
	},
	{
		title: "CLI",
		slug: "cli",
		description: "Command-line interface",
		links: [
			{ href: "/docs/cli", label: "Overview" },
			{ href: "/docs/cli/commands", label: "Commands" },
			{ href: "/docs/cli/detection-strategies", label: "Detection Strategies" },
		],
	},
	{
		title: "Analysis",
		slug: "analysis",
		description: "Git and web analysis",
		links: [
			{ href: "/docs/analysis", label: "Overview" },
			{ href: "/docs/analysis/repository", label: "Repository Analysis" },
			{ href: "/docs/analysis/git", label: "Git Analysis" },
			{ href: "/docs/analysis/web", label: "Web Analysis" },
		],
	},
	{
		title: "AI",
		slug: "ai",
		description: "OpenAI integration and setup",
		links: [
			{ href: "/docs/ai", label: "Overview" },
			{ href: "/docs/ai/configuration", label: "Configuration" },
			{ href: "/docs/ai/examples", label: "Examples" },
		],
	},
	{
		title: "Integrations",
		slug: "integrations",
		description: "Webhooks and agent skills",
		links: [
			{ href: "/docs/integrations", label: "Overview" },
			{ href: "/docs/integrations/agent-skills", label: "Agent Skills" },
			{ href: "/docs/integrations/webhooks", label: "Webhooks" },
		],
	},
	{
		title: "Reference",
		slug: "reference",
		description: "Advanced configuration",
		links: [
			{ href: "/docs/reference", label: "Overview" },
			{
				href: "/docs/reference/advanced-configuration",
				label: "Advanced Configuration",
			},
			{
				href: "/docs/reference/build-development",
				label: "Build & Development",
			},
			{ href: "/docs/reference/troubleshooting", label: "Troubleshooting" },
			{ href: "/docs/reference/disclaimer", label: "Disclaimer" },
		],
	},
	{
		title: "Community",
		slug: "community",
		description: "Contributing and support",
		links: [
			{ href: "/docs/community", label: "Overview" },
			{ href: "/docs/community/contributing", label: "Contributing" },
			{ href: "/docs/community/security", label: "Security" },
		],
	},
];

function extractToc(content: string): TocItem[] {
	if (!content) return [];
	const lines = content.split("\n");
	const toc: TocItem[] = [];

	for (const line of lines) {
		const match = line.match(/^(#{2,4})\s+(.+)$/);
		if (match) {
			const level = match[1].length;
			const text = match[2].replace(/\*\*/g, "").replace(/`/g, "");
			const id = text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			toc.push({ id, text, level });
		}
	}

	return toc;
}

function getCurrentSection(slug?: string): NavSection {
	if (!slug) return navSections[0];
	// Extract section from slug (e.g., "getting-started/installation" -> "getting-started")
	const sectionSlug = slug.split("/")[0];
	const section = navSections.find((s) => s.slug === sectionSlug);
	return section || navSections[0];
}

export function DocsLayout({
	children,
	title,
	description,
	content,
	slug,
}: LayoutProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
	const [activeId, setActiveId] = useState<string>("");
	const { version } = useVersion();
	const toc = extractToc(content || "");
	const currentSection = getCurrentSection(slug);

	useEffect(() => {
		if (typeof window === "undefined" || toc.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{ rootMargin: "-80px 0px -80% 0px" },
		);

		for (const item of toc) {
			const element = document.getElementById(item.id);
			if (element) observer.observe(element);
		}

		return () => observer.disconnect();
	}, [toc]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest("[data-section-dropdown]")) {
				setSectionDropdownOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<div className="min-h-screen bg-[#09090b] text-white">
			{/* Header */}
			<header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090b]/95 backdrop-blur-md">
				<div className="flex items-center justify-between px-4 lg:px-6 py-3">
					<div className="flex items-center gap-4">
						<a
							href="/"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<LogoIcon size={22} />
							<span className="font-semibold">Cadence</span>
							<span className="text-xs text-white/30">{version}</span>
						</a>
					</div>
					<div className="flex items-center gap-3">
						<Button
							variant="secondary"
							size="sm"
							asChild
							className="hidden sm:inline-flex"
						>
							<a
								href="https://x.com/NoSlopTech"
								target="_blank"
								rel="noopener noreferrer"
							>
								Twitter/X
							</a>
						</Button>
						<Button
							variant="secondary"
							size="sm"
							asChild
							className="hidden sm:inline-flex"
						>
							<a
								href="https://github.com/TryCadence/Cadence"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
						</Button>
						<button
							type="button"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Navigation Overlay */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-30 lg:hidden">
					<button
						type="button"
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={() => setMobileMenuOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") setMobileMenuOpen(false);
						}}
					/>
					<nav className="absolute left-0 top-[57px] bottom-0 w-[min(80vw,320px)] bg-[#09090b] border-r border-white/10 overflow-y-auto">
						<div className="p-4">
							<MobileSectionSelector
								currentSection={currentSection}
								currentSlug={slug}
								onClose={() => setMobileMenuOpen(false)}
							/>
						</div>
					</nav>
				</div>
			)}

			<div className="flex">
				{/* Left Sidebar - Desktop */}
				<aside className="hidden lg:block w-64 xl:w-72 shrink-0 border-r border-white/5">
					<div className="sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
						{/* Section Selector Dropdown */}
						<div className="p-4 border-b border-white/5" data-section-dropdown>
							<button
								type="button"
								onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
								className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 transition-colors"
							>
								<LogoIcon size={20} />
								<div className="flex-1 text-left min-w-0">
									<div className="text-sm font-medium text-white truncate">
										{currentSection.title}
									</div>
									<div className="text-xs text-white/50 truncate">
										{currentSection.description}
									</div>
								</div>
								<ChevronDown
									className={`w-4 h-4 text-white/50 transition-transform ${
										sectionDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{/* Section Dropdown Menu */}
							{sectionDropdownOpen && (
								<div className="absolute left-4 right-4 mt-2 bg-[#0f0f11] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
									{navSections.map((section) => (
										<a
											key={section.slug}
											href={`/docs/${section.slug}`}
											className={`flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
												section.slug === currentSection.slug
													? "bg-emerald-400/10"
													: ""
											}`}
										>
											<LogoIcon size={18} />
											<div className="flex-1 min-w-0">
												<div
													className={`text-sm font-medium truncate ${
														section.slug === currentSection.slug
															? "text-emerald-400"
															: "text-white"
													}`}
												>
													{section.title}
												</div>
												<div className="text-xs text-white/50 truncate">
													{section.description}
												</div>
											</div>
										</a>
									))}
								</div>
							)}
						</div>

						{/* Search (placeholder) */}
						<div className="px-4 py-3 border-b border-white/5">
							<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-sm">
								<Search className="w-4 h-4" />
								<span>Search</span>
								<span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded">
									⌘K
								</span>
							</div>
						</div>

						{/* Page Links for Current Section */}
						<nav className="p-4 space-y-1">
							{currentSection.links.map((link) => (
								<PageLink
									key={link.href}
									href={link.href}
									label={link.label}
									currentSlug={slug}
								/>
							))}
						</nav>
					</div>
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 min-w-0">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
						{/* Breadcrumb */}
						<Breadcrumb
							title={title}
							currentSection={currentSection}
							currentSlug={slug}
						/>
						{/* Title and Description */}
						<div className="mb-8 lg:mb-12">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
								{title}
							</h1>
							<p className="text-lg text-white/60 leading-relaxed">
								{description}
							</p>
						</div>

						{/* Content */}
						<div className="prose prose-invert max-w-none">{children}</div>

						{/* Navigation Footer */}
						<div className="mt-16 pt-8 border-t border-white/10">
							<Button variant="secondary" asChild>
								<a href="/">← Back to Home</a>
							</Button>
						</div>
					</div>
				</main>

				{/* Right Sidebar - Table of Contents */}
				{toc.length > 0 && (
					<aside className="hidden xl:block w-64 shrink-0 border-l border-white/5">
						<div className="sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto p-4">
							<div className="flex items-center gap-2 mb-4 text-sm font-medium text-white/80">
								<List className="w-4 h-4" />
								On this page
							</div>
							<nav className="space-y-1">
								{toc.map((item) => (
									<a
										key={item.id}
										href={`#${item.id}`}
										className={`block text-sm py-1 transition-colors ${
											item.level === 3 ? "pl-3" : item.level === 4 ? "pl-6" : ""
										} ${
											activeId === item.id
												? "text-emerald-400 font-medium"
												: "text-white/50 hover:text-white/80"
										}`}
									>
										{item.text}
									</a>
								))}
							</nav>
						</div>
					</aside>
				)}
			</div>
		</div>
	);
}

function PageLink({
	href,
	label,
	currentSlug,
}: {
	href: string;
	label: string;
	currentSlug?: string;
}) {
	const isActive = currentSlug && href === `/docs/${currentSlug}`;

	return (
		<a
			href={href}
			className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
				isActive
					? "text-emerald-400 bg-emerald-400/10 font-medium"
					: "text-white/60 hover:text-white hover:bg-white/5"
			}`}
		>
			{label}
		</a>
	);
}

function Breadcrumb({
	title,
	currentSection,
	currentSlug,
}: {
	title: string;
	currentSection: NavSection;
	currentSlug?: string;
}) {
	const isOverview = currentSlug && currentSlug === currentSection.slug;

	return (
		<div className="flex items-center gap-2 mb-6 text-sm text-white/50 flex-wrap">
			<a
				href="/docs"
				className="hover:text-white transition-colors flex items-center gap-1.5"
			>
				<Home className="w-4 h-4" />
				<span>Docs</span>
			</a>
			<span className="text-white/30">/</span>
			<a
				href={`/docs/${currentSection.slug}`}
				className="hover:text-white transition-colors"
			>
				{currentSection.title}
			</a>
			{!isOverview && (
				<>
					<span className="text-white/30">/</span>
					<span className="text-white/70">{title}</span>
				</>
			)}
		</div>
	);
}

function MobileSectionSelector({
	currentSection,
	onClose,
	currentSlug,
}: {
	currentSection: NavSection;
	onClose: () => void;
	currentSlug?: string;
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="space-y-4">
			{/* Section Selector */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
			>
				<LogoIcon size={20} />
				<div className="flex-1 text-left">
					<div className="text-sm font-medium text-white">
						{currentSection.title}
					</div>
					<div className="text-xs text-white/50">
						{currentSection.description}
					</div>
				</div>
				<ChevronDown
					className={`w-4 h-4 text-white/50 transition-transform ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Expanded Section List */}
			{isExpanded && (
				<div className="space-y-1 pb-4 border-b border-white/10">
					{navSections.map((section) => (
						<a
							key={section.slug}
							href={`/docs/${section.slug}`}
							onClick={onClose}
							className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
								section.slug === currentSection.slug
									? "bg-emerald-400/10"
									: "hover:bg-white/5"
							}`}
						>
							<LogoIcon size={18} />
							<div className="flex-1">
								<div
									className={`text-sm font-medium ${
										section.slug === currentSection.slug
											? "text-emerald-400"
											: "text-white"
									}`}
								>
									{section.title}
								</div>
								<div className="text-xs text-white/50">
									{section.description}
								</div>
							</div>
						</a>
					))}
				</div>
			)}

			{/* Page Links */}
			<nav className="space-y-1">
				{currentSection.links.map((link) => {
					const isActive = currentSlug && link.href === `/docs/${currentSlug}`;
					return (
						<a
							key={link.href}
							href={link.href}
							onClick={onClose}
							className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
								isActive
									? "text-emerald-400 bg-emerald-400/10 font-medium"
									: "text-white/60 hover:text-white hover:bg-white/5"
							}`}
						>
							{link.label}
						</a>
					);
				})}
			</nav>
		</div>
	);
}
