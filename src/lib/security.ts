import crypto from 'crypto';

/**
 * Módulo de Criptografía y Seguridad para Telecom
 */

/**
 * Valida la firma criptográfica HMAC-SHA256 enviada por Meta en los webhooks de WhatsApp.
 * Previene ataques de suplantación de identidad (Spoofing) y Man-in-the-Middle.
 */
export function verifyWhatsAppSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader) return false;

  // La cabecera llega en formato: sha256=HEX_SIGNATURE
  const signatureParts = signatureHeader.split('=');
  if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
    return false;
  }

  const expectedSignature = signatureParts[1];
  const computedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf-8'),
    Buffer.from(computedSignature, 'utf-8')
  );
}

/**
 * Genera un token aleatorio criptográficamente seguro para firmas temporales
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Sanitiza entradas de texto para evitar ataques XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
