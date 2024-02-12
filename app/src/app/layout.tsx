import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SseProvider } from "@/context/sse";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Crypto Portfolio",
	description: "A simple crypto portfolio tracker",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<SseProvider>
					{children}
				</SseProvider>
				<Toaster />
				<footer className="text-center text-muted-foreground text-sm m-2">
					&copy; 2024 - Siriwat Janke
				</footer>
			</body>
		</html>
	);
}
