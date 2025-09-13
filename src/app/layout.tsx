import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jason Charwin — Data Science @ UNC Chapel Hill",
  description:
    "I build human-centered data products—clean pipelines, honest analyses, and UIs people actually use.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCF4FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0D" },
  ],
  openGraph: {
    title: "Jason Charwin — Data Science @ UNC Chapel Hill",
    description:
      "I build human-centered data products—clean pipelines, honest analyses, and UIs people actually use.",
    url: "https://example.com",
    siteName: "Jason Charwin",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Charwin — Data Science @ UNC Chapel Hill",
    description:
      "I build human-centered data products—clean pipelines, honest analyses, and UIs people actually use.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${figtree.variable}`}>
      <body className="bg-bg text-dark antialiased">
        <a href="#main" className="skip-link">Skip to main content</a>
        <header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}

