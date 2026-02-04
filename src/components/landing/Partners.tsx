const partners = [
	{ name: "AntiRaid", url: "https://antiraid.bot" },
	{ name: "Purrquinox Digital", url: "https://purrquinox.com" },
	{ name: "NodeByte LTD", url: "https://nodebyte.co.uk" },
	{ name: "Velox VPN", url: "https://veloxvpn.net/" },
];

export function Partners() {
	return (
		<section className="py-20 px-6 border-t border-white/5">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-10">
					<p className="text-xs uppercase tracking-widest text-white/30 mb-2">
						Trusted By
					</p>
					<h3 className="text-xl font-medium text-white/70">
						Industry Partners
					</h3>
				</div>

				{/* Infinite scrolling marquee */}
				<div className="relative">
					{/* Gradient overlays */}
					<div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
					<div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

					{/* Marquee container */}
					<div className="flex overflow-hidden">
						{/* First set */}
						<div className="flex animate-marquee">
							{partners.map((partner) => (
								<a
									key={`first-${partner.name}`}
									href={partner.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center mx-6 px-6 py-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-colors whitespace-nowrap"
								>
									<span className="text-sm font-medium text-white/60">
										{partner.name}
									</span>
								</a>
							))}
						</div>

						{/* Duplicate set for seamless loop */}
						<div className="flex animate-marquee" aria-hidden="true">
							{partners.map((partner) => (
								<a
									key={`second-${partner.name}`}
									href={partner.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center mx-6 px-6 py-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-colors whitespace-nowrap"
								>
									<span className="text-sm font-medium text-white/60">
										{partner.name}
									</span>
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
