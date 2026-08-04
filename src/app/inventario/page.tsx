'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Boxes, 
  Package, 
  Truck, 
  ArrowRight, 
  Barcode, 
  Plus, 
  Terminal, 
  ShieldCheck, 
  CheckCircle2, 
  CornerDownRight,
  Search,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface WarehouseItem {
  id: string;
  sku: string;
  name: string;
  category: 'FIBRA_OPTICA' | 'EQUIPOS_ONT' | 'HERRAMIENTAS' | 'CONECTORES';
  serialNumber?: string;
  centralStock: number;
  unit: string;
  assignedTruck?: string;
  minThreshold: number;
}

export default function CentralWarehousePage() {
  const [warehouseStock, setWarehouseStock] = useState<WarehouseItem[]>([
    {
      id: '1',
      sku: 'FIB-ADSS-12H',
      name: 'Bobina Fibra Óptica ADSS 12 Hilos (1000m)',
      category: 'FIBRA_OPTICA',
      centralStock: 14,
      unit: 'Carretes (14.000m)',
      minThreshold: 5,
    },
    {
      id: '2',
      sku: 'ONT-HW-HG8145',
      name: 'ONT Huawei HG8145V5 GPON Dual Band',
      category: 'EQUIPOS_ONT',
      serialNumber: 'HWTC-BATCH-99A',
      centralStock: 84,
      unit: 'Unidades',
      minThreshold: 20,
    },
    {
      id: '3',
      sku: 'FUS-SF-AI9',
      name: 'Fusionadora de Fibra Óptica Signalfire AI-9',
      category: 'HERRAMIENTAS',
      serialNumber: 'SN-SF-994102',
      centralStock: 4,
      unit: 'Kits',
      minThreshold: 2,
    },
    {
      id: '4',
      sku: 'OTDR-ANR-104',
      name: 'Medidor OTDR Anritsu Telemetría Óptica',
      category: 'HERRAMIENTAS',
      serialNumber: 'SN-ANR-8812',
      centralStock: 2,
      unit: 'Unidades',
      minThreshold: 1,
    },
    {
      id: '5',
      sku: 'CON-FAST-SCAPC',
      name: 'Caja Conectores Fast SC/APC (100 Unidades)',
      category: 'CONECTORES',
      centralStock: 35,
      unit: 'Cajas (3.500 pcs)',
      minThreshold: 10,
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(warehouseStock[0]);
  const [targetTruck, setTargetTruck] = useState('CREW-01 (Toyota Hilux CC-1042)');
  const [transferQuantity, setTransferQuantity] = useState(5);
  const [warehouseLogs, setWarehouseLogs] = useState<string[]>([
    '// CENTRAL_WAREHOUSE_MODULE_INITIALIZED: DEDSEC_LOGISTICS_HUB',
    '// SERIAL_TRACKING_DAEMON: MONITORING MAC/SN MOVEMENT FROM WAREHOUSE TO TRUCKS...',
  ]);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransferToTruck = () => {
    if (!selectedItem || selectedItem.centralStock < transferQuantity) return;

    setIsTransferring(true);
    setWarehouseLogs((prev) => [
      ...prev,
      `📦 // TRANSFER_INITIATED: Moviendo ${transferQuantity} ${selectedItem.unit} de SKU ${selectedItem.sku}...`,
      `🚚 // TARGET_VEHICLE: ${targetTruck}`,
    ]);

    setTimeout(() => {
      setWarehouseStock((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, centralStock: item.centralStock - transferQuantity }
            : item
        )
      );
      setSelectedItem((prev) => (prev ? { ...prev, centralStock: prev.centralStock - transferQuantity } : null));

      setWarehouseLogs((prev) => [
        ...prev,
        `✔ // TRANSFER_COMPLETE: ${transferQuantity} ${selectedItem.unit} traspasados exitosamente a ${targetTruck}.`,
      ]);
      setIsTransferring(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#10B981] font-mono selection:bg-[#10B981] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Warehouse */}
        <div className="p-4 bg-black border-2 border-[#10B981] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <Boxes className="w-5 h-5 text-[#10B981]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO LOGÍSTICO: BODEGA CENTRAL & TRAZABILIDAD DE SERIES (SN/MAC)</span>
              <p className="text-[11px] text-slate-400">Administra el inventario principal, insumos de fibra y ejecuta traspasos seguros hacia las camionetas de los técnicos.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#10B981] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            BODEGA CENTRAL: ONLINE
          </span>
        </div>

        {/* Warehouse Asset Valuation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#0B0F1A] border border-[#10B981]/40 rounded hover:border-[#10B981] transition shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="text-slate-400 text-[10px]">// VALORIZACIÓN STOCK EN BODEGA</span>
            <h3 className="text-2xl font-bold text-white mt-1">$45.200.000</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">↑ Stock valorizado auditado</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-cyan-500/40 rounded hover:border-cyan-400 transition shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <span className="text-slate-400 text-[10px]">// ONTs EN BODEGA CENTRAL</span>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">84 UNIDADES</h3>
            <p className="text-[11px] text-cyan-400 mt-0.5">GPON Dual Band Huawei/ZTE</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-amber-500/40 rounded hover:border-amber-400 transition shadow-[0_0_10px_rgba(255,176,0,0.1)]">
            <span className="text-slate-400 text-[10px]">// FIBRA OPTICA EN CARRETES</span>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">14.000m</h3>
            <p className="text-[11px] text-amber-400 mt-0.5">14 Carretes ADSS 12H</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-purple-500/40 rounded hover:border-purple-400 transition shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <span className="text-slate-400 text-[10px]">// EQUIPOS DE MEDICION (OTDR/FUS)</span>
            <h3 className="text-2xl font-bold text-purple-300 mt-1">6 KITS</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">Trazabilidad por N° Serie</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Master Warehouse Inventory Table (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#10B981]" />
                Inventario General de Bodega Central
              </span>
              <span className="text-slate-400">Total: {warehouseStock.length} Insumos</span>
            </div>

            <div className="space-y-3">
              {warehouseStock.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedItem?.id === item.id
                      ? 'bg-[#0E1A17] border-2 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0A0D15] border border-[#10B981]/30 hover:border-[#10B981]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#10B981] border border-[#10B981]/40 rounded font-bold">
                        SKU: {item.sku}
                      </span>
                      <span className="text-slate-400 font-sans">{item.category}</span>
                      {item.serialNumber && (
                        <span className="text-[10px] text-cyan-400 font-mono">[{item.serialNumber}]</span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white font-sans">{item.name}</h4>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-slate-400">// CENTRAL_STOCK</p>
                      <p className="text-sm font-bold text-white">
                        {item.centralStock} {item.unit}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      item.centralStock > item.minThreshold
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {item.centralStock > item.minThreshold ? 'STOCK OK' : 'REABASTECER'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer & Serial Tracking Panel */}
          {selectedItem && (
            <div className="p-5 bg-black border-2 border-[#10B981] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#10B981]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase">// WAREHOUSE_TRANSFER_PANEL</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedItem.name}</h3>
                    <p className="text-xs text-slate-400">SKU: {selectedItem.sku}</p>
                  </div>
                  <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded border border-[#10B981]/40">
                    {selectedItem.centralStock} Disponible
                  </span>
                </div>

                {/* Transfer Controls */}
                <div className="space-y-3 bg-[#0A120F] p-3.5 rounded border border-[#10B981]/30 text-xs">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// SELECCIONAR CAMIONETA DESTINO:</p>

                  <select
                    value={targetTruck}
                    onChange={(e) => setTargetTruck(e.target.value)}
                    className="w-full bg-black border border-[#10B981]/40 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="CREW-01 (Ford Ranger AA-8492)">CREW-01 (Ford Ranger AA-8492)</option>
                    <option value="CREW-02 (Toyota Hilux CC-1042)">CREW-02 (Toyota Hilux CC-1042)</option>
                    <option value="CREW-03 (Chevrolet Colorado DD-9901)">CREW-03 (Chevrolet Colorado DD-9901)</option>
                  </select>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-400">Cantidad a Traspasar:</span>
                    <input
                      type="number"
                      value={transferQuantity}
                      onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max={selectedItem.centralStock}
                      className="w-20 bg-black border border-[#10B981]/40 rounded px-2 py-1 text-xs text-[#10B981] text-center font-bold"
                    />
                  </div>

                  <button
                    onClick={handleTransferToTruck}
                    disabled={isTransferring || selectedItem.centralStock < 1}
                    className="w-full mt-2 py-2.5 px-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                    EJECUTAR TRASPASO A CAMIONETA
                  </button>
                </div>

                {/* Console Log */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#10B981]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#10B981]">
                  {warehouseLogs.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#10B981]/30 pt-2 flex justify-between">
                <span>Bodega: <strong>Central Hub Santiago</strong></span>
                <span className="text-[#10B981]">STATUS: AUDITED</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
