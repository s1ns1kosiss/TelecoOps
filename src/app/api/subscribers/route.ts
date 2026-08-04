import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * BACKEND CONTROLLER: GET /api/subscribers
 * Consulta la lista real de suscriptores guardados en PostgreSQL.
 */
export async function GET() {
  try {
    const customers = await db.customer.findMany({
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: customers.length, data: customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * BACKEND CONTROLLER: POST /api/subscribers
 * Registra un cliente real en la base de datos PostgreSQL.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, taxId, email, phone, address, tenantId } = body;

    if (!name || !taxId) {
      return NextResponse.json({ success: false, error: 'Campos requeridos: name, taxId.' }, { status: 400 });
    }

    const defaultTenant = await db.tenant.findFirst();
    const activeTenantId = tenantId || defaultTenant?.id;

    if (!activeTenantId) {
      return NextResponse.json({ success: false, error: 'No existe un Tenant activo en la DB.' }, { status: 400 });
    }

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'Residencial';

    const newCustomer = await db.customer.create({
      data: {
        tenantId: activeTenantId,
        code: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName,
        lastName,
        taxId,
        email: email || `${taxId.replace(/[^a-zA-Z0-9]/g, '')}@telecom.cl`,
        phone: phone || '+56900000000',
        address: address || 'Av. Las Condes 10420, Dpto 42',
      },
    });

    return NextResponse.json({ success: true, data: newCustomer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
