import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRateLimited } from '@/lib/rate_limit';

/**
 * MIDDLEWARE DE SEGURIDAD GLOBAL & PROTECCIÓN ANTI-ATAQUES
 */
export function middleware(request: NextRequest) {
  // Obtiene la IP cliente de los encabezados del proxy / CDN (Vercel/Cloudflare/AWS)
  const clientIp = 
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
    request.headers.get('x-real-ip') || 
    '127.0.0.1';

  // 1. PROTECCIÓN ANTI-DDoS Y FUERZA BRUTA (Rate Limiting)
  const rateLimitStatus = isRateLimited(clientIp);
  if (rateLimitStatus.limited) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: '🚨 ACCESO BLOQUEADO: Demasiadas solicitudes en un periodo corto (Posible ataque DDoS/Fuerza Bruta).',
        retryAfterMs: rateLimitStatus.resetTimeMs,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(rateLimitStatus.resetTimeMs / 1000).toString(),
        },
      }
    );
  }

  const response = NextResponse.next();

  // 2. CABECERA DE RATE LIMITING
  response.headers.set('X-RateLimit-Remaining', rateLimitStatus.remaining.toString());

  // 3. CABECERAS DE PROTECCIÓN HTTP OWASP
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. CONTROL DE ORIGEN CORS PARA ENDPOINTS API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-tenant-id');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
