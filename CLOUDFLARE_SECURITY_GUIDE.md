# 🛡️ Guía de Arquitectura de Seguridad & Integración Cloudflare (TelecoOps)

Este documento detalla la **Estrategia de Seguridad Empresarial con Cloudflare** para proteger la plataforma **TelecoOps (cTOS 2.0)** contra ataques DDoS, intrusiones en la red y accesos no autorizados a la infraestructura ISP.

---

## 🌐 1. Capas de Protección Cloudflare

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENTE / TÉCNICO / WHATSAPP                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / HTTPS Request
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLOUDFLARE EDGE NETWORK                          │
│  ├─ L3/L4/L7 Volumetric DDoS Mitigation (100+ Tbps capacity)                │
│  ├─ WAF (Web Application Firewall - OWASP Ruleset)                          │
│  ├─ Cloudflare Turnstile (Bot & Anti-Scraping Protection)                   │
│  └─ Cloudflare Zero Trust / Access (MFA SSO para endpoints Admin)           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Clean Encrypted Traffic (TLS 1.3)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   TELECOOPS APPLICATION SERVER (Next.js 14)                 │
│      Middleware OWASP • Internal IP Rate Limiter • HMAC-SHA256 Signatures   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 2. Configuración Recomendada de Cloudflare WAF & DNS

### A. Registros DNS & Proxy (Nube Naranja 🟠)
- **A Record**: `telecoops.app` $\rightarrow$ IP pública del servidor VPS / Vercel (Proxied 🟠).
- **CNAME Record**: `api.telecoops.app` $\rightarrow$ Proxy activo para protección de API endpoints.

### B. Reglas de WAF (Web Application Firewall)
1. **Bloqueo de Paises Fuera de Operación (Geo-Blocking)**:
   - Bloquear o desafiar tráfico proveniente de regiones no operativas si el ISP es 100% regional.
2. **Protección de Webhooks WhatsApp (`/api/webhooks/whatsapp`)**:
   - Permitir únicamente rangos IP oficiales de Meta (Facebook) para evitar inyecciones de payloads falsos.
3. **Limitación de Tasa (Rate Limiting)**:
   - Máximo 60 peticiones por minuto por IP para endpoints `/api/*`.

---

## 🔐 3. Integración de Cabeceras Cloudflare en Middleware Next.js

Para verificar las IPs reales provenientes de Cloudflare y validar la cabecera `CF-Connecting-IP`, el middleware de Next.js (`src/middleware.ts`) se configura para extraer la IP cliente real:

```typescript
// Extrae la IP enviada por el Proxy de Cloudflare
const clientIp = request.headers.get('cf-connecting-ip') || 
                 request.headers.get('x-forwarded-for') || 
                 '127.0.0.1';
```

---

## 🤖 4. Sustitución de CAPTCHAs por Cloudflare Turnstile

- En la pantalla de inicio de sesión ([`/login`](file:///c:/Users/Frijol/Desktop/teleco/src/app/login/page.tsx)), se recomienda integrar **Cloudflare Turnstile**, un desafío criptográfico transparente que valida que el usuario sea humano sin interrumpir la experiencia con imágenes molestas.

---

## 📄 Conclusión de Seguridad
La combinación de **Cloudflare WAF + Next.js OWASP Middleware + HMAC-SHA256 Webhook Validation** entrega una seguridad de nivel bancario para empresas de telecomunicaciones.
