import { AlertTriangle, ChevronRight, Github, Terminal } from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
	return (
		<section className="relative py-24 px-6 text-center">
			<div className="max-w-5xl mx-auto">
				{/* Disclaimer Alert */}
				<div className="max-w-2xl mx-auto mb-6">
					<a
						href="/docs/disclaimer"
						className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs hover:bg-amber-500/15 hover:border-amber-500/30 transition-colors"
					>
						<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
						<span>Cadence is not perfect and is under active development</span>
						<span className="text-amber-200/60">Learn more</span>
					</a>
				</div>
				{/* Version badge */}
				<a
					href="https://github.com/CodeMeAPixel/Cadence/releases/tag/v0.2.1"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-8 hover:bg-white/10 hover:border-white/20 transition-colors group"
				>
					<Terminal className="w-4 h-4" />
					<span className="font-mono">v0.2.1</span>
					<span className="w-px h-3 bg-white/20" />
					<span>10 Detection Strategies</span>
					<ChevronRight className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors" />
				</a>

				{/* Title */}
				<h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
					<span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
						Cadence
					</span>
				</h1>

				{/* Tagline */}
				<p className="text-xl md:text-2xl text-white/70 mb-4">
					AI Content Detection for <span className="text-white/90">Git</span>{" "}
					and <span className="text-white/90">Web</span>
				</p>

				<p className="text-base text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
					Analyze repositories and websites for AI-generated code and text.
					Pattern-based detection with confidence scoring and detailed reports.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-wrap items-center justify-center gap-4 mb-12">
					<Button size="lg" asChild>
						<a
							href="https://github.com/CodeMeAPixel/Cadence"
							target="_blank"
							rel="noopener noreferrer"
							className="group"
						>
							<Github className="w-5 h-5" />
							View on GitHub
							<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</a>
					</Button>
					<Button size="lg" variant="secondary" asChild>
						<a href="/docs">Documentation</a>
					</Button>
				</div>

				{/* Info line */}
				<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
					<span>Open Source</span>
					<span className="w-1 h-1 rounded-full bg-white/20" />
					<span>Built with Go</span>
				</div>
			</div>
		</section>
	);
}
