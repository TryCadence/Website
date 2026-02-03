import type { ReactNode } from "react";
import { Header } from "../landing/Header";

interface LandingLayoutProps {
	children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
	return (
		<div className="min-h-screen bg-[#09090b] text-white">
			{/* Header */}
			<Header />

			{/* Content */}
			<main className="relative">{children}</main>
		</div>
	);
}
