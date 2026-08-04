import { NetworkHardwareDriver } from './hardware_driver.interface';
import { MockHardwareDriver } from './mocks/mock_hardware_driver';
import { RealHardwareDriver } from './real_hardware_driver';
import { envConfig } from '@/config/env.config';

/**
 * FABRICA DE DRIVERS DE HARDWARE (FACTORY PATTERN)
 * Instancia automáticamente MockHardwareDriver en desarrollo o RealHardwareDriver en producción.
 */
export function getHardwareDriver(): NetworkHardwareDriver {
  if (envConfig.useHardwareMocks) {
    return new MockHardwareDriver();
  }
  return new RealHardwareDriver();
}
