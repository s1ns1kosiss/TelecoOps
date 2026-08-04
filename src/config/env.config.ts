/**
 * Módulo de Validación y Configuración Segura de Entorno
 * Garantiza que en modo DEV nunca se ejecuten llamadas reales a hardware o APIs de pago.
 */

export const envConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  // Flags de Aislamiento de Red y Mocks
  useHardwareMocks: process.env.USE_HARDWARE_MOCKS === 'true' || process.env.NODE_ENV !== 'production',
  isWhatsAppMockMode: process.env.WHATSAPP_MOCK_MODE === 'true' || process.env.NODE_ENV !== 'production',

  // Database URL
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/telecom_dev?schema=public',

  // WhatsApp Credentials
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || 'EAAG_MOCK_TOKEN',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '100984920011',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'teleco_verify_token_123',
  },

  // ACS TR-069 Server
  acs: {
    serverUrl: process.env.ACS_SERVER_URL || 'http://localhost:7557',
    user: process.env.ACS_USERNAME || 'admin',
    password: process.env.ACS_PASSWORD || 'admin',
  },
};

// Imprime advertencia en consola al arrancar el servidor
if (envConfig.useHardwareMocks) {
  console.log('🛡️  [SAFETY ENGINE ACTIVE]: Modo MOCK de Hardware activado. Operando 100% aislado.');
} else {
  console.warn('⚠️  [PRODUCTION WARNING]: Conexiones reales a OLTs, MikroTik y WhatsApp activadas.');
}
