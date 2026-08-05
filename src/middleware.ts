import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRateLimited } from '@/lib/rate_limit';

/**
 * GLOBAL SECURITY MIDDLEWARE (OWASP & CLOUDFLARE PROTECTION)
 * Inyecta cabeceras de seguridad OWASP, valida cabeceras de Cloudflare (cf-connecting-ip)
 * y ejecuta Rate Limiting Anti-DDoS en todas las rutas API.
 */
export function middleware(request: NextRequest) {
  // Extrae la IP cliente real proveniente del Proxy de Cloudflare
  const clientIp = 
    request.headers.get('cf-connecting-ip') || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    '127.0.0.1';

  // Aplica Anti-DDoS Rate Limiting en rutas /api/*
  if (request.nextUrl.pathname.startsWith('/api')) {
    const rateCheck = isRateLimited(clientIp);
    if (rateCheck.limited) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Anti-DDoS: Demasiadas solicitudes. Intente en 1 minuto.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  const response = NextResponse.next();

  // Inyecta Cabeceras de Seguridad OWASP & Cloudflare
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(self)');

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
