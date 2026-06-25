import type { Metadata } from 'next';
import { PricingClient } from './pricing-client';

export const metadata: Metadata = {
  title: "Auxo Pricing | Compiler Access Plans",
  description: "Flexible options for prompt compilation: use your own API keys for free unlimited runs (BYOK) or purchase cloud credit packs.",
  openGraph: {
    title: "Auxo Pricing | Compiler Access Plans",
    description: "Flexible options for prompt compilation: use your own API keys for free unlimited runs (BYOK) or purchase cloud credit packs.",
    url: "https://auxo.wo0.dev/pricing",
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
    title: "Auxo Pricing | Compiler Access Plans",
    description: "Flexible options for prompt compilation: use your own API keys for free unlimited runs (BYOK) or purchase cloud credit packs.",
    images: ["https://auxo.wo0.dev/logo.png"],
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
