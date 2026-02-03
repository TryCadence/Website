export function StatsBar() {
	const stats = [
		{ value: "210+", label: "Tests", mono: false },
		{ value: "38", label: "Strategies", mono: false },
		{ value: "2", label: "Analysis Modes", mono: false },
		{ value: "<1s", label: "Avg. Analysis", mono: true },
	];

	return (
		<section className="py-14 px-6 border-y border-white/5 bg-white/1">
			<div className="max-w-4xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map((stat) => (
						<div key={stat.label} className="text-center group cursor-default">
							<div
								className={`text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-white/80 transition-colors ${stat.mono ? "font-mono" : ""}`}
							>
								{stat.value}
							</div>
							<div className="text-sm text-white/40 group-hover:text-white/50 transition-colors">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
