import { NextResponse } from 'next/server';
import { AiTelecomBotService } from '@/modules/telemetry/ai_bot.service';

const botService = new AiTelecomBotService();

/**
 * BACKEND CONTROLLER: POST /api/bot/chat
 * Endpoint desacoplado para interacción con el Bot Inteligente de Telecomunicaciones
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, senderRole, senderPhone, tenantId } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'El campo "prompt" es requerido.' }, { status: 400 });
    }

    const response = await botService.processQuery({
      prompt,
      senderRole: senderRole || 'TECHNICIAN',
      senderPhone: senderPhone || '+56984921042',
      tenantId: tenantId || 'teleco-chile',
    });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
