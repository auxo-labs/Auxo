// Live Tech Resolver module - executed server-side

export interface TechSignature {
  packageName: string;
  latestVersion: string;
  architecturalInvariant: string;
}

/**
 * Parses user notes to detect tech packages, queries NPM registry for latest versions,
 * and attaches key 2026 framework invariants to feed to the LLM compiler.
 */
export async function resolveTechStack(rawNotes: string): Promise<TechSignature[]> {
  const detectedLibs: string[] = [];
  
  if (/next/i.test(rawNotes)) detectedLibs.push('next');
  if (/tailwind/i.test(rawNotes)) detectedLibs.push('tailwindcss');
  if (/prisma/i.test(rawNotes)) detectedLibs.push('prisma');
  if (/supabase/i.test(rawNotes)) detectedLibs.push('@supabase/supabase-js');

  const signatures = await Promise.all(
    detectedLibs.map(async (lib) => {
      try {
        // Fetch up-to-the-minute version strings from keyless NPM registry
        const res = await fetch(`https://registry.npmjs.org/${lib}/latest`, {
          next: { revalidate: 3600 } // Cache registry lookups for 1 hour to prevent rate limits
        });
        
        if (!res.ok) throw new Error('Registry query failed');
        
        const data = await res.json();
        const version = data.version || 'latest';

        // Map version-specific rules
        let invariant = 'Follow framework default patterns.';
        
        if (lib === 'tailwindcss') {
          if (version.startsWith('4')) {
            invariant = 'Tailwind v4 is CSS-native. Absolute prohibition on creating tailwind.config.js. All theme tokens must live inside src/app/globals.css using the @theme directive block.';
          } else {
            invariant = 'Maintain style rules inside tailwind.config.js.';
          }
        }
        
        if (lib === 'next') {
          if (version.startsWith('16') || version.startsWith('15')) {
            invariant = 'Next.js 16/15 leverages Server Components by default. Avoid `"use client"` directives unless client state (useState/useEffect) is mandatory. Uses route params as Promises (unwrap with React.use(params) or await params).';
          } else {
            invariant = 'Default to App router file rules.';
          }
        }

        if (lib === '@supabase/supabase-js') {
          invariant = 'Use transient Realtime Broadcast or Presence channels for low-latency synchronization. Limit direct database connections or stateful writes unless explicitly outlined.';
        }

        return { 
          packageName: lib, 
          latestVersion: version, 
          architecturalInvariant: invariant 
        };
      } catch {
        return { 
          packageName: lib, 
          latestVersion: 'latest', 
          architecturalInvariant: 'Maintain standard framework conventions.' 
        };
      }
    })
  );

  return signatures;
}
