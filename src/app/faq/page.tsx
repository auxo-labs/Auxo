import type { Metadata } from 'next';
import { FaqClient } from './faq-client';

export const metadata: Metadata = {
  title: "Auxo FAQ | Developer Knowledge Base",
  description: "Learn about prompt sharding, cognitive agent rule files, and Bring Your Own Key (BYOK) privacy and security profiles.",
  openGraph: {
    title: "Auxo FAQ | Developer Knowledge Base",
    description: "Learn about prompt sharding, cognitive agent rule files, and Bring Your Own Key (BYOK) privacy and security profiles.",
    url: "https://auxo.wo0.dev/faq",
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
    title: "Auxo FAQ | Developer Knowledge Base",
    description: "Learn about prompt sharding, cognitive agent rule files, and Bring Your Own Key (BYOK) privacy and security profiles.",
    images: ["https://auxo.wo0.dev/logo.png"],
  },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Auxo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Auxo is a zero-auth, real-time collaborative workspace designed to translate raw developer brainstorming notes, stack lists, and requirements into a prompt-optimised context matrix containing AGENTS.md, CLAUDE.md, .windsurfrules, and .cursor/rules/*.mdc rules files."
        }
      },
      {
        "@type": "Question",
        "name": "What is context sharding, and why does it save tokens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Large Language Models suffer from attention degradation (the Lost-in-the-Middle effect) in long contexts. Auxo shards guidelines: global architectures live in AGENTS.md, CLI scripts in CLAUDE.md, and specific rules in glob-scoped .mdc files. This reduces input token overhead by up to 18.4% on average."
        }
      },
      {
        "@type": "Question",
        "name": "What is AGENTS.md?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AGENTS.md acts as the universal system constitution read by over 30 coding assistants. It declares global technology stacks, architectural boundaries, coding philosophies (such as DRY, KISS, SOLID, YAGNI), and regulatory compliance directives without duplicate rules blocks."
        }
      },
      {
        "@type": "Question",
        "name": "What is CLAUDE.md?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CLAUDE.md is a specialised runtime instructions file parsed directly by Anthropic's Claude Code CLI. It registers explicit safe commands to run development servers, builds, linters, and testing suites, referencing @AGENTS.md to keep tokens small."
        }
      },
      {
        "@type": "Question",
        "name": "How do .cursor/rules/*.mdc files work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cursor rules use structured YAML frontmatter blocks containing path patterns (globs) to specify when they should be loaded. This ensures the AI model only holds instructions relevant to the active file, avoiding rule contamination and token bloat."
        }
      },
      {
        "@type": "Question",
        "name": "Is my private API key safe in BYOK mode?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we enforce a strict zero-retention security profile. Keys are obfuscated in client-side LocalStorage using symmetric XOR-based mask arrays, sent securely over TLS-encrypted HTTPS connections within transient request headers, and are never logged, cached, or written to disk."
        }
      },
      {
        "@type": "Question",
        "name": "Is Auxo free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Auxo is fully open-source and provides an unlimited Free BYOK (Bring Your Own Key) Tier. You can supply your own developer keys to run deep AI compilations completely for free."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <FaqClient />
    </>
  );
}
