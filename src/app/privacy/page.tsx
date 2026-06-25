import type { Metadata } from 'next';
import { PrivacyClient } from './privacy-client';

export const metadata: Metadata = {
  title: "Auxo Privacy | Security Profile & Data Handling",
  description: "Learn about Auxo's zero-telemetry edge compiles and XOR-obfuscated client key storage security guarantees.",
  openGraph: {
    title: "Auxo Privacy | Security Profile & Data Handling",
    description: "Learn about Auxo's zero-telemetry edge compiles and XOR-obfuscated client key storage security guarantees.",
    url: "https://auxo.wo0.dev/privacy",
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
    title: "Auxo Privacy | Security Profile & Data Handling",
    description: "Learn about Auxo's zero-telemetry edge compiles and XOR-obfuscated client key storage security guarantees.",
    images: ["https://auxo.wo0.dev/logo.png"],
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
