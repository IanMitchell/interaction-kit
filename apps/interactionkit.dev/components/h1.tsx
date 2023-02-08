import type { ReactNode } from "react";

interface H1Props {
	children: ReactNode;
}

export function H1({ children }: H1Props) {
	return (
		<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			{children}
		</h1>
	);
}
