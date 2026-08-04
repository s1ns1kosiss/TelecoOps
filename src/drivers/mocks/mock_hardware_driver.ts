import { NetworkHardwareDriver, OntProvisioningParams, OntSignalReadout } from '../hardware_driver.interface';

/**
 * Driver Emulador para Entornos de Desarrollo / Test.
 * Simula respuestas de OLTs, MikroTik y TR-069 sin necesidad de hardware real.
 */
export class MockHardwareDriver implements NetworkHardwareDriver {
  async readOntSignal(serialNumber: string): Promise<OntSignalReadout> {
    // Simula lectura de señal realista en fibra (-19 a -22 dBm es un nivel óptimo)
    const randomSignal = -18.5 - Math.random() * 4;
    
    return {
      serialNumber,
      rxPowerDbm: parseFloat(randomSignal.toFixed(2)),
      txPowerDbm: 2.15,
      status: 'ONLINE',
      lastUpdated: new Date(),
    };
  }

  async provisionOnt(params: OntProvisioningParams): Promise<{ success: boolean; message: string }> {
    console.log(`[MOCK DRIVER] Aprovisionando ONT ${params.serialNumber} en OLT ${params.oltId} PON ${params.ponPort}...`);
    return {
      success: true,
      message: `ONT ${params.serialNumber} aprovisionada exitosamente en modo MOCK.`,
    };
  }

  async suspendService(pppoeUser: string): Promise<{ success: boolean }> {
    console.log(`[MOCK DRIVER] Suspendiendo servicio PPPoE / IP del usuario ${pppoeUser}...`);
    return { success: true };
  }

  async resumeService(pppoeUser: string): Promise<{ success: boolean }> {
    console.log(`[MOCK DRIVER] Restableciendo servicio del usuario ${pppoeUser}...`);
    return { success: true };
  }
}
