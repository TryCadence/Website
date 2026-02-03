import * as Tabs from "@radix-ui/react-tabs";
import { Check, Copy, GitBranch, Globe, Terminal } from "lucide-react";
import { useId } from "react";
import { useState } from "react";

type TokenType = "command" | "flag" | "path" | "comment" | "string" | "text";

function tokenize(line: string): { type: TokenType; value: string }[] {
	const tokens: { type: TokenType; value: string }[] = [];

	if (line.startsWith("#")) {
		return [{ type: "comment", value: line }];
	}

	const parts = line.split(/\s+/);
	parts.forEach((part, i) => {
		if (i > 0) tokens.push({ type: "text", value: " " });

		if (part.startsWith("--") || (part.startsWith("-") && part.length === 2)) {
			tokens.push({ type: "flag", value: part });
		} else if (
			part.startsWith("./") ||
			part.startsWith("/") ||
			part.includes("/")
		) {
			tokens.push({ type: "path", value: part });
		} else if (
			part === "git" ||
			part === "cd" ||
			part === "make" ||
			part === "clone"
		) {
			tokens.push({ type: "command", value: part });
		} else if (part.startsWith("https://") || part.startsWith("http://")) {
			tokens.push({ type: "string", value: part });
		} else {
			tokens.push({ type: "text", value: part });
		}
	});

	return tokens;
}

const tokenColors: Record<TokenType, string> = {
	command: "text-[#98c379]",
	flag: "text-[#e5c07b]",
	path: "text-[#56b6c2]",
	comment: "text-[#5c6370] italic",
	string: "text-[#e5c07b]",
	text: "text-[#abb2bf]",
};

function CodeBlock({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const lines = code.split("\n");

	return (
		<div className="relative group">
			<button
				type="button"
				onClick={handleCopy}
				className="absolute top-3 right-3 p-2 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 z-10"
				title="Copy to clipboard"
			>
				{copied ? (
					<Check className="w-4 h-4 text-[#98c379]" />
				) : (
					<Copy className="w-4 h-4" />
				)}
			</button>
			<div className="bg-[#0a0a0c] rounded-lg border border-white/5 overflow-hidden">
				{/* Terminal header */}
				<div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#0d0d0f]">
					<div className="flex gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
						<div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
						<div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
					</div>
					<span className="text-xs text-[#5c6370] ml-2">terminal</span>
				</div>
				<pre className="p-4 overflow-x-auto antialiased">
					<code className="text-sm font-mono leading-relaxed">
						{lines.map((line) => (
							<div key={line} className="flex">
								<span className="select-none text-[#5c6370] w-6 text-right mr-4">
									{lines.indexOf(line) + 1}
								</span>
								<span>
									{!line.startsWith("#") && (
										<span className="text-[#c678dd] mr-1">$</span>
									)}
									{tokenize(line).map((token, j) => (
									<span key={`token-${j}-${token.type}`} className={tokenColors[token.type]}>
											{token.value}
										</span>
									))}
								</span>
							</div>
						))}
					</code>
				</pre>
			</div>
		</div>
	);
}

export function QuickStart() {
	const quickstartId = useId()
	return (
		<section id={`quickstart-${quickstartId}`} className="py-20 px-6">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-10">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Quick Start
					</h2>
					<p className="text-base text-white/50 max-w-lg mx-auto">
						Install and start analyzing in minutes
					</p>
				</div>

				<Tabs.Root defaultValue="install" className="w-full">
					<Tabs.List className="flex justify-center gap-1 mb-6 p-1 bg-white/5 rounded-lg w-fit mx-auto">
						<Tabs.Trigger
							value="install"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white/50 hover:text-white transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
						>
							<Terminal className="w-4 h-4" />
							Install
						</Tabs.Trigger>
						<Tabs.Trigger
							value="git"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white/50 hover:text-white transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
						>
							<GitBranch className="w-4 h-4" />
							Git
						</Tabs.Trigger>
						<Tabs.Trigger
							value="web"
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white/50 hover:text-white transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white"
						>
							<Globe className="w-4 h-4" />
							Web
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="install" className="focus:outline-none">
						<CodeBlock
							code={`git clone https://github.com/TryCadence/Cadence.git
cd Cadence
make build
./cadence --version`}
						/>
					</Tabs.Content>

					<Tabs.Content value="git" className="focus:outline-none">
						<CodeBlock
							code={`./cadence analyze /path/to/repo -o report.txt

# With JSON output
./cadence analyze /path/to/repo --json --output report.json`}
						/>
					</Tabs.Content>

					<Tabs.Content value="web" className="focus:outline-none">
						<CodeBlock
							code={`./cadence web https://example.com

# With JSON output
./cadence web https://example.com --json --output report.json`}
						/>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</section>
	);
}
