import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
	content: string;
}

// biome-ignore lint/suspicious/noExplicitAny: react-markdown requires any type for components
const markdownComponents: any = {
	h1: ({ children }: any) => (
		<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 mt-6 sm:mt-8">
			{children}
		</h1>
	),
	h2: ({ children }: any) => (
		<h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 mt-6 sm:mt-8 border-b border-white/10 pb-2">
			{children}
		</h2>
	),
	h3: ({ children }: any) => (
		<h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 mt-4 sm:mt-6">
			{children}
		</h3>
	),
	h4: ({ children }: any) => (
		<h4 className="text-base sm:text-lg font-semibold text-white mb-2 mt-4">
			{children}
		</h4>
	),
	p: ({ children }: any) => (
		<p className="text-sm sm:text-base text-white/70 mb-3 sm:mb-4 leading-relaxed">
			{children}
		</p>
	),
	a: ({ href, children }: any) => (
		<a
			href={href}
			className="text-cyan-400 hover:text-cyan-300 transition-colors underline wrap-break-word"
		>
			{children}
		</a>
	),
	ul: ({ children }: any) => (
		<ul className="list-none space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
			{children}
		</ul>
	),
	ol: ({ children }: any) => (
		<ol className="list-decimal list-inside space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-white/70">
			{children}
		</ol>
	),
	li: ({ children }: any) => (
		<li className="text-sm sm:text-base text-white/70 flex gap-2 sm:gap-3">
			<span className="text-cyan-400 shrink-0">•</span>
			<span className="flex-1 min-w-0">{children}</span>
		</li>
	),
	code: ({ inline, children }: any) => {
		if (inline) {
			return (
				<code className="bg-white/10 text-cyan-400 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono wrap-break-word">
					{children}
				</code>
			);
		}
		return (
			<code className="bg-white/2 text-cyan-100 block p-3 sm:p-4 rounded border border-white/5 overflow-x-auto text-xs sm:text-sm">
				{children}
			</code>
		);
	},
	pre: ({ children }: any) => (
		<pre className="bg-white/5 border border-white/5 p-3 sm:p-4 overflow-x-auto mb-4 sm:mb-6 text-xs sm:text-sm -mx-4 sm:mx-0 sm:rounded-lg">
			{children}
		</pre>
	),
	blockquote: ({ children }: any) => (
		<blockquote className="border-l-4 border-cyan-400 pl-3 sm:pl-4 italic text-white/60 my-3 sm:my-4 text-sm sm:text-base">
			{children}
		</blockquote>
	),
	table: ({ children }: any) => (
		<div className="overflow-x-auto mb-4 sm:mb-6 -mx-4 sm:mx-0">
			<table className="min-w-full divide-y divide-white/10 text-xs sm:text-sm">
				{children}
			</table>
		</div>
	),
	thead: ({ children }: any) => (
		<thead className="bg-white/5">{children}</thead>
	),
	th: ({ children }: any) => (
		<th className="px-3 sm:px-4 py-2 text-left text-white font-semibold whitespace-nowrap">
			{children}
		</th>
	),
	td: ({ children }: any) => (
		<td className="px-3 sm:px-4 py-2 text-white/70 border-t border-white/5">
			{children}
		</td>
	),
	strong: ({ children }: any) => (
		<strong className="font-semibold text-white">{children}</strong>
	),
	hr: () => <hr className="border-white/10 my-6 sm:my-8" />,
};

const remarkPlugins = [remarkGfm];

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
	return (
		<div className="prose prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={remarkPlugins}
				components={markdownComponents}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
