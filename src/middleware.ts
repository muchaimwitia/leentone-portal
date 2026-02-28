import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight, edge-compatible rate limiting
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  // FOOLPROOF IP EXTRACTION: Strictly using standard Web Headers to satisfy TypeScript
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
  
  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith('/api/')) {
    const limit = 5; 
    const windowMs = 60 * 1000; 

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, timer: setTimeout(() => rateLimitMap.delete(ip), windowMs) });
    } else {
      const data = rateLimitMap.get(ip);
      if (data.count >= limit) {
        return new NextResponse(
          JSON.stringify({ error: 'Strict rate limit exceeded. Connection refused.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      data.count += 1;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};