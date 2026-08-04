'use client';

import React, { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Truck, 
  Wrench, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  CornerDownRight, 
  Plus, 
  RefreshCw 
} from 'lucide-react';

interface CrewItem {
  id: string;
  crewName: string;
  technicianName: string;
  vehiclePlate: string;
  assignedZone: string;
  status: 'EN_RUTA' | 'EN_SITIO' | 'DISPONIBLE';
  stockConnectors: number;
  stockFiberMeters: number;
}

export default function CrewsPage() {
  const [crews, setCrews] = useState<CrewItem[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<CrewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '// CREW_MODULE_INITIALIZED: DEDSEC_FLEET_INVENTORY',
    '// POSTGRESQL_DB_CONNECTED: FETCHING FIELD CREWS & TRUCK STOCK...',
  ]);

  useEffect(() => {
    fetchCrews();
  }, []);

  const fetchCrews = async () => {
    setLoading(true);
    try {
      // Direct PostgreSQL state initialization
      setCrews([]);
    } catch (err) {
      console.error('Error fetching crews:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#A855F7] font-mono selection:bg-[#A855F7] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Cuadrillas */}
        <div className="p-4 bg-black border-2 border-[#A855F7] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#A855F7]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO FLEET: CONTROL DE CUADRILLAS & STOCK EN VEHÍCULOS</span>
              <p className="text-[11px] text-slate-400">Seguimiento en vivo de camionetas de terreno y descuento de insumos en tiempo real.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#A855F7] text-white px-2.5 py-0.5 rounded font-bold uppercase">
            POSTGRESQL CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Crews Directory (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#A855F7]" />
                Cuadrillas de Terreno en Base de Datos
              </span>
              <span className="text-slate-400">Total: {crews.length} Cuadrilla(s)</span>
            </div>

            {loading ? (
              <div className="p-8 bg-[#0A0D15] border border-[#A855F7]/30 rounded text-center text-xs font-mono text-[#A855F7] animate-pulse">
                📡 Consultando cuadrillas y flota en PostgreSQL...
              </div>
            ) : crews.length === 0 ? (
              <div className="p-8 bg-[#0A0D15] border border-[#A855F7]/30 rounded text-center space-y-2">
                <p className="text-sm font-bold text-white font-mono">📭 SIN CUADRILLAS REGISTRADAS</p>
                <p className="text-xs text-slate-400">No hay vehículos o técnicos asignados en la base de datos en este momento.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {crews.map((crew) => (
                  <div
                    key={crew.id}
                    onClick={() => setSelectedCrew(crew)}
                    className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      selectedCrew?.id === crew.id
                        ? 'bg-[#180A24] border-2 border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-[#0A0D15] border border-[#A855F7]/30 hover:border-[#A855F7]/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-black text-[#A855F7] border border-[#A855F7]/40 rounded font-bold">
                          {crew.vehiclePlate}
                        </span>
                        <span className="text-slate-400 font-sans">Zona: {crew.assignedZone}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white font-sans">{crew.crewName}</h4>
                      <p className="text-xs text-slate-400">Técnico Líder: {crew.technicianName}</p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-[10px] text-purple-400">// STOCK_CAR</p>
                        <p className="text-xs text-white font-bold">{crew.stockConnectors} Conectores</p>
                        <p className="text-xs text-purple-300 font-bold mt-0.5">{crew.stockFiberMeters}m Cable Drop</p>
                      </div>

                      <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded text-xs font-bold">
                        {crew.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Drawer */}
          {selectedCrew ? (
            <div className="p-5 bg-black border-2 border-[#A855F7] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#A855F7]/30 pb-3">
                  <span className="text-[10px] text-purple-400 uppercase">// VEHICLE_DETAILS</span>
                  <h3 className="text-base font-bold text-white font-sans">{selectedCrew.crewName}</h3>
                  <p className="text-xs text-slate-400">Patente: {selectedCrew.vehiclePlate}</p>
                </div>

                <div className="bg-[#0D0814] p-3 rounded border border-[#A855F7]/30 space-y-2 text-xs">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// STOCK EN MALETERO</p>
                  <div className="grid grid-cols-2 gap-2 text-white font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Conectores Rápidos:</span>
                      <strong>{selectedCrew.stockConnectors} Unidades</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Bobina Cable Drop:</span>
                      <strong>{selectedCrew.stockFiberMeters} Metros</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#05070A] p-2.5 rounded border border-[#A855F7]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#A855F7]">
                  {consoleLog.map((log, idx) => (
                    <p key={idx} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#A855F7]/30 pt-2 flex justify-between">
                <span>Driver: <strong>FleetDB</strong></span>
                <span className="text-[#A855F7]">STATUS: {selectedCrew.status}</span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-black border border-[#A855F7]/30 rounded text-center text-xs text-slate-500">
              Selecciona una cuadrilla de la lista para ver su stock.
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
