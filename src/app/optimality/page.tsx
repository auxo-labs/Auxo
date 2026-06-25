import type { Metadata } from 'next';
import { OptimalityClient } from './optimality-client';

export const metadata: Metadata = {
  title: "Auxo Optimality | Empirical Study & Technical Specs",
  description: "Empirical research paper detailing prompt compiler performance, lost-in-the-middle mitigations, and context-window token optimization maps.",
  openGraph: {
    title: "Auxo Optimality | Empirical Study & Technical Specs",
    description: "Empirical research paper detailing prompt compiler performance, lost-in-the-middle mitigations, and context-window token optimization maps.",
    url: "https://auxo.wo0.dev/optimality",
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
    title: "Auxo Optimality | Empirical Study & Technical Specs",
    description: "Empirical research paper detailing prompt compiler performance, lost-in-the-middle mitigations, and context-window token optimization maps.",
    images: ["https://auxo.wo0.dev/logo.png"],
  },
};

export default function OptimalityPage() {
  return <OptimalityClient />;
}
