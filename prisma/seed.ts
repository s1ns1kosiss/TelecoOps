import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [SEEDER] Poblando base de datos PostgreSQL con datos iniciales de Telecom...');

  // 1. Crear Tenant Principal
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'teleco-chile' },
    update: {},
    create: {
      slug: 'teleco-chile',
      businessName: 'TelecoOps Chile S.A.',
      country: 'CL',
      timezone: 'America/Santiago',
    },
  });

  console.log(`✔ Tenant creado: ${tenant.businessName} (${tenant.id})`);

  // 2. Crear Usuarios (Admin, Despachador y Técnicos)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@teleco.cl' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Mauricio Despacho Central',
      email: 'admin@teleco.cl',
      phoneNumber: '+56984920000',
      role: 'DISPATCHER',
    },
  });

  const tech1 = await prisma.user.upsert({
    where: { email: 'carlos.m@teleco.cl' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Carlos M. (Cuadrilla DedSec 2)',
      email: 'carlos.m@teleco.cl',
      phoneNumber: '+56984921042',
      role: 'TECHNICIAN',
    },
  });

  const tech2 = await prisma.user.upsert({
    where: { email: 'esteban.r@teleco.cl' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Esteban R. (Cuadrilla DedSec 1)',
      email: 'esteban.r@teleco.cl',
      phoneNumber: '+56977123341',
      role: 'TECHNICIAN',
    },
  });

  console.log('✔ Usuarios de despacho y cuadrillas creados.');

  // 3. Crear Planes de Servicio
  const planGamer = await prisma.servicePlan.create({
    data: {
      tenantId: tenant.id,
      name: 'Fibra Gamer Ultra 940M',
      downloadSpeedMbps: 940,
      uploadSpeedMbps: 940,
      monthlyPrice: 29990,
      technology: 'FTTH',
    },
  });

  const planEmpresa = await prisma.servicePlan.create({
    data: {
      tenantId: tenant.id,
      name: 'Fibra Empresa Dedicada 2000M',
      downloadSpeedMbps: 2000,
      uploadSpeedMbps: 2000,
      monthlyPrice: 120000,
      technology: 'FTTH',
    },
  });

  console.log('✔ Planes de velocidad FTTH creados.');

  // 4. Crear Nodos de Red y OLTs
  const nodeCentral = await prisma.networkNode.create({
    data: {
      tenantId: tenant.id,
      name: 'NODE-CENTRAL-SANTIAGO',
      nodeType: 'POP',
      address: 'Av. Providencia 1200',
      geoLat: -33.425,
      geoLng: -70.612,
    },
  });

  const oltHuawei = await prisma.oltDevice.create({
    data: {
      tenantId: tenant.id,
      nodeId: nodeCentral.id,
      brand: 'HUAWEI',
      model: 'MA5608T GPON',
      managementIp: '10.0.1.10',
    },
  });

  const nap1 = await prisma.napBox.create({
    data: {
      tenantId: tenant.id,
      oltId: oltHuawei.id,
      ponPort: 3,
      name: 'NAP-LAS-CONDES-04',
      totalPorts: 16,
      availablePorts: 4,
      geoLat: -33.412,
      geoLng: -70.582,
    },
  });

  console.log('✔ Nodos de Red, OLT Huawei y Cajas NAP registrados.');

  // 5. Crear Clientes y Suscripciones
  const customer1 = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      code: 'SUB-1042',
      firstName: 'Juan',
      lastName: 'Pérez Residencial',
      taxId: '16.892.412-K',
      phone: '+56984921042',
      email: 'juan.perez@gmail.com',
      address: 'Av. Las Condes 10420, Dpto 42',
      status: 'ACTIVE',
    },
  });

  await prisma.customerSubscription.create({
    data: {
      tenantId: tenant.id,
      customerId: customer1.id,
      planId: planGamer.id,
      napBoxId: nap1.id,
      napPort: 8,
      ontSerialNumber: 'HWTC-99A821',
      pppoeUser: 'juan_perez_ftth',
      ipAddress: '192.168.10.142',
      status: 'ACTIVE',
    },
  });

  console.log('✔ Cliente Juan Pérez y Suscripción activa creados.');

  // 6. Crear Tickets y Órdenes de Trabajo
  const ticket1 = await prisma.ticket.create({
    data: {
      tenantId: tenant.id,
      ticketNumber: 'WD2-8492',
      customerId: customer1.id,
      category: 'INSTALLATION',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      description: 'Instalación de fibra óptica drop + ONT Huawei en domicilio.',
    },
  });

  await prisma.workOrder.create({
    data: {
      tenantId: tenant.id,
      ticketId: ticket1.id,
      technicianId: tech1.id,
      status: 'IN_PROGRESS',
      voiceNoteUrl: 'https://storage.teleco.cl/audio/wd2-8492.mp3',
      aiSummary: 'Instalación en curso por Carlos M.',
      dbmSignalMeasured: -19.4,
    },
  });

  console.log('✔ Ticket de soporte y Orden de Trabajo registradas.');
  console.log('🎉 [SEEDER COMPLETADO EXITOSAMENTE]');
}

main()
  .catch((e) => {
    console.error('❌ Error en Seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
