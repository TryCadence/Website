import { Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoIcon } from "../Logo";
import { Button } from "../ui/Button";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full">
			<div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-md border-b border-white/5" />

			<div className="relative max-w-6xl mx-auto px-6">
				<div className="flex items-center justify-between h-14">
					{/* Logo */}
					<a href="/" className="flex items-center gap-2 group">
						<LogoIcon size={20} />
						<span className="font-semibold text-white">Cadence</span>
						<span className="text-xs text-white/30">v0.2.1</span>
					</a>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center gap-6">
						<a
							href="#features"
							className="text-sm text-white/50 hover:text-white transition-colors"
						>
							Features
						</a>
						<a
							href="#reports"
							className="text-sm text-white/50 hover:text-white transition-colors"
						>
							Examples
						</a>
						<a
							href="/docs"
							className="text-sm text-white/50 hover:text-white transition-colors"
						>
							Docs
						</a>
						<a
							href="/changelog"
							className="text-sm text-white/50 hover:text-white transition-colors"
						>
							Changelog
						</a>
					</nav>

					{/* Actions */}
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="hidden sm:inline-flex"
						>
							<a
								href="https://github.com/CodeMeAPixel/Cadence"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="w-4 h-4" />
								GitHub
							</a>
						</Button>

						<button						type="button"							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
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

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-[#09090b]/95 backdrop-blur-md border-b border-white/5">				{/* biome-ignore lint/a11y/useValidAnchor: using anchors for smooth scroll in mobile menu */}					<nav className="flex flex-col p-4 gap-1">
						<a
							href="#features"
							className="px-3 py-2 text-sm text-white/50 hover:text-white rounded transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							Features
						</a>
						<a
							href="#reports"
							className="px-3 py-2 text-sm text-white/50 hover:text-white rounded transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							Examples
						</a>
						<a
							href="/docs"
							className="px-3 py-2 text-sm text-white/50 hover:text-white rounded transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							Docs
						</a>
						<a
							href="/changelog"
							className="px-3 py-2 text-sm text-white/50 hover:text-white rounded transition-colors"
							onClick={() => setMobileMenuOpen(false)}
						>
							Changelog
						</a>
						<a
							href="https://github.com/CodeMeAPixel/Cadence"
							target="_blank"
							rel="noopener noreferrer"
							className="px-3 py-2 text-sm text-white/50 hover:text-white rounded transition-colors"
						>
							GitHub
						</a>
					</nav>
				</div>
			)}
		</header>
	);
}
