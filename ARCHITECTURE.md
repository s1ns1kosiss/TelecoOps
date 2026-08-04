# 📐 TelecoOps Architecture & System Design Specification

This document provides a detailed technical overview of the architecture, design patterns, security standards, and data models implemented in **TelecoOps (cTOS 2.0)**.

---

## 🛠️ 1. Architecture Overview (Domain-Driven Design)

TelecoOps is structured as a **Modular Monolith** adhering to Domain-Driven Design (DDD) principles and Clean Architecture layers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (Next.js 14 UI)                   │
│         11 Retro Hacker Modules (NOC, CRM, OSS, BSS, AI Bot, BI)        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST Fetch
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   API CONTROLLER LAYER (Next.js Server)                 │
│      OWASP Security Middleware • Rate Limiter • HMAC-SHA256 Webhooks     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Domain Invocations
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  DOMAIN SERVICES LAYER (Pure TypeScript)                │
│    TicketService • AiTelecomBotService • BillingEngine • SafetyEngine   │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
                    ▼                                 ▼
┌────────────────────────────────────────┐ ┌─────────────────────────────┐
│    HARDWARE ABSTRACTION LAYER (HAL)    │ │   PERSISTENCE LAYER (ORM)   │
│  HardwareDriverFactory                 │ │   Prisma ORM Singleton      │
│  ├─ MockHardwareDriver (DEV)           │ │   PostgreSQL 16 DB          │
│  └─ RealHardwareDriver (PROD SSH/API)  │ │   Multi-Tenant Isolation    │
└────────────────────────────────────────┘ └─────────────────────────────┘
```

---

## 🔌 2. Hardware Abstraction Layer (HAL) & Safety Engine

To protect physical ISP hardware during development, TelecoOps implements the **Driver Pattern** via an explicit contract interface:

### Interface Contract (`src/drivers/hardware_driver.interface.ts`):
```typescript
export interface NetworkHardwareDriver {
  readOntSignal(serialNumber: string): Promise<OntSignalReadout>;
  provisionOnt(params: OntProvisioningParams): Promise<{ success: boolean; message: string }>;
  suspendService(pppoeUser: string): Promise<{ success: boolean }>;
  resumeService(pppoeUser: string): Promise<{ success: boolean }>;
}
```

### Dynamic Factory (`src/drivers/hardware_driver.factory.ts`):
```typescript
export function getHardwareDriver(): NetworkHardwareDriver {
  if (envConfig.useHardwareMocks) {
    return new MockHardwareDriver(); // 100% Isolated emulated hardware
  }
  return new RealHardwareDriver();   // Live SSH/API connections to MikroTik & OLTs
}
```

---

## 🔒 3. Multi-Tenant Data Isolation Strategy

Every database model contains an indexed `tenantId` column enforcing logical multi-tenancy:

```prisma
model Customer {
  id        String   @id @default(uuid())
  tenantId  String
  code      String
  taxId     String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, code])
  @@index([tenantId])
}
```

---

## 🛡️ 4. Security Architecture & OWASP Compliance

1. **Anti-DDoS Rate Limiting (`src/lib/rate_limit.ts`)**:
   - Tracks incoming request rate per client IP. Blocks malicious botnets exceeding 60 req/min with `HTTP 429`.
2. **HMAC-SHA256 Cryptographic Webhook Verification (`src/lib/security.ts`)**:
   - Validates `x-hub-signature-256` headers sent by Meta Cloud API using `crypto.timingSafeEqual` to prevent timing attacks.
3. **OWASP HTTP Security Headers (`src/middleware.ts`)**:
   - Injects `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `X-XSS-Protection` globally.
