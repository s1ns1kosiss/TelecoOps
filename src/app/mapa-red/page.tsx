'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Server, 
  Radio, 
  Zap, 
  Search, 
  Terminal, 
  Activity, 
  Layers, 
  MapPin, 
  Cpu, 
  CornerDownRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MockHardwareDriver } from '@/drivers/mocks/mock_hardware_driver';

interface NapBoxItem {
  id: string;
  code: string;
  name: string;
  oltName: string;
  ponPort: number;
  location: string;
  totalPorts: number;
  usedPorts: number;
  splitterRatio: string;
  status: 'OPTIMO' | 'SATURADO' | 'REVISION';
  fiberColorCode: string;
  ports: { number: number; status: 'BUSY' | 'FREE' | 'FAULT'; customer?: string }[];
}

export default function NetworkMapPage() {
  const driver = new MockHardwareDriver();

  const [napBoxes, setNapBoxes] = useState<NapBoxItem[]>([
    {
      id: '1',
      code: 'NAP-LAS-CONDES-04',
      name: 'Caja NAP 04 - Sector Las Condes',
      oltName: 'OLT-CENTRAL-01 (Huawei)',
      ponPort: 3,
      location: 'Av. Las Condes 10400 (Poste #849)',
      totalPorts: 16,
      usedPorts: 12,
      splitterRatio: '1:16 PLC',
      status: 'OPTIMO',
      fiberColorCode: '#00E676',
      ports: Array.from({ length: 16 }, (_, i) => ({
        number: i + 1,
        status: i < 12 ? 'BUSY' : 'FREE',
        customer: i < 12 ? `Cliente FTTH-${1000 + i}` : undefined,
      })),
    },
    {
      id: '2',
      code: 'NAP-CENTRO-01',
      name: 'Caja NAP 01 - Sector Centro B2B',
      oltName: 'OLT-CENTRAL-01 (Huawei)',
      ponPort: 1,
      location: 'Calle San Martín 500 (Poste #120)',
      totalPorts: 16,
      usedPorts: 16,
      splitterRatio: '1:16 PLC',
      status: 'SATURADO',
      fiberColorCode: '#FF5500',
      ports: Array.from({ length: 16 }, (_, i) => ({
        number: i + 1,
        status: i === 15 ? 'FAULT' : 'BUSY',
        customer: `Cliente Corp-${2000 + i}`,
      })),
    },
    {
      id: '3',
      code: 'NAP-ROBLE-02',
      name: 'Caja NAP 02 - Sector El Roble',
      oltName: 'OLT-NORTE-02 (ZTE)',
      ponPort: 2,
      location: 'Pasaje El Roble 80 (Poste #42)',
      totalPorts: 8,
      usedPorts: 3,
      splitterRatio: '1:8 PLC',
      status: 'OPTIMO',
      fiberColorCode: '#00F0FF',
      ports: Array.from({ length: 8 }, (_, i) => ({
        number: i + 1,
        status: i < 3 ? 'BUSY' : 'FREE',
        customer: i < 3 ? `Cliente Res-${3000 + i}` : undefined,
      })),
    },
  ]);

  const [selectedNap, setSelectedNap] = useState<NapBoxItem | null>(napBoxes[0]);
  const [gisLog, setGisLog] = useState<string[]>([
    '// GIS_MODULE_INITIALIZED: DEDSEC_FTTH_MAP_DATABASE',
    '// SELECT A NAP BOX TO INSPECT OCCUPIED PORTS AND SPLITTER RATIOS.',
  ]);
  const [testingPorts, setTestingPorts] = useState(false);

  const handleTestNapContinuity = async () => {
    if (!selectedNap) return;
    setTestingPorts(true);
    setGisLog((prev) => [...prev, `// EXEC_CMD: testNapContinuity("${selectedNap.code}")...`]);

    setTimeout(async () => {
      const readout = await driver.readOntSignal('HWTC-MOCK-NAP');
      setGisLog((prev) => [
        ...prev,
        `📡 // HARDWARE_READOUT: Potencia de entrada a Splitter = ${readout.rxPowerDbm} dBm [ATENUACIÓN NORMAL 13.5dB]`,
        `✔ // CONTINUIDAD EN CAJA ${selectedNap.code} VERIFICADA AL 100%.`,
      ]);
      setTestingPorts(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#FF5500] font-mono selection:bg-[#FF5500] selection:text-white">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner OSS Mapa FTTH */}
        <div className="p-4 bg-black border-2 border-[#FF5500] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(255,85,0,0.15)]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#FF5500]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO OSS: MAPA DE CAJAS NAP & MATRIZ DE PUERTOS</span>
              <p className="text-[11px] text-slate-400">Monitoreo de saturación de cajas de empalme, atenuación de splitters y puertos libres.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#FF5500] text-white px-2.5 py-0.5 rounded font-bold uppercase">
            ESTADO RED: OPTIMO
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* NAP Box List (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#FF5500]" />
                Inventario de Cajas NAP en Campo
              </span>
              <span className="text-slate-400">Filtro: Todos los nodos</span>
            </div>

            <div className="space-y-3">
              {napBoxes.map((nap) => (
                <div
                  key={nap.id}
                  onClick={() => setSelectedNap(nap)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedNap?.id === nap.id
                      ? 'bg-[#19131C] border-2 border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                      : 'bg-[#0A0D15] border border-[#FF5500]/30 hover:border-[#FF5500]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#FF5500] border border-[#FF5500]/40 rounded font-bold">
                        {nap.code}
                      </span>
                      <span className="text-slate-400 font-sans">{nap.oltName} (PON {nap.ponPort})</span>
                    </div>

                    <h4 className="font-bold text-sm text-white font-sans">{nap.name}</h4>
                    <p className="text-xs text-slate-400">{nap.location}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-amber-400">// OCCUPANCY</p>
                      <p className="text-xs font-bold text-white">
                        {nap.usedPorts} / {nap.totalPorts} Puertos Ocupados
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Splitter: {nap.splitterRatio}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      nap.status === 'OPTIMO' ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40' :
                      nap.status === 'SATURADO' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {nap.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected NAP Inspector & Port Matrix Grid */}
          {selectedNap && (
            <div className="p-5 bg-black border-2 border-[#FF5500] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(255,85,0,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#FF5500]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase">// NAP_INSPECTOR</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedNap.code}</h3>
                    <p className="text-xs text-slate-400">{selectedNap.location}</p>
                  </div>
                  <span className="text-xs font-bold text-[#FF5500] bg-[#FF5500]/10 px-2.5 py-1 rounded border border-[#FF5500]/40">
                    PON {selectedNap.ponPort}
                  </span>
                </div>

                {/* Port Matrix Grid */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 uppercase">// PUERTOS DEL SPLITTER:</span>
                    <span className="text-white font-bold">{selectedNap.usedPorts}/{selectedNap.totalPorts} En Uso</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-[#080A10] p-3 rounded border border-[#FF5500]/30">
                    {selectedNap.ports.map((port) => (
                      <div
                        key={port.number}
                        className={`p-2 rounded border text-center text-xs flex flex-col items-center justify-center ${
                          port.status === 'BUSY'
                            ? 'bg-[#00E676]/10 border-[#00E676]/40 text-[#00E676]'
                            : port.status === 'FAULT'
                            ? 'bg-red-950 border-red-600 text-red-400 animate-pulse'
                            : 'bg-black border-slate-700 text-slate-500'
                        }`}
                      >
                        <span className="text-[9px] text-slate-400">P-{port.number < 10 ? `0${port.number}` : port.number}</span>
                        <span className="font-bold text-[10px] mt-0.5">
                          {port.status === 'BUSY' ? 'OCUP' : port.status === 'FAULT' ? 'FALLA' : 'LIBRE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continuity Test Action */}
                <button
                  onClick={handleTestNapContinuity}
                  disabled={testingPorts}
                  className="w-full py-2.5 px-3 bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingPorts ? 'animate-spin' : ''}`} />
                  TEST DE CONTINUIDAD EN CAJA NAP
                </button>

                {/* Console Log */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#FF5500]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#FF5500]">
                  {gisLog.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#FF5500]/30 pt-2 flex justify-between">
                <span>Splitter: <strong>{selectedNap.splitterRatio}</strong></span>
                <span className="text-[#FF5500]">OLT: {selectedNap.oltName}</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
