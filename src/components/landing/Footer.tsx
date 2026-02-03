export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="py-10 px-6 border-t border-white/5">
			<div className="max-w-4xl mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-white/30 order-2 md:order-1">
						© {year}{" "}
						<a
							href="https://codemeapixel.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/50 transition-colors"
						>
							CodeMeAPixel
						</a>
					</p>

					<div className="flex items-center gap-4 text-sm text-white/30 order-1 md:order-2">
						<a
							href="/changelog"
							className="hover:text-white/50 transition-colors"
						>
							Changelog
						</a>
						<span className="w-1 h-1 rounded-full bg-white/20" />
						<a
							href="https://github.com/CodeMeAPixel/Cadence"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/50 transition-colors"
						>
							GitHub
						</a>
						<span className="w-1 h-1 rounded-full bg-white/20" />
						<a
							href="https://github.com/CodeMeAPixel/Cadence/blob/main/LICENSE"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white/50 transition-colors font-mono"
						>
							AGPL-3.0
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
