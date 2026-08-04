/**
 * Motor de Limitación de Tasa (Rate Limiting) y Protección Anti-DDoS / Brute Force
 * Almacena en memoria (o Redis en prod) el contador de solicitudes por IP.
 */

interface RateLimitRecord {
  count: number;
  firstRequestTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Configuración por defecto: Máximo 60 solicitudes por minuto por dirección IP
const WINDOW_SIZE_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 60;

/**
 * Verifica si una dirección IP ha superado el límite de solicitudes.
 * Retorna true si la solicitud debe ser BLOQUEADA (429 Too Many Requests).
 */
export function isRateLimited(ip: string): { limited: boolean; remaining: number; resetTimeMs: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  // Si no hay registro previo de esta IP
  if (!record) {
    ipRequestMap.set(ip, { count: 1, firstRequestTime: now });
    return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTimeMs: WINDOW_SIZE_MS };
  }

  // Si la ventana de tiempo ya venció, reiniciamos el contador
  if (now - record.firstRequestTime > WINDOW_SIZE_MS) {
    ipRequestMap.set(ip, { count: 1, firstRequestTime: now });
    return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTimeMs: WINDOW_SIZE_MS };
  }

  // Incrementamos el contador
  record.count += 1;

  // Si superó el límite permitido
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    console.warn(`🚨 [SECURITY ALARM] IP ${ip} bloqueada por intento de ataque de fuerza bruta/DDoS (${record.count} req/min).`);
    return { 
      limited: true, 
      remaining: 0, 
      resetTimeMs: WINDOW_SIZE_MS - (now - record.firstRequestTime) 
    };
  }

  return {
    limited: false,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetTimeMs: WINDOW_SIZE_MS - (now - record.firstRequestTime),
  };
}

// Limpieza automática en memoria cada 5 minutos para evitar acumulación de registros
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now - record.firstRequestTime > WINDOW_SIZE_MS) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);
