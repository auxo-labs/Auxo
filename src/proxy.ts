import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract client IP address securely
  const ip = (request as NextRequest & { ip?: string }).ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. API Route Rate Limiting (Compile / Checkout)
  if (pathname.startsWith('/api/compile') || pathname.startsWith('/api/checkout')) {
    const prefix = pathname.includes('/compile') ? 'compile' : 'checkout';
    const limit = prefix === 'compile' ? 5 : 3; // 5 compiles/min, 3 checkouts/min
    
    const rateLimit = await checkRateLimit(ip, limit, 60, prefix);
    
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds.` },
        { status: 429 }
      );
    }
  }

  // 2. Room Route Rate Limiting to prevent Supabase Realtime channel spam
  if (pathname.startsWith('/room/')) {
    const roomId = pathname.split('/')[2];
    if (roomId && roomId.length > 0) {
      const rateLimit = await checkRateLimit(ip, 10, 60, 'room'); // Max 10 room loads/min
      
      if (rateLimit.limited) {
        return new NextResponse(
          `<html>
            <head>
              <title>Too Many Requests</title>
              <style>
                body { background-color: #09090b; color: #a1a1aa; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .container { border: 1px solid #27272a; padding: 24px; border-radius: 8px; background-color: #09090b; text-align: center; }
                h1 { color: #f4f4f5; font-size: 14px; margin-top: 0; }
                p { font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>RATE LIMIT EXCEEDED</h1>
                <p>You have loaded too many sandbox rooms recently. Please wait ${rateLimit.resetSeconds} seconds.</p>
              </div>
            </body>
          </html>`,
          {
            status: 429,
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/compile', '/api/checkout', '/room/:id*'],
};
