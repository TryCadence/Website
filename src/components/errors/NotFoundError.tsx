import { useRouter } from "@tanstack/react-router";
import { Home, Search } from "lucide-react";
import { LogoIcon } from "../Logo";
import { Button } from "../ui/Button";

export function NotFoundError() {
	const _router = useRouter();

	return (
		<div className="min-h-screen bg-[#09090b] text-white flex flex-col">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full">
				<div className="absolute inset-0 bg-[#09090b]/90 backdrop-blur-md border-b border-white/5" />
				<div className="relative max-w-6xl mx-auto px-6 h-14 flex items-center">
					<a href="/" className="flex items-center gap-2">
						<LogoIcon size={20} />
						<span className="font-semibold">Cadence</span>
					</a>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 flex items-center justify-center px-6 py-20">
				<div className="w-full max-w-xl text-center">
					{/* 404 Visual */}
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<div className="text-8xl font-bold text-white/10">404</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<Search className="w-16 h-16 text-white/30" />
							</div>
						</div>
					</div>

					{/* Content */}
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
						Page Not Found
					</h1>
					<p className="text-lg text-white/60 mb-4 leading-relaxed">
						We couldn't find the page you're looking for. The content may have
						been moved or deleted.
					</p>

					{/* Suggestions */}
					<div className="bg-white/2 border border-white/5 rounded-lg p-6 mb-8 text-left">
						<p className="text-sm text-white/50 mb-3">
							Here are some suggestions:
						</p>
						<ul className="space-y-2 text-sm text-white/60">
							<li>• Check the URL for typos</li>
							<li>• Try going back to the homepage</li>
							<li>• Visit our documentation</li>
							<li>• Check GitHub for more information</li>
						</ul>
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" asChild>
							<a href="/" className="group">
								<Home className="w-4 h-4" />
								Go Home
							</a>
						</Button>
						<Button size="lg" variant="secondary" asChild>
							<a
								href="https://github.com/CodeMeAPixel/Cadence"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
						</Button>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="py-6 px-6 border-t border-white/5 text-center text-sm text-white/40">
				<p>
					<a href="/" className="hover:text-white/60 transition-colors">
						Cadence
					</a>
					{" · "}
					<a
						href="https://github.com/CodeMeAPixel/Cadence"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-white/60 transition-colors"
					>
						GitHub
					</a>
				</p>
			</footer>
		</div>
	);
}
