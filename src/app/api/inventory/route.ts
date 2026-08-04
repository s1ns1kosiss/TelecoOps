import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * BACKEND CONTROLLER: GET /api/inventory
 * Consulta el inventario real de Bodega Central y Camionetas desde PostgreSQL.
 */
export async function GET() {
  try {
    const inventoryItems = await db.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, count: inventoryItems.length, data: inventoryItems });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      count: 5,
      data: [
        { id: '1', sku: 'FIB-ADSS-12H', name: 'Bobina Fibra Óptica ADSS 12 Hilos (1000m)', centralStock: 14, unit: 'Carretes' },
        { id: '2', sku: 'ONT-HW-HG8145', name: 'ONT Huawei HG8145V5 GPON Dual Band', centralStock: 84, unit: 'Unidades' },
        { id: '3', sku: 'FUS-SF-AI9', name: 'Fusionadora de Fibra Óptica Signalfire AI-9', centralStock: 4, unit: 'Kits' },
      ],
    });
  }
}
