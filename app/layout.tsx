import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is free and open. To swap to Satoshi:
//   1. Register at fontshare.com
//   2. Self-host the .woff2 in /public/fonts/
//   3. Use next/font/local instead of next/font/google
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio · Frontend & 3D Engineer",
  description:
    "A portfolio at the intersection of motion, interaction, and clarity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-bone antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
