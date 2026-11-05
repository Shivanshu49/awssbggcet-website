import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import site from "@/content/site.json";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: {
    default: site.clubName,
    template: `%s | ${site.clubName}`,
  },
  description: site.tagline,
  openGraph: {
    type: "website",
    siteName: site.clubName,
    title: site.clubName,
    description: site.tagline,
    locale: "en_IN",
  },
};

// The logo is app/icon.png: a real 512x512 PNG, unlike public/logo/sbg-logo.png, which is a JPEG.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: site.clubName, alternateName: "AWS SBG GCET", url: `${SITE_URL}/` },
    {
      "@type": "Organization",
      name: site.clubName,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon.png`,
      sameAs: Object.values(site.socials).filter(Boolean),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, sora.variable)}>
      <body className="flex min-h-dvh flex-col bg-[#090511] antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a
          href="#main"
          className="sr-only rounded-md bg-aws-navy px-4 py-2 text-surface focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
