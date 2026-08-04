import { MockHardwareDriver } from '@/drivers/mocks/mock_hardware_driver';

export interface CreateTicketDTO {
  tenantId: string;
  customerId: string;
  category: 'INSTALLATION' | 'REPAIR' | 'DISCONNECT' | 'MAINTENANCE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface CloseWorkOrderDTO {
  workOrderId: string;
  technicianId: string;
  voiceNoteUrl?: string;
  rawVoiceTranscript?: string;
  ontSerialNumber?: string;
  photoUrls?: string[];
  materialsUsed?: { name: string; quantity: number }[];
}

export class TicketService {
  private driver = new MockHardwareDriver();

  /**
   * Simula la resolución de una orden de trabajo procesando la nota de voz del técnico con IA
   */
  async processWorkOrderClosure(dto: CloseWorkOrderDTO) {
    console.log(`[TICKET SERVICE] Procesando cierre de Orden ${dto.workOrderId}...`);

    let measuredSignalDbm = null;

    // Si la nota de voz traía un número de serie de ONT o fue detectado, verificamos la señal con el Driver
    if (dto.ontSerialNumber) {
      const readout = await this.driver.readOntSignal(dto.ontSerialNumber);
      measuredSignalDbm = readout.rxPowerDbm;
      console.log(`[TICKET SERVICE] Lectura de potencia de fibra recibida: ${measuredSignalDbm} dBm`);
    }

    // Simulación de resumen generado por IA a partir del audio
    const aiSummary = dto.rawVoiceTranscript 
      ? `Resumen IA: ${dto.rawVoiceTranscript}. Lectura de potencia: ${measuredSignalDbm ?? 'N/A'} dBm.` 
      : 'Cierre registrado correctamente por el técnico.';

    return {
      success: true,
      workOrderId: dto.workOrderId,
      status: 'RESOLVED',
      aiSummary,
      measuredSignalDbm,
      closedAt: new Date(),
    };
  }
}
