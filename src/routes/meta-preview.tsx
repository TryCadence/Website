import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/meta-preview")({
	component: MetaPreview,
});

function MetaPreview() {
	const metaImages = [
		{
			title: "Main OG Image",
			path: "/og-image.svg",
			description: "Primary Open Graph image for social sharing",
			dimensions: "1200 × 630px",
		},
		{
			title: "Documentation OG Image",
			path: "/og-docs.svg",
			description: "Open Graph image for documentation pages",
			dimensions: "1200 × 630px",
		},
		{
			title: "Main Logo",
			path: "/logo.svg",
			description: "Full logo with detection rings and waveform",
			dimensions: "512 × 512px",
		},
		{
			title: "Logo 192px",
			path: "/logo192.svg",
			description: "Apple touch icon and PWA icon",
			dimensions: "192 × 192px",
		},
		{
			title: "Favicon",
			path: "/favicon.svg",
			description: "Browser favicon",
			dimensions: "32 × 32px",
		},
	];

	return (
		<div className="min-h-screen bg-[#09090b] text-white">
			<div className="mx-auto max-w-6xl px-4 py-20">
				<div className="mb-12">
					<h1 className="mb-4 text-4xl font-bold">Meta Images Preview</h1>
					<p className="text-lg text-white/70">
						Preview of social media sharing images used in meta tags
					</p>
				</div>

				<div className="space-y-12">
					{metaImages.map((image) => (
						<div
							key={image.path}
							className="rounded-xl border border-white/10 bg-white/2 p-6"
						>
							<div className="mb-4 flex items-start justify-between">
								<div>
									<h2 className="mb-2 text-2xl font-semibold">{image.title}</h2>
									<p className="mb-1 text-white/60">{image.description}</p>
									<p className="text-sm text-white/40">{image.dimensions}</p>
								</div>
								<a
									href={image.path}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm transition-colors hover:bg-white/10"
								>
									Open Full Size
									<ExternalLink size={16} />
								</a>
							</div>

							<div className="overflow-hidden rounded-lg border border-white/5 bg-black/20">
								<img
									src={image.path}
									alt={image.title}
									className="w-full"
									loading="lazy"
								/>
							</div>

							<div className="mt-4 text-sm text-white/50">
								<code className="rounded bg-white/5 px-2 py-1">
									{image.path}
								</code>
							</div>
						</div>
					))}
				</div>

				<div className="mt-12 rounded-xl border border-white/10 bg-white/2 p-6">
					<h3 className="mb-4 text-xl font-semibold">
						Testing Social Previews
					</h3>
					<div className="space-y-4 text-white/70">
						<div>
							<h4 className="mb-2 font-semibold text-white">
								Twitter/X Card Validator
							</h4>
							<a
								href="https://cards-dev.twitter.com/validator"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-white/60 underline hover:text-white"
							>
								cards-dev.twitter.com/validator
								<ExternalLink size={14} />
							</a>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-white">
								Facebook Sharing Debugger
							</h4>
							<a
								href="https://developers.facebook.com/tools/debug/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-white/60 underline hover:text-white"
							>
								developers.facebook.com/tools/debug
								<ExternalLink size={14} />
							</a>
						</div>
						<div>
							<h4 className="mb-2 font-semibold text-white">
								LinkedIn Post Inspector
							</h4>
							<a
								href="https://www.linkedin.com/post-inspector/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-white/60 underline hover:text-white"
							>
								linkedin.com/post-inspector
								<ExternalLink size={14} />
							</a>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<a href="/" className="text-white/60 underline hover:text-white">
						← Back to Home
					</a>
				</div>
			</div>
		</div>
	);
}
