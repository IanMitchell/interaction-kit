import "@/styles/globals.css";
import React from "react";
import { AnalyticsWrapper } from "./analytics";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<head>
				<title>Interaction Kit</title>
			</head>
			<body>
				{children}
				<AnalyticsWrapper />
			</body>
		</html>
	);
}
