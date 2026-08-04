import { NextResponse } from 'next/server';
import { TicketService } from '@/modules/field_service/ticket.service';

const ticketService = new TicketService();

/**
 * BACKEND CONTROLLER: GET /api/webhooks/whatsapp
 * Verificación oficial requerida por Meta / WhatsApp Business API
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'teleco_verify_token_123';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WHATSAPP WEBHOOK] Webhook de Meta verificado exitosamente!');
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token de verificación inválido' }, { status: 403 });
}

/**
 * BACKEND CONTROLLER: POST /api/webhooks/whatsapp
 * Receptor de mensajes entrantes (Audios, Fotos, Ubicación) enviados por los técnicos desde la app móvil de WhatsApp.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[WHATSAPP WEBHOOK] Evento entrante de Meta:', JSON.stringify(body, null, 2));

    // Si el mensaje es una simulación de pruebas o payload real:
    const audioMessage = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const fromPhone = audioMessage?.from || '+56984921042';

    if (audioMessage?.type === 'audio' || body.mockAudioTranscript) {
      const transcript = body.mockAudioTranscript || 'Instalación terminada ONT HWTC-99A821 señal OK';
      
      const closureResult = await ticketService.processWorkOrderClosure({
        workOrderId: 'WD2-8492',
        technicianId: fromPhone,
        ontSerialNumber: 'HWTC-99A821',
        rawVoiceTranscript: transcript,
      });

      return NextResponse.json({
        success: true,
        message: 'Audio procesado y ticket cerrado en cTOS 2.0',
        closureResult,
      });
    }

    return NextResponse.json({ success: true, message: 'Evento recibido y registrado.' });
  } catch (error: any) {
    console.error('[WHATSAPP WEBHOOK ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
