'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Truck, 
  Wrench, 
  Package, 
  UserCheck, 
  Terminal, 
  Activity, 
  Plus, 
  Minus, 
  CheckCircle2, 
  CornerDownRight,
  MapPin,
  RefreshCw,
  Box
} from 'lucide-react';

interface CrewItem {
  id: string;
  code: string;
  name: string;
  technicianName: string;
  vehiclePlate: string;
  vehicleModel: string;
  status: 'EN_TERRENO' | 'DISPONIBLE' | 'EN_PAUSA';
  assignedTicket?: string;
  stock: { itemId: string; name: string; quantity: number; unit: string }[];
}

export default function CrewsPage() {
  const [crews, setCrews] = useState<CrewItem[]>([
    {
      id: '1',
      code: 'CREW-01',
      name: 'Cuadrilla DedSec 1',
      technicianName: 'Esteban R. & Rodrigo V.',
      vehiclePlate: 'AA-8492',
      vehicleModel: 'Ford Ranger 4x4 FTTH',
      status: 'EN_TERRENO',
      assignedTicket: 'WD2-8488',
      stock: [
        { itemId: '1', name: 'Cable Fibra Drop 1 Hilo', quantity: 450, unit: 'Metros' },
        { itemId: '2', name: 'Conectores Fast SC/APC', quantity: 42, unit: 'Piezas' },
        { itemId: '3', name: 'ONT Huawei HG8145V5', quantity: 6, unit: 'Unidades' },
        { itemId: '4', name: 'Herrajes & Tensores de Roseta', quantity: 35, unit: 'Piezas' },
      ],
    },
    {
      id: '2',
      code: 'CREW-02',
      name: 'Cuadrilla DedSec 2',
      technicianName: 'Carlos M. & Felipe S.',
      vehiclePlate: 'CC-1042',
      vehicleModel: 'Toyota Hilux 4x4 NOC',
      status: 'EN_TERRENO',
      assignedTicket: 'WD2-8492',
      stock: [
        { itemId: '1', name: 'Cable Fibra Drop 1 Hilo', quantity: 280, unit: 'Metros' },
        { itemId: '2', name: 'Conectores Fast SC/APC', quantity: 18, unit: 'Piezas' },
        { itemId: '3', name: 'ONT ZTE F670L', quantity: 4, unit: 'Unidades' },
        { itemId: '4', name: 'Herrajes & Tensores de Roseta', quantity: 12, unit: 'Piezas' },
      ],
    },
    {
      id: '3',
      code: 'CREW-03',
      name: 'Cuadrilla DedSec Support',
      technicianName: 'Gonzalo P. & Matías L.',
      vehiclePlate: 'DD-9901',
      vehicleModel: 'Chevrolet Colorado Tech',
      status: 'DISPONIBLE',
      stock: [
        { itemId: '1', name: 'Cable Fibra Drop 1 Hilo', quantity: 800, unit: 'Metros' },
        { itemId: '2', name: 'Conectores Fast SC/APC', quantity: 60, unit: 'Piezas' },
        { itemId: '3', name: 'ONT V-SOL GPON', quantity: 10, unit: 'Unidades' },
        { itemId: '4', name: 'Herrajes & Tensores de Roseta', quantity: 50, unit: 'Piezas' },
      ],
    },
  ]);

  const [selectedCrew, setSelectedCrew] = useState<CrewItem | null>(crews[0]);
  const [crewLogs, setCrewLogs] = useState<string[]>([
    '// FIELD_CREWS_MODULE_INITIALIZED: DEDSEC_WORKFORCE_LOGISTICS',
    '// INVENTORY_DAEMON: TRACKING MATERIAL CONSUMPTION PER TRUCK...',
  ]);
  const [updatingStock, setUpdatingStock] = useState(false);

  const handleRestockTruck = () => {
    if (!selectedCrew) return;
    setUpdatingStock(true);
    setCrewLogs((prev) => [...prev, `📦 // RESTOCK_EVENT: Reabasteciendo materiales en vehículo ${selectedCrew.vehiclePlate}...`]);

    setTimeout(() => {
      setCrews((prev) =>
        prev.map((c) =>
          c.id === selectedCrew.id
            ? {
                ...c,
                stock: c.stock.map((item) => ({ ...item, quantity: item.quantity + 50 })),
              }
            : c
        )
      );
      setSelectedCrew((prev) =>
        prev
          ? {
              ...prev,
              stock: prev.stock.map((item) => ({ ...item, quantity: item.quantity + 50 })),
            }
          : null
      );
      setCrewLogs((prev) => [...prev, `✔ // RESTOCK_COMPLETE: Insumos cargados exitosamente en ${selectedCrew.code}.`]);
      setUpdatingStock(false);
    }, 1200);
  };

  const handleDeductTicketMaterials = () => {
    if (!selectedCrew) return;
    setUpdatingStock(true);
    setCrewLogs((prev) => [
      ...prev,
      `✂️ // AUTO_DEDUCTION_TRIGGERED: Cierre de ticket ${selectedCrew.assignedTicket || 'WD2-8492'}.`,
      `✂️ // Descontando 50m Fibra Drop, 2 Conectores Fast y 1 ONT de vehículo ${selectedCrew.vehiclePlate}...`,
    ]);

    setTimeout(() => {
      setCrews((prev) =>
        prev.map((c) =>
          c.id === selectedCrew.id
            ? {
                ...c,
                stock: c.stock.map((item) => {
                  if (item.name.includes('Drop')) return { ...item, quantity: Math.max(0, item.quantity - 50) };
                  if (item.name.includes('Fast')) return { ...item, quantity: Math.max(0, item.quantity - 2) };
                  if (item.name.includes('ONT')) return { ...item, quantity: Math.max(0, item.quantity - 1) };
                  return item;
                }),
              }
            : c
        )
      );
      setSelectedCrew((prev) =>
        prev
          ? {
              ...prev,
              stock: prev.stock.map((item) => {
                if (item.name.includes('Drop')) return { ...item, quantity: Math.max(0, item.quantity - 50) };
                if (item.name.includes('Fast')) return { ...item, quantity: Math.max(0, item.quantity - 2) };
                if (item.name.includes('ONT')) return { ...item, quantity: Math.max(0, item.quantity - 1) };
                return item;
              }),
            }
          : null
      );
      setCrewLogs((prev) => [...prev, `✔ // INVENTARIO EN VEHÍCULO ACTUALIZADO AL 100%.`]);
      setUpdatingStock(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#A855F7] font-mono selection:bg-[#A855F7] selection:text-white">
      
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
              <span className="font-bold text-white uppercase">// MÓDULO LOGÍSTICO: GESTIÓN DE CUADRILLAS Y VEHÍCULOS</span>
              <p className="text-[11px] text-slate-400">Monitoreo de inventario asignado a cada camioneta y descuento automático de materiales por orden de trabajo.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#A855F7] text-white px-2.5 py-0.5 rounded font-bold uppercase">
            STATUS: ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Crews Directory Table (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#A855F7]" />
                Cuadrillas Operativas y Vehículos Asignados
              </span>
              <span className="text-slate-400">Total: {crews.length} Cuadrilla(s)</span>
            </div>

            <div className="space-y-3">
              {crews.map((crew) => (
                <div
                  key={crew.id}
                  onClick={() => setSelectedCrew(crew)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedCrew?.id === crew.id
                      ? 'bg-[#180E24] border-2 border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#0A0D15] border border-[#A855F7]/30 hover:border-[#A855F7]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#A855F7] border border-[#A855F7]/40 rounded font-bold">
                        {crew.code}
                      </span>
                      <span className="text-slate-400 font-sans">{crew.vehicleModel}</span>
                      <span className="text-[10px] text-purple-300 font-mono">[{crew.vehiclePlate}]</span>
                    </div>

                    <h4 className="font-bold text-sm text-white font-sans">{crew.name}</h4>
                    <p className="text-xs text-slate-400">Técnicos: {crew.technicianName}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-purple-300">// ASSIGNED_TICKET</p>
                      <p className="text-xs font-bold text-white">
                        {crew.assignedTicket || 'SIN ASIGNACIÓN'}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      crew.status === 'EN_TERRENO' ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40' :
                      'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40'
                    }`}>
                      {crew.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Inventory Inspector & Action Controls */}
          {selectedCrew && (
            <div className="p-5 bg-black border-2 border-[#A855F7] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#A855F7]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase">// TRUCK_STOCK_INSPECTOR</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedCrew.name}</h3>
                    <p className="text-xs text-slate-400">{selectedCrew.vehicleModel} ({selectedCrew.vehiclePlate})</p>
                  </div>
                  <span className="text-xs font-bold text-[#A855F7] bg-[#A855F7]/10 px-2.5 py-1 rounded border border-[#A855F7]/40">
                    {selectedCrew.status}
                  </span>
                </div>

                {/* Material Stock Grid */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// INVENTARIO FÍSICO EN CAMIONETA:</p>

                  <div className="space-y-2 bg-[#0C0814] p-3 rounded border border-[#A855F7]/30">
                    {selectedCrew.stock.map((item) => (
                      <div key={item.itemId} className="flex justify-between items-center text-xs border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-slate-300 font-sans text-[11px] flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#A855F7]" />
                          {item.name}
                        </span>
                        <strong className="text-[#A855F7] font-mono">
                          {item.quantity} {item.unit}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// ACCIONES DE INVENTARIO:</p>

                  <button
                    onClick={handleRestockTruck}
                    disabled={updatingStock}
                    className="w-full py-2.5 px-3 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    REABASTECER INSUMOS EN CAMIONETA
                  </button>

                  <button
                    onClick={handleDeductTicketMaterials}
                    disabled={updatingStock}
                    className="w-full py-2 px-3 bg-black hover:bg-[#A855F7]/20 border border-[#A855F7] text-[#A855F7] font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                    SIMULAR DESCUENTO POR TICKET ({selectedCrew.assignedTicket || 'WD2-8492'})
                  </button>
                </div>

                {/* Console Output */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#A855F7]/30 h-24 overflow-y-auto text-[10px] space-y-1 font-mono text-[#A855F7]">
                  {crewLogs.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#A855F7]/30 pt-2 flex justify-between">
                <span>Vehículo: <strong>{selectedCrew.vehiclePlate}</strong></span>
                <span className="text-[#A855F7]">GPS: ON_ROUTE</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
