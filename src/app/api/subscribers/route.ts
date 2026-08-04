import { NextResponse } from 'next/server';
import { MockHardwareDriver } from '@/drivers/mocks/mock_hardware_driver';

const driver = new MockHardwareDriver();

/**
 * BACKEND CONTROLLER: GET /api/subscribers
 * Retorna la lista de suscriptores con parámetros de red
 */
export async function GET() {
  const subscribers = [
    {
      id: '1',
      code: 'SUB-1042',
      name: 'Juan Pérez Residencial',
      taxId: '16.892.412-K',
      phone: '+56 9 8492 1042',
      address: 'Av. Las Condes 10420, Dpto 42',
      planName: 'Fibra Gamer Ultra',
      status: 'ACTIVO',
      ontSn: 'HWTC-99A821',
      signalDbm: -19.4,
      pppoeUser: 'juan_perez_ftth',
    },
    {
      id: '2',
      code: 'SUB-1088',
      name: 'Supermercado Central B2B',
      taxId: '76.120.400-3',
      phone: '+56 9 5512 8812',
      address: 'Calle San Martín 512',
      planName: 'Fibra Empresa Dedicada',
      status: 'MOROSO',
      ontSn: 'ZTEG-88F410',
      signalDbm: -26.2,
      pppoeUser: 'super_central_b2b',
    },
  ];

  return NextResponse.json({ success: true, count: subscribers.length, data: subscribers });
}

/**
 * BACKEND CONTROLLER: POST /api/subscribers
 * Ejecuta acciones remotas de red (Lectura dBm, Suspensión por mora, Reconexión)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ontSn, pppoeUser } = body;

    if (action === 'READ_SIGNAL') {
      const readout = await driver.readOntSignal(ontSn || 'HWTC-MOCK');
      return NextResponse.json({ success: true, readout });
    }

    if (action === 'SUSPEND') {
      const res = await driver.suspendService(pppoeUser || 'user_ftth');
      return NextResponse.json({ success: true, message: 'Servicio suspendido en MikroTik/OLT', result: res });
    }

    if (action === 'RESUME') {
      const res = await driver.resumeService(pppoeUser || 'user_ftth');
      return NextResponse.json({ success: true, message: 'Servicio restablecido', result: res });
    }

    return NextResponse.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
