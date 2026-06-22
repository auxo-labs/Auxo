import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Auxo | Precision Prompt Compiler & Cursor Rules Generator",
  description: "Zero-auth, privacy-first playground to compile messy developer notes into prompt-optimized file matrices (.cursor/rules, AGENTS.md, CLAUDE.md) for 2026 AI IDEs.",
  icons: {
    icon: "/logo-nobg.png",
    shortcut: "/logo-nobg.png",
    apple: "/logo-nobg.png",
  },
  openGraph: {
    title: "Auxo | Precision Prompt Compiler & Cursor Rules Generator",
    description: "Compile raw specs and notes into optimized prompt configurations for Cursor, Windsurf, and Claude Code.",
    url: "https://auxo.wo0.dev",
    siteName: "Auxo",
    images: [
      {
        url: "https://auxo.wo0.dev/logo.png",
        width: 800,
        height: 600,
        alt: "Auxo Brand Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auxo | Precision Prompt Compiler & Cursor Rules Generator",
    description: "Compile raw specs into optimized prompt files for cognitive AI IDEs.",
    images: ["https://auxo.wo0.dev/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
