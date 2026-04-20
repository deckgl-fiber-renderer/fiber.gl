import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./maplibre.css";

export const metadata: Metadata = {
	title: "Airports Example - Next.js",
	description: "deck.gl fiber renderer airports example with Next.js App Router",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
				{children}
			</body>
		</html>
	);
}
