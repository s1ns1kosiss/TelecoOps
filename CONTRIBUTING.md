# 🤝 Guía de Contribución a TelecoOps

¡Gracias por tu interés en colaborar con **TelecoOps**! Este proyecto es Open Source y se nutre de las contribuciones de desarrolladores, ingenieros de redes e ISPs de todo el mundo.

---

## 🛠️ ¿En qué puedes colaborar?

1. **Nuevos Adaptadores de Hardware de Red (`src/drivers/`)**:
   - Integración con OLTs Huawei, ZTE, Fiberhome, V-SOL y Nokia.
   - Integración con Routers MikroTik RouterOS API y servidores RADIUS.
2. **Mejoras de la Interfaz Visual (Watch Dogs 2 cTOS 2.0)**:
   - Nuevos componentes, micro-animaciones o mejoras de accesibilidad.
3. **Módulos Adicionales de Inteligencia de Red & IA**:
   - Integraciones con pasarelas de pago locales o modelos de IA adicionales.

---

## 📋 Pasos para enviar un Pull Request (PR)

1. **Haz un Fork** del repositorio a tu cuenta de GitHub.
2. **Crea una rama** para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. **Realiza tus cambios** asegurando que la compilación de TypeScript no tenga errores (`npx tsc --noEmit`).
4. **Prueba el build**: `npm run build`.
5. **Haz Commit** de tus cambios (`git commit -m 'feat: Agrega driver OLT Nokia'`).
6. **Envía un Pull Request** explicando la mejora introducida.

---

¡Gracias por construir el futuro de las telecomunicaciones open-source!
