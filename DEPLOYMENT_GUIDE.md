# 🚀 Guía de Despliegue en Producción & Presentación Piloto - TelecoOps (cTOS 2.0)

Esta guía detalla los pasos para desplegar la plataforma **TelecoOps** en producción y presentar el software a empresas de telecomunicaciones (ISPs, contratistas FTTH) como un producto SaaS rentable.

---

## 🛠️ 1. Requisitos para Producción

1. **Hosting Web (Next.js 14 App Router)**:
   - Plataforma recomendada: **Vercel**, **Render**, **AWS Amplify** o **Docker Container** (VPS Ubuntu/Debian).
2. **Base de Datos PostgreSQL (Multi-Tenant)**:
   - Proveedores cloud recomendados: **Supabase**, **Neon.tech**, **AWS RDS** o **DigitalOcean Managed Postgres**.
3. **API de WhatsApp Cloud (Meta Developer Portal)**:
   - App creada en [Meta for Developers](https://developers.facebook.com/).
   - Token de Acceso Permanente & Teléfono Comercial Registrado.
   - Webhook URL configurado apuntando a `https://tu-dominio.com/api/webhooks/whatsapp`.

---

## ⚙️ 2. Variables de Entorno de Producción (`.env.production`)

Configura las siguientes variables en el panel de tu hosting:

```env
# ENTORNO Y SEGURIDAD
NODE_ENV="production"
USE_HARDWARE_MOCKS="false"  # Cambiar a true si deseas pruebas aisladas en prod
ALLOWED_ORIGIN="https://tu-dominio.com"

# BASE DE DATOS POSTGRESQL REAL
DATABASE_URL="postgresql://usuario:password@tu-host-postgres.com:5432/telecom_platform?schema=public&sslmode=require"

# META WHATSAPP CLOUD API
WHATSAPP_TOKEN="EAAG..."
WHATSAPP_PHONE_NUMBER_ID="104928104..."
WHATSAPP_VERIFY_TOKEN="telecoops_secure_verify_token_2026"
WHATSAPP_APP_SECRET="c8f9d0e1b2a3..."

# WHISPER AI TRANSCRIPTION
OPENAI_API_KEY="sk-proj-..."
```

---

## 📦 3. Pasos de Despliegue en Servidor

### Paso 1: Migrar la Base de Datos PostgreSQL en la Nube
```bash
npx prisma db push
npm run db:seed
```

### Paso 2: Compilar el Proyecto Next.js
```bash
npm run build
```

### Paso 3: Iniciar el Servidor
```bash
npm run start
```

---

## 💼 4. Estrategia de Presentación para Clientes Piloto (Pitch Comercial)

Al presentar el software a un gerente de operaciones o dueño de ISP, enfócate en estos **3 puntos de dolor**:

1. **"Los técnicos no usan formularios pesados en la calle"**:
   - Muestra el flujo de **WhatsApp AI**: *"Tus técnicos siguen usando WhatsApp como siempre, pero ahora la IA lee la ONT, mide la potencia de fibra en la OLT y cierra el ticket automáticamente en 2 segundos."*

2. **"Control de Materiales en Camioneta en Tiempo Real"**:
   - Muestra el módulo de **Bodega Central & Cuadrillas**: *"Sabrás exactamente cuántos metros de cable y conectores tiene cada camioneta en la calle."*

3. **"Reconexión Automática tras Pago"**:
   - Muestra el módulo de **Facturación**: *"Cuando un moroso paga por MercadoPago o Webpay, el servicio se reconecta solo en MikroTik sin esperar a que un administrativo lo habilite."*
