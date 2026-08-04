import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TicketService } from '@/modules/field_service/ticket.service';

const ticketService = new TicketService();

/**
 * BACKEND CONTROLLER: GET /api/tickets
 * Consulta la lista real de tickets guardados en PostgreSQL.
 */
export async function GET() {
  try {
    const tickets = await db.ticket.findMany({
      include: {
        customer: true,
        workOrders: {
          include: {
            technician: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: tickets.length, data: tickets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * BACKEND CONTROLLER: POST /api/tickets
 * Crea un ticket real en la base de datos PostgreSQL.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, priority, customerId } = body;

    const defaultTenant = await db.tenant.findFirst();
    const defaultCustomer = await db.customer.findFirst();

    if (!defaultTenant) {
      return NextResponse.json({ success: false, error: 'No existe un Tenant en la DB.' }, { status: 400 });
    }

    const newTicket = await db.ticket.create({
      data: {
        tenantId: defaultTenant.id,
        ticketNumber: `WD2-${Math.floor(8000 + Math.random() * 1000)}`,
        category: category || 'INSTALLATION',
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        description: description || title || 'Revisión de conexión de fibra óptica',
        customerId: customerId || defaultCustomer?.id || '',
      },
    });

    return NextResponse.json({ success: true, data: newTicket });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * BACKEND CONTROLLER: PATCH /api/tickets
 * Cierra la orden de trabajo y actualiza el estado en PostgreSQL.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, technicianId, ontSerialNumber, rawVoiceTranscript } = body;

    const result = await ticketService.processWorkOrderClosure({
      workOrderId,
      technicianId: technicianId || 'tech-01',
      ontSerialNumber,
      rawVoiceTranscript,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
