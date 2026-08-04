export interface OntSignalReadout {
  serialNumber: string;
  rxPowerDbm: number;
  txPowerDbm: number;
  status: 'ONLINE' | 'OFFLINE' | 'LOS' | 'DYING_GASP';
  lastUpdated: Date;
}

export interface OntProvisioningParams {
  serialNumber: string;
  oltId: string;
  ponPort: number;
  serviceProfile: string;
  pppoeUser?: string;
  pppoePassword?: string;
}

export interface NetworkHardwareDriver {
  /**
   * Lee los niveles de potencia y estado de la ONT remota
   */
  readOntSignal(serialNumber: string): Promise<OntSignalReadout>;

  /**
   * Autentica y aprovisiona una ONT en la OLT
   */
  provisionOnt(params: OntProvisioningParams): Promise<{ success: boolean; message: string }>;

  /**
   * Ejecuta corte/suspensión de servicio en el MikroTik / OLT
   */
  suspendService(pppoeUser: string): Promise<{ success: boolean }>;

  /**
   * Restablece el servicio tras pago
   */
  resumeService(pppoeUser: string): Promise<{ success: boolean }>;
}
