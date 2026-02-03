import { ChevronRight, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoIcon } from "../Logo";
import { Button } from "../ui/Button";

interface LayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
}

const navSections = [
	{
		title: "Getting Started",
		links: [
			{ href: "/docs/installation", label: "Installation" },
			{ href: "/docs/quick-start", label: "Quick Start" },
			{ href: "/docs/quick-reference", label: "Quick Reference" },
			{ href: "/docs/configuration", label: "Configuration" },
			{ href: "/docs/build-development", label: "Build & Development" },
		],
	},
	{
		title: "CLI & Usage",
		links: [
			{ href: "/docs/cli-commands", label: "CLI Commands" },
			{ href: "/docs/detection-strategies", label: "Detection Strategies" },
		],
	},
	{
		title: "Analysis Guides",
		links: [
			{ href: "/docs/repository-analysis", label: "Repository Analysis" },
			{ href: "/docs/git-analysis-guide", label: "Git Analysis Deep Dive" },
			{ href: "/docs/web-analysis-guide", label: "Web Analysis Deep Dive" },
		],
	},
	{
		title: "Reference",
		links: [
			{ href: "/docs/advanced-configuration", label: "Advanced Configuration" },
			{ href: "/docs/troubleshooting-guide", label: "Troubleshooting" },
			{ href: "/docs/disclaimer", label: "Disclaimer" },
		],
	},
	{
		title: "Integration & Deployment",
		links: [
			{ href: "/docs/agent-skills", label: "Agent Skills & Integration" },
			{ href: "/docs/api-webhooks", label: "API & Webhook Server" },
		],
	},
	{
		title: "Community",
		links: [
			{ href: "/docs/contributing", label: "Contributing Guide" },
			{ href: "/docs/security", label: "Security Policy" },
		],
	},
];

export function DocsLayout({ children, title, description }: LayoutProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="min-h-screen bg-[#09090b] text-white">
			{/* Header */}
			<header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-md">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<a
							href="/"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<LogoIcon size={20} />
							<span className="font-semibold text-sm sm:text-base">
								Cadence Docs
							</span>
						</a>
						<div className="flex items-center gap-2">
							<Button
								variant="secondary"
								size="sm"
								asChild
								className="hidden sm:inline-flex"
							>
								<a
									href="https://github.com/CodeMeAPixel/Cadence"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
								</a>
							</Button>
							{/* Mobile menu button */}
							<button							type="button"								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
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
				</div>
			</header>

			{/* Mobile Navigation Overlay */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-30 md:hidden">
					{/* Backdrop */}
					<div
						role="presentation"
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={() => setMobileMenuOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setMobileMenuOpen(false)
							}
						}}
					/>
					{/* Slide-in menu */}
					<nav className="absolute top-14.25 left-0 right-0 bg-[#09090b] border-b border-white/10 max-h-[calc(100vh-57px)] overflow-y-auto">
						<div className="p-4 space-y-6">
							{navSections.map((section) => (
								<div key={section.title}>
									<h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider">
										{section.title}
									</h3>
									<div className="space-y-1">
										{section.links.map((link) => (
											<a
												key={link.href}
												href={link.href}
												onClick={() => setMobileMenuOpen(false)}
												className="block px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
											>
												{link.label}
											</a>
										))}
									</div>
								</div>
							))}
							{/* Mobile GitHub link */}
							<div className="pt-4 border-t border-white/10">
								<a
									href="https://github.com/CodeMeAPixel/Cadence"
									target="_blank"
									rel="noopener noreferrer"
									className="block px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
								>
									GitHub →
								</a>
							</div>
						</div>
					</nav>
				</div>
			)}

			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
				<div className="grid md:grid-cols-4 gap-6 lg:gap-8">
					{/* Sidebar - Desktop only */}
					<aside className="hidden md:block">
						<nav className="space-y-1 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
							{navSections.map((section) => (
								<div key={section.title} className="mb-6">
									<h3 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-wider">
										{section.title}
									</h3>
									{section.links.map((link) => (
										<DocLink
											key={link.href}
											href={link.href}
											label={link.label}
										/>
									))}
								</div>
							))}
						</nav>
					</aside>

					{/* Main Content */}
					<main className="md:col-span-3 min-w-0">
						{/* Breadcrumb */}
						<div className="flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-sm text-white/50 overflow-x-auto">
							<Home className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
							<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
							<span className="truncate">{title}</span>
						</div>

						{/* Title and Description */}
						<div className="mb-8 sm:mb-10">
							<h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">
								{title}
							</h1>
							<p className="text-base sm:text-lg text-white/60">
								{description}
							</p>
						</div>

						{/* Content */}
						<div className="prose prose-invert max-w-none">{children}</div>

						{/* Navigation Footer */}
						<div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-3">
							<Button variant="secondary" asChild>
								<a href="/">← Back to Home</a>
							</Button>
							<Button variant="secondary" asChild className="sm:hidden">
								<a href="/docs">View All Docs</a>
							</Button>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

function DocLink({ href, label }: { href: string; label: string }) {
	return (
		<a
			href={href}
			className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
		>
			{label}
		</a>
	);
}
