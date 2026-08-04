'use client';

import React, { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Package, 
  Boxes, 
  ArrowRightLeft, 
  CheckCircle2, 
  CornerDownRight, 
  Plus, 
  RefreshCw 
} from 'lucide-react';

interface WarehouseItem {
  id: string;
  sku: string;
  name: string;
  centralStock: number;
  unit: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '// WAREHOUSE_MODULE_INITIALIZED: DEDSEC_CENTRAL_STOCK',
    '// CONNECTED_TO_POSTGRESQL: FETCHING LIVE INVENTORY ITEMS...',
  ]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((item: any) => ({
            id: item.id,
            sku: item.sku || 'SKU-001',
            name: item.name || 'Insumo de Red',
            centralStock: item.stock || item.centralStock || 0,
            unit: item.unit || 'Unidades',
          }));
          setItems(mapped);
          if (mapped.length > 0) setSelectedItem(mapped[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#10B981] font-mono selection:bg-[#10B981] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Bodega Central */}
        <div className="p-4 bg-black border-2 border-[#10B981] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#10B981]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO LOGÍSTICA: BODEGA CENTRAL & TRAZABILIDAD DE SERIES</span>
              <p className="text-[11px] text-slate-400">Control de stock principal y traspaso seguro de insumos hacia vehículos de terreno.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#10B981] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            POSTGRESQL DB CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inventory Items List (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#10B981]" />
                Insumos en Bodega Central (PostgreSQL)
              </span>
              <span className="text-slate-400">Total: {items.length} Insumo(s)</span>
            </div>

            {loading ? (
              <div className="p-8 bg-[#0A0D15] border border-[#10B981]/30 rounded text-center text-xs font-mono text-[#10B981] animate-pulse">
                📡 Consultando catálogo de bodega en PostgreSQL...
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 bg-[#0A0D15] border border-[#10B981]/30 rounded text-center space-y-2">
                <p className="text-sm font-bold text-white font-mono">📭 BODEGA VACÍA</p>
                <p className="text-xs text-slate-400">No hay insumos ni herramientas registradas en la base de datos.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      selectedItem?.id === item.id
                        ? 'bg-[#061B12] border-2 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-[#0A0D15] border border-[#10B981]/30 hover:border-[#10B981]/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-black text-[#10B981] border border-[#10B981]/40 rounded font-bold">
                          {item.sku}
                        </span>
                        <span className="text-slate-400 font-sans">{item.unit}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white font-sans">{item.name}</h4>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-[10px] text-emerald-400">// CENTRAL_STOCK</p>
                        <p className="text-sm text-white font-bold">{item.centralStock} {item.unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Drawer */}
          {selectedItem ? (
            <div className="p-5 bg-black border-2 border-[#10B981] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#10B981]/30 pb-3">
                  <span className="text-[10px] text-emerald-400 uppercase">// ITEM_DETAILS</span>
                  <h3 className="text-base font-bold text-white font-sans">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-400">SKU: {selectedItem.sku}</p>
                </div>

                <div className="bg-[#05140D] p-3 rounded border border-[#10B981]/30 space-y-2 text-xs">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// DISPONIBILIDAD BODEGA</p>
                  <p className="text-sm font-bold text-white font-mono">{selectedItem.centralStock} {selectedItem.unit}</p>
                </div>

                <div className="bg-[#05070A] p-2.5 rounded border border-[#10B981]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#10B981]">
                  {consoleLog.map((log, idx) => (
                    <p key={idx} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#10B981]/30 pt-2 flex justify-between">
                <span>Table: <strong>inventory_items</strong></span>
                <span className="text-[#10B981]">STATUS: READY</span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-black border border-[#10B981]/30 rounded text-center text-xs text-slate-500">
              Selecciona un insumo de la lista.
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
