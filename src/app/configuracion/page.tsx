'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Settings, 
  Server, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Key, 
  Radio, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  CornerDownRight,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';

interface NetworkDeviceItem {
  id: string;
  name: string;
  brand: 'MIKROTIK' | 'HUAWEI' | 'ZTE' | 'VSOL';
  ipAddress: string;
  managementPort: number;
  protocol: 'SSH' | 'API_REST' | 'SNMP' | 'TR069';
  status: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  activeConns: number;
}

export default function NetworkConfigPage() {
  const [useHardwareMocks, setUseHardwareMocks] = useState(true);
  
  const [devices, setDevices] = useState<NetworkDeviceItem[]>([
    {
      id: '1',
      name: 'ROUTER-CORE-MIKROTIK-01',
      brand: 'MIKROTIK',
      ipAddress: '10.0.0.1',
      managementPort: 8728,
      protocol: 'API_REST',
      status: 'ONLINE',
      activeConns: 4892,
    },
    {
      id: '2',
      name: 'OLT-CENTRAL-HUAWEI',
      brand: 'HUAWEI',
      ipAddress: '10.0.1.10',
      managementPort: 22,
      protocol: 'SSH',
      status: 'ONLINE',
      activeConns: 1024,
    },
    {
      id: '3',
      name: 'OLT-NORTE-ZTE',
      brand: 'ZTE',
      ipAddress: '10.0.2.10',
      managementPort: 22,
      protocol: 'SSH',
      status: 'ONLINE',
      activeConns: 512,
    },
    {
      id: '4',
      name: 'OLT-SUR-VSOL',
      brand: 'VSOL',
      ipAddress: '10.0.3.10',
      managementPort: 161,
      protocol: 'SNMP',
      status: 'STANDBY',
      activeConns: 1840,
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<NetworkDeviceItem | null>(devices[0]);
  const [configLogs, setConfigLogs] = useState<string[]>([
    '// HARDWARE_CONFIG_MODULE_INITIALIZED: DEDSEC_NETWORK_CONTROL',
    '// SAFETY_ENGINE: USE_HARDWARE_MOCKS="true" (100% AISLADO EN DEV)...',
  ]);
  const [testingConn, setTestingConn] = useState(false);

  const handleTestConnection = () => {
    if (!selectedDevice) return;
    setTestingConn(true);
    setConfigLogs((prev) => [
      ...prev,
      `📡 // PINGING_DEVICE: ${selectedDevice.name} (${selectedDevice.ipAddress}:${selectedDevice.managementPort})...`,
      `🔑 // TESTING_PROTOCOL: ${selectedDevice.protocol}...`,
    ]);

    setTimeout(() => {
      setConfigLogs((prev) => [
        ...prev,
        `✔ // CONNECTION_SUCCESS: Handshake completado con ${selectedDevice.brand} (${selectedDevice.ipAddress}). Latencia: 1ms.`,
      ]);
      setTestingConn(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#EF4444] font-mono selection:bg-[#EF4444] selection:text-white">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Network Config */}
        <div className="p-4 bg-black border-2 border-[#EF4444] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#EF4444]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO RED: CENTRO DE CONFIGURACIÓN MIKROTIK & OLTs</span>
              <p className="text-[11px] text-slate-400">Administra IPs, credenciales API/SSH y alterna el interruptor del Safety Engine entre Modo Mock y Producción Real.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#EF4444] text-white px-2.5 py-0.5 rounded font-bold uppercase">
            SAFETY ENGINE: ACTIVE
          </span>
        </div>

        {/* Safety Engine Environment Switch Card */}
        <div className="p-5 bg-[#120808] border-2 border-[#EF4444] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#EF4444] animate-pulse" />
              <h3 className="text-base font-bold text-white font-sans uppercase">// ENTORNO Y SEGURIDAD HARDWARE</h3>
            </div>
            <p className="text-slate-300">
              Modo MOCK activo: Previene que comandos de corte o reinicio afecten a routers o equipos físicos en producción.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setUseHardwareMocks(!useHardwareMocks);
                setConfigLogs((prev) => [
                  ...prev,
                  `🛡️ // SAFETY_ENGINE_SWITCHED: Hardware Mocks = ${!useHardwareMocks ? 'ENABLED' : 'DISABLED'}`,
                ]);
              }}
              className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition border ${
                useHardwareMocks
                  ? 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50 hover:bg-[#00FF66]/30'
                  : 'bg-red-950 text-red-400 border-red-800 hover:bg-red-900'
              }`}
            >
              {useHardwareMocks ? '🟢 MODO MOCK (DESARROLLO AISLADO)' : '🔴 HARDWARE REAL (PRODUCCIÓN EN VIVO)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Network Devices List (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#EF4444]" />
                Dispositivos de Red Registrados
              </span>
              <span className="text-slate-400">Total: {devices.length} Equipos</span>
            </div>

            <div className="space-y-3">
              {devices.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedDevice?.id === dev.id
                      ? 'bg-[#1C0D0D] border-2 border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'bg-[#0A0D15] border border-[#EF4444]/30 hover:border-[#EF4444]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#EF4444] border border-[#EF4444]/40 rounded font-bold">
                        {dev.brand}
                      </span>
                      <span className="text-white font-sans font-bold">{dev.name}</span>
                    </div>

                    <p className="text-xs text-slate-400">
                      IP: <span className="text-cyan-300">{dev.ipAddress}</span> • Puerto: {dev.managementPort} ({dev.protocol})
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-slate-400">// ACTIVE_SESSIONS</p>
                      <p className="text-xs font-bold text-white">{dev.activeConns} Sesiones</p>
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      dev.status === 'ONLINE' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {dev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Inspector & Connectivity Test Panel */}
          {selectedDevice && (
            <div className="p-5 bg-black border-2 border-[#EF4444] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#EF4444]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase">// DEVICE_INSPECTOR</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedDevice.name}</h3>
                    <p className="text-xs text-slate-400">IP: {selectedDevice.ipAddress}</p>
                  </div>
                  <span className="text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-1 rounded border border-[#EF4444]/40">
                    {selectedDevice.protocol}
                  </span>
                </div>

                {/* Connection Test Controls */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// PRUEBAS DE CONEXIÓN Y DIAGNÓSTICO:</p>

                  <button
                    onClick={handleTestConnection}
                    disabled={testingConn}
                    className="w-full py-2.5 px-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${testingConn ? 'animate-spin' : ''}`} />
                    PROBAR HANDSHAKE ({selectedDevice.protocol})
                  </button>
                </div>

                {/* Console Log */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#EF4444]/30 h-32 overflow-y-auto text-[10px] space-y-1 font-mono text-[#EF4444]">
                  {configLogs.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#EF4444]/30 pt-2 flex justify-between">
                <span>Protocolo: <strong>{selectedDevice.protocol}</strong></span>
                <span className="text-[#EF4444]">STATE: ACTIVE</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
