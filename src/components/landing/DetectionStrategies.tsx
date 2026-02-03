import { GitBranch, Globe } from "lucide-react";

const gitStrategies = [
	{ name: "Velocity Anomalies", desc: "Lines added/removed per minute" },
	{ name: "Size Analysis", desc: "Suspicious commit sizes" },
	{ name: "Timing Patterns", desc: "Rapid successive commits" },
	{ name: "Statistical Markers", desc: "Unusual change distributions" },
	{ name: "Merge Behavior", desc: "Suspicious merge patterns" },
	{ name: "File Dispersion", desc: "Excessive files per commit" },
	{ name: "Ratio Analysis", desc: "Addition/deletion ratios" },
	{ name: "Precision Metrics", desc: "Code structure patterns" },
];

const webPatterns = [
	{ name: "Overused Phrases", desc: '"in today\'s world", "furthermore"' },
	{ name: "Generic Language", desc: '"enhance", "empower", "streamline"' },
	{ name: "Perfect Grammar", desc: "Unnaturally perfect construction" },
	{ name: "Uniform Sentences", desc: "Consistent sentence length" },
	{ name: "Excessive Structure", desc: "Rigid formatting patterns" },
	{ name: "Boilerplate Text", desc: "Template-like content" },
	{ name: "Custom Patterns", desc: "User-defined detection rules" },
	{ name: "AI Validation", desc: "GPT-4o-mini expert analysis" },
];

export function DetectionStrategies() {
	return (
		<section className="py-20 px-6">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Detection Strategies
					</h2>
					<p className="text-base text-white/50 max-w-2xl mx-auto">
						16 specialized detection strategies combining pattern analysis with
						statistical markers
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-6">
					{/* Git Analysis Card */}
					<div className="rounded-xl bg-white/2 border border-white/5 p-6 hover:bg-white/4 hover:border-white/10 transition-all duration-200">
						{/* Header */}
						<div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
							<div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
								<GitBranch className="w-5 h-5 text-white/70" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-white">
									Git Repository
								</h3>
								<p className="text-sm text-white/40">
									8 commit detection strategies
								</p>
							</div>
						</div>

						{/* Strategies List */}
						<div className="space-y-3">
							{gitStrategies.map((strategy) => (
								<div key={strategy.name} className="flex items-start gap-3">
									<div className="w-1 h-1 rounded-full bg-white/30 mt-2 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-white/80">
											{strategy.name}
										</div>
										<div className="text-xs text-white/40">{strategy.desc}</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Web Analysis Card */}
					<div className="rounded-xl bg-white/2 border border-white/5 p-6 hover:bg-white/4 hover:border-white/10 transition-all duration-200">
						{/* Header */}
						<div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
							<div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
								<Globe className="w-5 h-5 text-white/70" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-white">
									Web Content
								</h3>
								<p className="text-sm text-white/40">
									8 text detection strategies
								</p>
							</div>
						</div>

						{/* Strategies List */}
						<div className="space-y-3">
							{webPatterns.map((pattern) => (
								<div key={pattern.name} className="flex items-start gap-3">
									<div className="w-1 h-1 rounded-full bg-white/30 mt-2 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-white/80">
											{pattern.name}
										</div>
										<div className="text-xs text-white/40">{pattern.desc}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
