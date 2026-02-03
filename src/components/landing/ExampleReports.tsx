import { FileJson, GitBranch, Globe } from "lucide-react";
import { useId } from "react";

const exampleReports = [
	{
		type: "web",
		icon: Globe,
		title: "Website Content Scan",
		url: "example.com/article",
		score: 78,
		assessment: "Likely AI-Generated",
		patterns: [
			{ name: "Generic Language", detail: "enhance, leverage, synergy" },
			{ name: "Perfect Grammar", detail: "92% perfect sentences" },
			{ name: "Overused Phrases", detail: '"in today\'s digital landscape"' },
		],
	},
	{
		type: "git",
		icon: GitBranch,
		title: "Repository Analysis",
		url: "github.com/example/repo",
		score: 64,
		assessment: "Suspicious Commits Detected",
		patterns: [
			{ name: "High Velocity", detail: "750+ additions/min" },
			{ name: "Timing Anomaly", detail: "47 commits in 3 seconds" },
			{ name: "Size Spike", detail: "8,240 line additions" },
		],
	},
];

export function ExampleReports() {
	const reportsId = useId();
	return (
		<section id={`reports-${reportsId}`} className="py-20 px-6">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-10">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Example Reports
					</h2>
					<p className="text-base text-white/50 max-w-lg mx-auto">
						Sample output from Cadence analysis
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 mb-10">
					{exampleReports.map((report) => {
						const Icon = report.icon;
						return (
							<div
								key={report.title}
								className="rounded-xl bg-white/2 border border-white/5 overflow-hidden"
							>
								<div className="p-5 border-b border-white/5">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-2">
											<Icon className="w-4 h-4 text-white/40" />
											<span className="text-sm text-white/40">
												{report.type.toUpperCase()}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div
												className={`w-2 h-2 rounded-full ${report.score >= 50 ? "bg-red-400" : "bg-amber-400"}`}
											/>
											<span
												className={`text-xl font-bold ${report.score >= 50 ? "text-red-400" : "text-amber-400"}`}
											>
												{report.score}%
											</span>
										</div>
									</div>
									<h3 className="font-medium text-white">{report.title}</h3>
									<p className="text-sm text-white/40 font-mono">
										{report.url}
									</p>
									<p
										className={`text-xs mt-1 ${report.score >= 50 ? "text-red-400/60" : "text-amber-400/60"}`}
									>
										{report.assessment}
									</p>
								</div>

								<div className="p-5">
									<p className="text-xs text-white/30 uppercase tracking-wide mb-3">
										Detected Patterns
									</p>
									<div className="space-y-2">
										{report.patterns.map((pattern) => (
											<div
												key={pattern.name}
												className="flex items-start justify-between gap-4"
											>
												<span className="text-sm text-white/70">
													{pattern.name}
												</span>
												<span className="text-xs text-white/30 text-right">
													{pattern.detail}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* JSON Preview */}
				<div className="rounded-xl bg-[#0a0a0c] border border-white/5 overflow-hidden">
					<div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-[#0d0d0f]">
						<div className="flex items-center gap-2">
							<FileJson className="w-4 h-4 text-white/40" />
							<span className="text-sm text-white/40">report.json</span>
						</div>
						<div className="flex gap-1.5">
							<div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
							<div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
							<div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
						</div>
					</div>
					<pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed antialiased">
						<code className="block">
							{`{
`}
							<span className="text-[#5c6370]"> 1 </span>
							<span className="text-[#56b6c2]">"url"</span>
							<span className="text-[#abb2bf]">: </span>
							<span className="text-[#e5c07b]">"https://example.com"</span>
							<span className="text-[#abb2bf]">,</span>
							{`
`}
							<span className="text-[#5c6370]"> 2 </span>
							<span className="text-[#56b6c2]">"analysis"</span>
							<span className="text-[#abb2bf]">: {"{"}</span>
							{`
`}
							<span className="text-[#5c6370]"> 3 </span>
							<span className="text-[#56b6c2]"> "confidence_score"</span>
							<span className="text-[#abb2bf]">: </span>
							<span className="text-[#98c379]">75</span>
							<span className="text-[#abb2bf]">,</span>
							{`
`}
							<span className="text-[#5c6370]"> 4 </span>
							<span className="text-[#56b6c2]"> "assessment"</span>
							<span className="text-[#abb2bf]">: </span>
							<span className="text-[#e5c07b]">"LIKELY AI-GENERATED"</span>
							{`
`}
							<span className="text-[#5c6370]"> 5 </span>
							<span className="text-[#abb2bf]"> {"}"},</span>
							{`
`}
							<span className="text-[#5c6370]"> 6 </span>
							<span className="text-[#56b6c2]">"flagged_items"</span>
							<span className="text-[#abb2bf]">: [</span>
							{`
`}
							<span className="text-[#5c6370]"> 7 </span>
							<span className="text-[#abb2bf]"> {"{"}</span>
							{`
`}
							<span className="text-[#5c6370]"> 8 </span>
							<span className="text-[#56b6c2]"> "pattern_type"</span>
							<span className="text-[#abb2bf]">: </span>
							<span className="text-[#e5c07b]">"generic_language"</span>
							<span className="text-[#abb2bf]">,</span>
							{`
`}
							<span className="text-[#5c6370]"> 9 </span>
							<span className="text-[#56b6c2]"> "severity"</span>
							<span className="text-[#abb2bf]">: </span>
							<span className="text-[#98c379]">1.0</span>
							{`
`}
							<span className="text-[#5c6370]"> 10 </span>
							<span className="text-[#abb2bf]"> {"}"}</span>
							{`
`}
							<span className="text-[#5c6370]"> 11 </span>
							<span className="text-[#abb2bf]"> ]</span>
							{`
}`}
						</code>
					</pre>
				</div>
			</div>
		</section>
	);
}
