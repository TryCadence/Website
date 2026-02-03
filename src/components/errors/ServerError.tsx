import { AlertTriangle, Home } from "lucide-react";
import { LogoIcon } from "../Logo";
import { Button } from "../ui/Button";

interface ServerErrorProps {
	error?: Error;
}

export function ServerError({ error }: ServerErrorProps) {
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
					{/* 500 Visual */}
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<div className="text-8xl font-bold text-white/10">500</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<AlertTriangle className="w-16 h-16 text-red-500/40" />
							</div>
						</div>
					</div>

					{/* Content */}
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
						Server Error
					</h1>
					<p className="text-lg text-white/60 mb-6 leading-relaxed">
						Something went wrong on our end. Our team has been notified and
						we're working to fix it.
					</p>

					{/* Error Details */}
					{error && (
						<div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-8 text-left max-h-48 overflow-auto">
							<p className="text-xs text-red-400 font-mono wrap-break-word">
								{error.message || "An unexpected error occurred"}
							</p>
						</div>
					)}

					{/* Help Section */}
					<div className="bg-white/2 border border-white/5 rounded-lg p-6 mb-8 text-left">
						<p className="text-sm text-white/50 mb-3">What you can do:</p>
						<ul className="space-y-2 text-sm text-white/60">
							<li>• Try refreshing the page</li>
							<li>• Clear your browser cache</li>
							<li>• Try again in a few minutes</li>
							<li>• Report the issue on GitHub</li>
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
								href="https://github.com/CodeMeAPixel/Cadence/issues"
								target="_blank"
								rel="noopener noreferrer"
							>
								Report Issue
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
						href="https://github.com/CodeMeAPixel/Cadence/issues"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-white/60 transition-colors"
					>
						Support
					</a>
				</p>
			</footer>
		</div>
	);
}
