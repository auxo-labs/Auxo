import type { Metadata } from 'next';
import { HomeClient } from './home-client';

export const metadata: Metadata = {
  title: "Auxo | Precision AI Prompt Compiler & Cursor Rules Generator",
  description: "Compile raw specifications, requirements, and tech stack notes into prompt-optimized rule matrices (.cursor/rules, AGENTS.md, CLAUDE.md) to prevent AI context degradation.",
  openGraph: {
    title: "Auxo | Precision AI Prompt Compiler & Cursor Rules Generator",
    description: "Compile raw specifications, requirements, and tech stack notes into prompt-optimized rule matrices (.cursor/rules, AGENTS.md, CLAUDE.md) to prevent AI context degradation.",
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
    title: "Auxo | Precision AI Prompt Compiler & Cursor Rules Generator",
    description: "Compile raw specifications, requirements, and tech stack notes into prompt-optimized rule matrices (.cursor/rules, AGENTS.md, CLAUDE.md) to prevent AI context degradation.",
    images: ["https://auxo.wo0.dev/logo.png"],
  },
};

export default function Home() {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Auxo",
    "url": "https://auxo.wo0.dev"
  };

  const softwareApplicationStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Auxo",
    "operatingSystem": "All",
    "applicationCategory": "DeveloperApplication",
    "description": "Zero-auth prompt compiler that translates raw developer notes into prompt-optimized file matrices (.cursor/rules, AGENTS.md, CLAUDE.md) for 2026 AI IDEs.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteStructuredData, softwareApplicationStructuredData])
        }}
      />
      <HomeClient />
    </>
  );
}
