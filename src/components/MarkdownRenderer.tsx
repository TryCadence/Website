import { AlertTriangle, Check, Copy, Info, Lightbulb } from "lucide-react";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
	content: string;
}

// Copy button component for code blocks
function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [text]);

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all opacity-0 group-hover:opacity-100"
			aria-label={copied ? "Copied!" : "Copy code"}
		>
			{copied ? (
				<Check className="w-3.5 h-3.5 text-emerald-400" />
			) : (
				<Copy className="w-3.5 h-3.5 text-white/50" />
			)}
		</button>
	);
}

// Extract text content from React children
function extractText(children: React.ReactNode): string {
	if (typeof children === "string") return children;
	if (Array.isArray(children)) return children.map(extractText).join("");
	if (children && typeof children === "object" && "props" in children) {
		return extractText((children as React.ReactElement).props.children);
	}
	return "";
}

// Generate slug from text for anchor links
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

// Callout/Admonition component
function Callout({
	type,
	children,
}: {
	type: "note" | "tip" | "warning";
	children: React.ReactNode;
}) {
	const styles = {
		note: {
			bg: "bg-blue-500/10",
			border: "border-blue-500/30",
			icon: <Info className="w-4 h-4 text-blue-400" />,
			title: "Note",
			titleColor: "text-blue-400",
		},
		tip: {
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/30",
			icon: <Lightbulb className="w-4 h-4 text-emerald-400" />,
			title: "Tip",
			titleColor: "text-emerald-400",
		},
		warning: {
			bg: "bg-amber-500/10",
			border: "border-amber-500/30",
			icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
			title: "Warning",
			titleColor: "text-amber-400",
		},
	};

	const style = styles[type];

	return (
		<div className={`${style.bg} border ${style.border} rounded-lg p-4 my-4`}>
			<div className="flex items-center gap-2 mb-2">
				{style.icon}
				<span className={`font-semibold text-sm ${style.titleColor}`}>
					{style.title}
				</span>
			</div>
			<div className="text-sm text-white/70 [&>p]:mb-0">{children}</div>
		</div>
	);
}

