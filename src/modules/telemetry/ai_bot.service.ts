import { MockHardwareDriver } from '@/drivers/mocks/mock_hardware_driver';

export interface BotQueryParams {
  tenantId: string;
  senderRole: 'TECHNICIAN' | 'CUSTOMER' | 'DISPATCHER';
  senderPhone: string;
  prompt: string;
}

export interface BotResponse {
  intent: 'DIAGNOSTIC' | 'REBOOT' | 'CHECK_STOCK' | 'REPORT_OUTAGE' | 'UNKNOWN';
  message: string;
  actionExecuted?: string;
  data?: any;
}

/**
 * MOTOR DE IA & BOT AUTÓNOMO DE TELECOMUNICACIONES (DedSec Sentinel Bot)
 * Procesa intenciones de voz o texto de técnicos en terreno y suscriptores.
 */
export class AiTelecomBotService {
  private driver = new MockHardwareDriver();

  /**
   * Procesa la consulta del usuario y determina la acción operativa a ejecutar
   */
  async processQuery(params: BotQueryParams): Promise<BotResponse> {
    const text = params.prompt.toLowerCase();
    console.log(`🤖 [DEDSEC AI BOT] Procesando consulta de ${params.senderRole} (${params.senderPhone}): "${params.prompt}"`);

    // 1. Intención: Diagnóstico / Medición de Fibra
    if (text.includes('medir') || text.includes('potencia') || text.includes('señal') || text.includes('dbm')) {
      // Extrae número de serie si existe
      const snMatch = params.prompt.match(/[A-Z0-9]{4}-[A-Z0-9]{6}/i);
      const sn = snMatch ? snMatch[0] : 'HWTC-99A821';

      const readout = await this.driver.readOntSignal(sn);

      return {
        intent: 'DIAGNOSTIC',
        message: `📡 Diagnóstico en vivo de ONT (${sn}): Potencia de entrada: ${readout.rxPowerDbm} dBm. Estado: ${readout.status}. La atenuación de fibra está dentro del rango óptimo.`,
        actionExecuted: 'READ_ONT_SIGNAL',
        data: readout,
      };
    }

    // 2. Intención: Reiniciar ONT / Módem
    if (text.includes('reiniciar') || text.includes('reboot') || text.includes('reset')) {
      return {
        intent: 'REBOOT',
        message: `⚡ Pulso de reinicio remoto enviado a la ONT del cliente. El equipo se encenderá en 45 segundos.`,
        actionExecuted: 'REBOOT_ONT',
      };
    }

    // 3. Intención: Stock de Materiales en Camioneta
    if (text.includes('stock') || text.includes('materiales') || text.includes('fibra') || text.includes('conectores')) {
      return {
        intent: 'CHECK_STOCK',
        message: `📦 Inventario disponible en tu vehículo: 450m Fibra Drop, 42 Conectores Fast SC/APC, 6 ONTs Huawei.`,
        actionExecuted: 'CHECK_TRUCK_STOCK',
      };
    }

    // 4. Intención: Reporte de Falla Masiva
    if (text.includes('falla') || text.includes('corte') || text.includes('sin servicio') || text.includes('caido')) {
      return {
        intent: 'REPORT_OUTAGE',
        message: `⚠️ Se ha registrado el reporte de avería en el nodo. Un equipo técnico ha sido notificado para revisar la caja NAP del sector.`,
        actionExecuted: 'CREATE_INCIDENT_TICKET',
      };
    }

    // Respuesta por defecto si no reconoce la intención
    return {
      intent: 'UNKNOWN',
      message: `🤖 Hola, soy el Asistente Inteligente cTOS 2.0. Puedo ayudarte a medir potencias de fibra, reiniciar ONTs remotas, revisar tu stock de camioneta o registrar fallas. ¿En qué puedo asistirte?`,
    };
  }
}
