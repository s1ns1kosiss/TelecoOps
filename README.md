# 📡 TelecoOps // cTOS 2.0 (Telecom Operating Platform)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-indigo.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-cyan.svg)](https://www.docker.com/)

**TelecoOps** (Watch Dogs 2 / DedSec cTOS 2.0 Edition) es una plataforma Open-Source de operaciones y negocios para empresas de telecomunicaciones (ISPs, proveedores FTTH y contratistas de red). 

Permite conectar en una sola suite la gestión de tickets en terreno, el monitoreo de fibra óptica (dBm), la facturación recurrente con corte automático en MikroTik y la comunicación inteligente vía **WhatsApp Meta Cloud API**.

---

## 📊 Estudio de Mercado & Modelo Comercial

Revisa nuestro **Análisis de Mercado & Benchmarking** en [`MARKET_ANALYSIS.md`](./MARKET_ANALYSIS.md):
- **Oportunidad de Mercado ($4,200M USD en LatAm)**.
- **Matriz Comparativa de Competidores** (Wispro, Splynx, ISPFast, Sonar).
- **Ventaja Diferencial Clave**: WhatsApp Voice AI para terrenos & Estética Watch Dogs 2.
- **Estructura de Precios SaaS ($49, $149 y $499 USD/mes)**.

---

## 🔬 Investigación & Roadmap de Innovación

Revisa nuestro **Informe de Investigación Avanzada** en [`RESEARCH_AND_INNOVATION.md`](./RESEARCH_AND_INNOVATION.md):
- **Protocolos TR-069 & TR-369 (USP)** para gestión remota de ONTs.
- **Trazado Geoespacial GIS** para detección de cortes de fibra por OTDR.
- **IA Local Edge (Whisper.cpp)** para transcripción offline.

---

## 📐 Arquitectura & Especificaciones Técnicas

Consulta la especificación técnica de ingeniería en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 📸 Suite Completa de 11 Módulos Funcionales

- 🟢 **NOC Despacho (`/`)**: Tablero táctico y consola interactiva (`root@dedsec:~#`).
- 🔵 **CRM Suscriptores (`/clientes`)**: Ficha técnica y telemetría óptica en vivo (dBm).
- 🟠 **Mapa FTTH NAPs (`/mapa-red`)**: Trazado GIS y matriz de 16 puertos.
- 🟣 **WhatsApp AI Bot (`/whatsapp-bot`)**: Transcriptor de audios con Whisper AI.
- 🟡 **Facturación Mora (`/facturacion`)**: Pagos online y reconexión MikroTik.
- 🟤 **Cuadrillas Stock (`/cuadrillas`)**: Control de inventario en camionetas.
- 🔷 **Reportes BI (`/reportes`)**: Métricas MTTR, Uptime 99.94% y ARPU.
- 🟩 **Bodega Central (`/inventario`)**: Valorización de stock principal.
- 🟦 **Portal Cliente (`/portal-cliente`)**: Cambio clave Wi-Fi y speedtest.
- 🟥 **Configuración Red (`/configuracion`)**: Switch de Safety Engine.
- 🟨 **Login RBAC (`/login`)**: Autenticación multi-tenant y roles.

---

## 🚀 Inicio Rápido (Quickstart Local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/s1ns1kosiss/TelecoOps.git
cd TelecoOps
```

### 2. Levantar la base de datos PostgreSQL en Docker
```bash
docker compose up -d
```

### 3. Sincronizar el esquema Prisma y ejecutar Seeders
```bash
npx prisma db push
npm run db:seed
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [`http://localhost:3000`](http://localhost:3000) en tu navegador.

---

## 🤝 ¿Cómo Colaborar? (Contributing)

Revisa nuestra guía [`CONTRIBUTING.md`](./CONTRIBUTING.md) para enviar Pull Requests.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