const markdownComponents: any = {
	h1: ({ children }: any) => {
		const text = extractText(children);
		const id = slugify(text);
		return (
			<h1
				id={id}
				className="group text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 mt-6 sm:mt-8 scroll-mt-24"
			>
				<a href={`#${id}`} className="no-underline hover:no-underline">
					{children}
					<span className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-white/30">
						#
					</span>
				</a>
			</h1>
		);
	},
	h2: ({ children }: any) => {
		const text = extractText(children);
		const id = slugify(text);
		return (
			<h2
				id={id}
				className="group text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 mt-8 sm:mt-10 border-b border-white/10 pb-2 scroll-mt-24"
			>
				<a href={`#${id}`} className="no-underline hover:no-underline">
					{children}
					<span className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-white/30">
						#
					</span>
				</a>
			</h2>
		);
	},
	h3: ({ children }: any) => {
		const text = extractText(children);
		const id = slugify(text);
		return (
			<h3
				id={id}
				className="group text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 mt-6 sm:mt-8 scroll-mt-24"
			>
				<a href={`#${id}`} className="no-underline hover:no-underline">
					{children}
					<span className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-white/30">
						#
					</span>
				</a>
			</h3>
		);
	},
	h4: ({ children }: any) => {
		const text = extractText(children);
		const id = slugify(text);
		return (
			<h4
				id={id}
				className="group text-base sm:text-lg font-semibold text-white mb-2 mt-4 scroll-mt-24"
			>
				<a href={`#${id}`} className="no-underline hover:no-underline">
					{children}
					<span className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-white/30">
						#
					</span>
				</a>
			</h4>
		);
	},
	p: ({ children }: any) => (
		<p className="text-sm sm:text-base text-white/70 mb-4 leading-relaxed">
			{children}
		</p>
	),
	a: ({ href, children }: any) => (
		<a
			href={href}
			className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2 decoration-emerald-400/30 hover:decoration-emerald-300/50"
		>
			{children}
		</a>
	),
	ul: ({ children }: any) => (
		<ul className="list-none space-y-2 mb-4 ml-1">{children}</ul>
	),
	ol: ({ children }: any) => (
		<ol className="list-decimal list-outside ml-5 space-y-2 mb-4 text-white/70 marker:text-emerald-400/70">
			{children}
		</ol>
	),
	li: ({ children, ordered }: any) => {
		if (ordered) {
			return (
				<li className="text-sm sm:text-base text-white/70 pl-1">{children}</li>
			);
		}
		return (
			<li className="text-sm sm:text-base text-white/70 flex gap-3">
				<span className="text-emerald-400 shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
				<span className="flex-1 min-w-0">{children}</span>
			</li>
		);
	},
	code: ({ inline, className, children }: any) => {
		if (inline) {
			return (
				<code className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-white/5 break-words">
					{children}
				</code>
			);
		}
		// For code blocks inside pre, just return children (pre handles the styling)
		return <code className={`${className} break-words`}>{children}</code>;
	},
	pre: ({ children }: any) => {
		// Extract the code text and language for copy functionality
		const codeElement = children?.props?.children;
		const codeText = extractText(codeElement);
		const className = children?.props?.className || "";
		const languageMatch = className.match(/language-(\w+)/);
		const language = languageMatch ? languageMatch[1] : "";

		return (
			<div className="group relative mb-6 -mx-4 sm:mx-0">
				{language && (
					<div className="absolute top-0 left-0 px-3 py-1 text-xs font-mono text-white/40 bg-white/5 rounded-tl-lg sm:rounded-tl-lg border-b border-r border-white/10 z-10">
						{language}
					</div>
				)}
				<pre className="bg-[#0d1117] border border-white/10 p-4 pt-8 overflow-x-auto text-sm sm:rounded-lg font-mono leading-relaxed">
					{children}
				</pre>
				<CopyButton text={codeText} />
			</div>
		);
	},
	blockquote: ({ children }: any) => {
		// Check if this is a callout (starts with [!NOTE], [!TIP], [!WARNING])
		const text = extractText(children);
		const calloutMatch = text.match(/^\[!(NOTE|TIP|WARNING)\]/i);

		if (calloutMatch) {
			const type = calloutMatch[1].toLowerCase() as "note" | "tip" | "warning";
			// Remove the callout marker from the content
			const cleanContent = text.replace(/^\[!(NOTE|TIP|WARNING)\]\s*/i, "");
			return (
				<Callout type={type}>
					<p>{cleanContent}</p>
				</Callout>
			);
		}

		return (
			<blockquote className="border-l-4 border-emerald-400/50 pl-4 py-1 my-4 bg-white/2 rounded-r-lg">
				<div className="text-white/60 italic [&>p]:mb-0">{children}</div>
			</blockquote>
		);
	},
	table: ({ children }: any) => (
		<div className="overflow-x-auto mb-6 -mx-4 sm:mx-0 border border-white/10 sm:rounded-lg">
			<table className="min-w-full divide-y divide-white/10 text-sm">
				{children}
			</table>
		</div>
	),
	thead: ({ children }: any) => (
		<thead className="bg-white/5">{children}</thead>
	),
	tbody: ({ children }: any) => (
		<tbody className="divide-y divide-white/5">{children}</tbody>
	),
	th: ({ children }: any) => (
		<th className="px-4 py-3 text-left text-white font-semibold text-xs uppercase tracking-wider">
			{children}
		</th>
	),
	td: ({ children }: any) => (
		<td className="px-4 py-3 text-white/70 min-w-[100px]">{children}</td>
	),
	tr: ({ children }: any) => (
		<tr className="hover:bg-white/2 transition-colors">{children}</tr>
	),
	strong: ({ children }: any) => (
		<strong className="font-semibold text-white">{children}</strong>
	),
	em: ({ children }: any) => (
		<em className="italic text-white/80">{children}</em>
	),
	hr: () => <hr className="border-white/10 my-8" />,
	img: ({ src, alt }: any) => (
		<img
			src={src}
			alt={alt}
			className="rounded-lg border border-white/10 my-4 max-w-full h-auto"
		/>
	),
};

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight, rehypeRaw];

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
	return (
		<div className="prose prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={remarkPlugins}
				rehypePlugins={rehypePlugins}
				components={markdownComponents}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
