'use client';

import React, { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Network, 
  Server, 
  Radio, 
  MapPin, 
  Plus, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  CornerDownRight 
} from 'lucide-react';

interface NapBoxItem {
  id: string;
  name: string;
  oltName: string;
  ponPort: number;
  totalPorts: number;
  usedPorts: number;
  status: 'OPTIMO' | 'ALERTA' | 'SATURADO';
}

export default function NetworkMapPage() {
  const [napBoxes, setNapBoxes] = useState<NapBoxItem[]>([]);
  const [selectedNap, setSelectedNap] = useState<NapBoxItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '// MAP_MODULE_INITIALIZED: DEDSEC_FTTH_GIS_ENGINE',
    '// CONNECTED_TO_POSTGRESQL: FETCHING LIVE NAP BOXES AND OLT NODES...',
  ]);

  useEffect(() => {
    fetchNapBoxes();
  }, []);

  const fetchNapBoxes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/naps');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setNapBoxes(data.data);
          if (data.data.length > 0) setSelectedNap(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching NAPs from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#FF5500] font-mono selection:bg-[#FF5500] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner FTTH Network Map */}
        <div className="p-4 bg-black border-2 border-[#FF5500] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(255,85,0,0.15)]">
          <div className="flex items-center gap-3">
            <Network className="w-5 h-5 text-[#FF5500]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO OSS: MAPA DE RED FTTH & MATRIZ DE CAJAS NAP</span>
              <p className="text-[11px] text-slate-400">Visualizador GIS de nodos de red y matriz de puertos en vivo alimentado por PostgreSQL.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#FF5500] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            POSTGRESQL DB CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* NAPs Directory Table (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#FF5500]" />
                Cajas NAP Registradas en PostgreSQL
              </span>
              <span className="text-slate-400">Total: {napBoxes.length} Caja(s)</span>
            </div>

            {loading ? (
              <div className="p-8 bg-[#0A0D15] border border-[#FF5500]/30 rounded text-center text-xs font-mono text-[#FF5500] animate-pulse">
                📡 Consultando nodos de red y cajas NAP en PostgreSQL...
              </div>
            ) : napBoxes.length === 0 ? (
              <div className="p-8 bg-[#0A0D15] border border-[#FF5500]/30 rounded text-center space-y-2">
                <p className="text-sm font-bold text-white font-mono">📭 SIN CAJAS NAP REGISTRADAS</p>
                <p className="text-xs text-slate-400">No hay cajas de empalme registadas en la base de datos en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {napBoxes.map((nap) => (
                  <div
                    key={nap.id}
                    onClick={() => setSelectedNap(nap)}
                    className={`p-4 rounded border transition cursor-pointer space-y-2 ${
                      selectedNap?.id === nap.id
                        ? 'bg-[#1C0E07] border-2 border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                        : 'bg-[#0A0D15] border border-[#FF5500]/30 hover:border-[#FF5500]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans text-sm">{nap.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        nap.status === 'OPTIMO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {nap.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{nap.oltName} • Puerto PON {nap.ponPort}</p>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-900">
                      <span className="text-slate-500 text-[10px]">Ocupación Puertos:</span>
                      <strong className="text-white">{nap.usedPorts} / {nap.totalPorts}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details & Port Matrix Drawer */}
          {selectedNap ? (
            <div className="p-5 bg-black border-2 border-[#FF5500] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(255,85,0,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#FF5500]/30 pb-3">
                  <span className="text-[10px] text-orange-400 uppercase">// NAP_DETAILS</span>
                  <h3 className="text-base font-bold text-white font-sans">{selectedNap.name}</h3>
                  <p className="text-xs text-slate-400">{selectedNap.oltName} (PON {selectedNap.ponPort})</p>
                </div>

                {/* 16 Ports Visual Matrix */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// MATRIZ DE PUERTOS DE FIBRA ({selectedNap.totalPorts})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: selectedNap.totalPorts }).map((_, i) => {
                      const isUsed = i < selectedNap.usedPorts;
                      return (
                        <div
                          key={i}
                          className={`p-2 rounded text-center border font-mono text-[10px] ${
                            isUsed 
                              ? 'bg-[#FF5500]/20 border-[#FF5500] text-white font-bold' 
                              : 'bg-black border-slate-800 text-slate-600'
                          }`}
                        >
                          P{String(i + 1).padStart(2, '0')}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Console */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#FF5500]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#FF5500]">
                  {consoleLog.map((log, idx) => (
                    <p key={idx} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#FF5500]/30 pt-2 flex justify-between">
                <span>Node: <strong>PostgreSQL GIS</strong></span>
                <span className="text-[#FF5500]">STATUS: {selectedNap.status}</span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-black border border-[#FF5500]/30 rounded text-center text-xs text-slate-500">
              Selecciona una caja NAP de la lista para ver su matriz de puertos.
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
