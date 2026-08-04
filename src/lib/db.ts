import { PrismaClient } from '@prisma/client';
import { envConfig } from '@/config/env.config';

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Singleton de Prisma Client para reutilizar conexiones de base de datos
 * y prevenir fugas de memoria en Next.js (Hot Reloading).
 */
export const db =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: envConfig.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}

/**
 * Helper para agregar aislamiento de Tenant ID a las consultas de Prisma (Multi-tenancy)
 */
export function withTenant(tenantId: string) {
  return {
    where: {
      tenantId,
    },
  };
}
