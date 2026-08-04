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

## 📸 Estética & Módulos Integrados

La plataforma cuenta con 11 módulos con estética **Retro Hacker (cTOS 2.0)**:

- 🟢 **NOC Despacho (`/`)**: Tablero táctico de atenciones y consola interactiva (`root@dedsec:~#`).
- 🔵 **CRM Suscriptores (`/clientes`)**: Ficha técnica del cliente y telemetría óptica en vivo (dBm).
- 🟠 **Mapa FTTH NAPs (`/mapa-red`)**: Trazado GIS de cajas de empalme y matriz de 16 puertos libres/ocupados.
- 🟣 **WhatsApp AI Bot (`/whatsapp-bot`)**: Transcriptor de audios con Whisper AI y extractor automático de series ONT.
- 🟡 **Facturación Mora (`/facturacion`)**: Pagos online y reconexión automática tras cobro en MikroTik.
- 🟤 **Cuadrillas Stock (`/cuadrillas`)**: Control de inventario en camionetas y descuento por ticket.
- 🔷 **Reportes BI (`/reportes`)**: Métricas MTTR, disponibilidad de red (99.94% Uptime) y ARPU.
- 🟩 **Bodega Central (`/inventario`)**: Valorización de stock principal y traspaso a vehículos.
- 🟦 **Portal Cliente (`/portal-cliente`)**: Cambio de clave Wi-Fi remota y test de velocidad en vivo.
- 🟥 **Configuración Red (`/configuracion`)**: Switch de Safety Engine (Mock vs Real) y registro de OLTs.
- 🟨 **Login RBAC (`/login`)**: Inicio de sesión multi-tenant y selección rápida de roles.

---

## 🚀 Inicio Rápido (Quickstart Local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/telecoops.git
cd telecoops
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

¡Todas las contribuciones son bienvenidas! Revisa nuestra guía [`CONTRIBUTING.md`](./CONTRIBUTING.md) para enviar Pull Requests, agregar nuevos adaptadores de OLTs/MikroTik o proponer mejoras de interfaz.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
