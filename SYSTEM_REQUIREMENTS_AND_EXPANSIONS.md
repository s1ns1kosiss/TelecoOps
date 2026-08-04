# ⚙️ Especificación de Requerimientos & Módulos de Expansión (TelecoOps)

Basado en las investigaciones de mercado e industria, este documento especifica las **capacidades técnicas y módulos estratégicos** que debe incorporar **TelecoOps** para liderar la gestión de ISPs de nueva generación.

---

## 🎯 1. Módulo Conector de Redes Neutras (Open Access Wholesale API)

### Descripción:
Permite a los ISPs arrienden y aprovisionen suscriptoras sobre infraestructura de terceros (OnNet Fibra, V.tal, WIN) desde una sola interfaz.

- **Consulta de Factibilidad en Tiempo Real**: Verificación de cobertura geográfica ingresando la dirección del suscriptor.
- **Aprovisionamiento Automático Mayorista**: Creación de la orden de instalación directamente en la API del proveedor neutro.

---

## 📡 2. Servidor ACS TR-069 / TR-369 Integrado (ACS Engine)

### Descripción:
Gestión remota universal de ONTs/CPEs sin importar la marca o fabricante.

- **Telemetría Wi-Fi 6 / 6E**: Medición de saturación de canal en 2.4 GHz, 5 GHz y 6 GHz.
- **Actualizaciones Masivas de Firmware**: Programación de parches de seguridad para miles de módems en horario de bajo tráfico (03:00 AM).
- **Control Parental & Calidad de Servicio (QoS)**: Configuración remota de priorización de tráfico para videojuegos o streaming.

---

## 🌐 3. Gestión Dual-Stack IPv6 & CGNAT (Carrier-Grade NAT)

### Descripción:
Solución para la escasez de direcciones IPv4 públicas en ISPs emergentes.

- **Asignación de Prefijos IPv6 (`/64` o `/56`)**: Asignación nativa de bloques de direcciones IPv6 por suscriptor.
- **Trazabilidad de Puertos CGNAT**: Registro legal de mapeos IP Pública/Puerto <-> IP Privada de cliente para cumplimiento normativo.

---

## 📱 4. App PWA Offline para Técnicos en Zonas Sin Cobertura

### Descripción:
Permite a las cuadrillas operar en subterráneos o zonas rurales sin señal celular.

- **Almacenamiento Local (`IndexedDB`)**: Firma del cliente, coordenadas GPS y fotos de la caja NAP guardadas localmente.
- **Sincronización Automática**: Envío diferido de la orden a PostgreSQL cuando el teléfono recupera conectividad 4G/5G/Wi-Fi.
