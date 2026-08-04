import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 [RESET] Limpiando base de datos PostgreSQL de registros sintéticos de prueba...');

  // Elimina datos respetando las restricciones de clave foránea
  await prisma.workOrderMaterial.deleteMany({});
  await prisma.workOrder.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.customerSubscription.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.napBox.deleteMany({});
  await prisma.oltDevice.deleteMany({});
  await prisma.networkNode.deleteMany({});
  await prisma.servicePlan.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  console.log('✨ [BASE DE DATOS 100% LIMPIA Y LISTA PARA PRUEBAS REALES]');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
