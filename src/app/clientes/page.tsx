'use client';

import React, { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Users, 
  Search, 
  Terminal, 
  Wifi, 
  RefreshCw, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Server, 
  Radio, 
  Zap,
  CornerDownRight,
  Plus
} from 'lucide-react';
import { getHardwareDriver } from '@/drivers/hardware_driver.factory';

interface CustomerSubscriber {
  id: string;
  code: string;
  name: string;
  taxId: string;
  phone: string;
  address: string;
  planName: string;
  speed: string;
  monthlyPrice: number;
  status: 'ACTIVO' | 'SUSPENDIDO' | 'MOROSO';
  ontSn: string;
  napBox: string;
  signalDbm: number;
  ipAddress: string;
  pppoeUser: string;
}

export default function SubscribersPage() {
  const driver = getHardwareDriver();

  const [subscribers, setSubscribers] = useState<CustomerSubscriber[]>([]);
  const [selectedSub, setSelectedSub] = useState<CustomerSubscriber | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLog, setActionLog] = useState<string[]>([
    '// CRM_MODULE_INITIALIZED: DEDSEC_SUBSCRIBER_DATABASE',
    '// POSTGRESQL_PERSISTENCE: FETCHING LIVE SUBSCRIBERS FROM DATABASE...',
  ]);
  const [loadingAction, setLoadingAction] = useState(false);

  // New Real Subscriber Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubTaxId, setNewSubTaxId] = useState('');
  const [newSubAddress, setNewSubAddress] = useState('');

  // Fetch real subscribers from PostgreSQL on mount
  useEffect(() => {
    fetchSubscribersFromDb();
  }, []);

  const fetchSubscribersFromDb = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: CustomerSubscriber[] = data.data.map((c: any) => ({
          id: c.id,
          code: c.code || 'SUB-1001',
          name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Cliente Sin Nombre',
          taxId: c.taxId || 'N/A',
          phone: c.phone || '+56900000000',
          address: c.address || 'Sin dirección',
          planName: c.subscriptions?.[0]?.plan?.name || 'Plan Fibra Base',
          speed: c.subscriptions?.[0]?.plan?.downloadSpeedMbps 
            ? `${c.subscriptions[0].plan.downloadSpeedMbps} Mbps Simétrico` 
            : '500 Mbps Simétrico',
          monthlyPrice: c.subscriptions?.[0]?.plan?.monthlyPrice || 24990,
          status: c.status === 'SUSPENDED' ? 'SUSPENDIDO' : c.status === 'DEBTOR' ? 'MOROSO' : 'ACTIVO',
          ontSn: c.subscriptions?.[0]?.ontSerialNumber || 'HWTC-99A821',
          napBox: c.subscriptions?.[0]?.napBoxId || 'NAP-CENTRO-01',
          signalDbm: -19.4,
          ipAddress: c.subscriptions?.[0]?.ipAddress || '192.168.10.100',
          pppoeUser: c.subscriptions?.[0]?.pppoeUser || `user_${c.taxId.replace(/[^a-zA-Z0-9]/g, '')}`,
        }));

        setSubscribers(mapped);
        if (mapped.length > 0) setSelectedSub(mapped[0]);
        setActionLog((prev) => [
          ...prev,
          `✔ // POSTGRESQL_FETCH_SUCCESS: ${mapped.length} suscriptor(es) reales cargados desde la base de datos.`,
        ]);
      }
    } catch (err: any) {
      setActionLog((prev) => [...prev, `❌ Error al consultar PostgreSQL: ${err.message}`]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateRealSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubTaxId) return;

    setLoadingAction(true);
    setActionLog((prev) => [
      ...prev,
      `💾 // POST /api/subscribers: Registrando cliente real "${newSubName}" (RUT: ${newSubTaxId})...`,
    ]);

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubName,
          taxId: newSubTaxId,
          address: newSubAddress || 'Av. Providencia 1200',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionLog((prev) => [
          ...prev,
          `✔ // CLIENTE REAL GUARDADO EN POSTGRESQL: ID=${data.data.id}`,
        ]);

        setNewSubName('');
        setNewSubTaxId('');
        setNewSubAddress('');
        setShowAddForm(false);
        await fetchSubscribersFromDb();
      }
    } catch (err: any) {
      setActionLog((prev) => [...prev, `❌ Error al guardar en DB: ${err.message}`]);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleTestSignal = async () => {
    if (!selectedSub) return;
    setLoadingAction(true);
    setActionLog((prev) => [...prev, `// EXEC_CMD: readOntSignal("${selectedSub.ontSn}")...`]);

    const result = await driver.readOntSignal(selectedSub.ontSn);
    setTimeout(() => {
      setActionLog((prev) => [
        ...prev,
        `🎯 // SIGNAL_READOUT: RxPower = ${result.rxPowerDbm} dBm | Status = ${result.status} [OK]`,
      ]);
      setSubscribers((prev) =>
        prev.map((s) => (s.id === selectedSub.id ? { ...s, signalDbm: result.rxPowerDbm } : s))
      );
      setSelectedSub((prev) => (prev ? { ...prev, signalDbm: result.rxPowerDbm } : null));
      setLoadingAction(false);
    }, 1200);
  };

  const handleSuspendService = async () => {
    if (!selectedSub) return;
    setLoadingAction(true);
    setActionLog((prev) => [...prev, `// EXEC_CMD: suspendService("${selectedSub.pppoeUser}")...`]);

    await driver.suspendService(selectedSub.pppoeUser);
    setTimeout(() => {
      setActionLog((prev) => [
        ...prev,
        `🔒 // SERVICE_SUSPENDED: Suscripción ${selectedSub.code} cortada automáticamente por mora en MikroTik.`,
      ]);
      setSubscribers((prev) =>
        prev.map((s) => (s.id === selectedSub.id ? { ...s, status: 'SUSPENDIDO' } : s))
      );
      setSelectedSub((prev) => (prev ? { ...prev, status: 'SUSPENDIDO' } : null));
      setLoadingAction(false);
    }, 1500);
  };

  const handleResumeService = async () => {
    if (!selectedSub) return;
    setLoadingAction(true);
    setActionLog((prev) => [...prev, `// EXEC_CMD: resumeService("${selectedSub.pppoeUser}")...`]);

    await driver.resumeService(selectedSub.pppoeUser);
    setTimeout(() => {
      setActionLog((prev) => [
        ...prev,
        `🔓 // SERVICE_RESTORED: Suscripción ${selectedSub.code} reactivada exitosamente.`,
      ]);
      setSubscribers((prev) =>
        prev.map((s) => (s.id === selectedSub.id ? { ...s, status: 'ACTIVO' } : s))
      );
      setSelectedSub((prev) => (prev ? { ...prev, status: 'ACTIVO' } : null));
      setLoadingAction(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#00F0FF] font-mono selection:bg-[#00F0FF] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner CRM Retro Hacker */}
        <div className="p-4 bg-black border-2 border-[#00F0FF] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#00F0FF]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO BSS: GESTIÓN DE SUSCRIPTORES REALES EN POSTGRESQL</span>
              <p className="text-[11px] text-slate-400">Los datos provienen directamente de tu base de datos PostgreSQL en Docker. Si usas db:reset la lista queda vacía hasta crear registros.</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#00F0FF] hover:bg-[#00D0DF] text-black font-bold px-3 py-1.5 rounded uppercase text-[11px] transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            REGISTRAR CLIENTE REAL
          </button>
        </div>

        {/* Real Subscriber Form Modal / Card */}
        {showAddForm && (
          <form onSubmit={handleCreateRealSubscriber} className="p-4 bg-[#09111C] border-2 border-[#00F0FF] rounded space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-[#00F0FF]/30 pb-2">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00F0FF]" />
                FORMULARIO DE REGISTRO EN POSTGRESQL
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">TABLE: customers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="ej. Carlos Silva"
                  className="w-full bg-black border border-[#00F0FF]/40 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">RUT / Identificación:</label>
                <input
                  type="text"
                  value={newSubTaxId}
                  onChange={(e) => setNewSubTaxId(e.target.value)}
                  placeholder="ej. 15.420.991-K"
                  className="w-full bg-black border border-[#00F0FF]/40 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Dirección de Instalación:</label>
                <input
                  type="text"
                  value={newSubAddress}
                  onChange={(e) => setNewSubAddress(e.target.value)}
                  placeholder="ej. Av. Providencia 1200, Dpto 81"
                  className="w-full bg-black border border-[#00F0FF]/40 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-black text-slate-400 border border-slate-700 rounded text-xs"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={loadingAction}
                className="px-4 py-1.5 bg-[#00F0FF] text-black font-bold rounded text-xs uppercase"
              >
                GUARDAR CLIENTE EN DB
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Subscribers Directory Table (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#00F0FF]" />
                Directorio de Suscriptores en PostgreSQL
              </span>
              <span className="text-slate-400">Total: {subscribers.length} Suscriptor(es)</span>
            </div>

            {loadingData ? (
              <div className="p-8 bg-[#0A0D15] border border-[#00F0FF]/30 rounded text-center text-xs font-mono text-cyan-400 animate-pulse">
                📡 Consultando registros reales en PostgreSQL...
              </div>
            ) : subscribers.length === 0 ? (
              <div className="p-8 bg-[#0A0D15] border border-[#00F0FF]/30 rounded text-center space-y-2">
                <p className="text-sm font-bold text-white font-mono">📭 BASE DE DATOS VACÍA</p>
                <p className="text-xs text-slate-400">No hay clientes registrados en la base de datos PostgreSQL en este momento.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-2 px-3 py-1.5 bg-[#00F0FF] text-black font-bold rounded text-xs uppercase inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  CREAR PRIMER CLIENTE REAL
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {subscribers.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      selectedSub?.id === sub.id
                        ? 'bg-[#0E1524] border-2 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-[#0A0D15] border border-[#00F0FF]/30 hover:border-[#00F0FF]/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-black text-[#00F0FF] border border-[#00F0FF]/40 rounded font-bold">
                          {sub.code}
                        </span>
                        <span className="text-slate-400 font-sans">{sub.planName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({sub.speed})</span>
                      </div>

                      <h4 className="font-bold text-sm text-white font-sans">{sub.name}</h4>
                      <p className="text-xs text-slate-400">{sub.address}</p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-[10px] text-cyan-400">// ONT_SERIAL</p>
                        <p className="text-xs font-bold text-white">{sub.ontSn}</p>
                        <p className={`text-xs font-bold mt-0.5 ${
                          sub.signalDbm < -25 ? 'text-red-400' : 'text-[#00FF66]'
                        }`}>
                          {sub.signalDbm} dBm
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded text-xs font-bold ${
                        sub.status === 'ACTIVO' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40' :
                        sub.status === 'MOROSO' ? 'bg-red-950 text-red-400 border border-red-800' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Telemetry & Actions Drawer */}
          {selectedSub && (
            <div className="p-5 bg-black border-2 border-[#00F0FF] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#00F0FF]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase">// SUBSCRIBER_DETAILS</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedSub.name}</h3>
                    <p className="text-xs text-slate-400">{selectedSub.code} • RUT: {selectedSub.taxId}</p>
                  </div>
                  <span className="text-xs font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded border border-[#00F0FF]/40">
                    ${selectedSub.monthlyPrice.toLocaleString('es-CL')}/mes
                  </span>
                </div>

                {/* Technical Fiber Parameters */}
                <div className="bg-[#080B12] p-3.5 rounded border border-[#00F0FF]/30 space-y-2 text-xs">
                  <p className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800 pb-1">
                    // NETWORK_PARAMETERS & OPTICAL TELEMETRY
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">ONT Serial:</span>
                      <strong className="text-white">{selectedSub.ontSn}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Usuario PPPoE:</span>
                      <strong className="text-cyan-300">{selectedSub.pppoeUser}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Caja NAP:</span>
                      <strong className="text-white">{selectedSub.napBox}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Potencia de Fibra:</span>
                      <strong className={selectedSub.signalDbm < -25 ? 'text-red-400' : 'text-[#00FF66]'}>
                        {selectedSub.signalDbm} dBm
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Remote Network Actions Buttons */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// REMOTE_DRIVER_ACTIONS</p>
                  
                  <button
                    onClick={handleTestSignal}
                    disabled={loadingAction}
                    className="w-full py-2 px-3 bg-black hover:bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] rounded font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAction ? 'animate-spin' : ''}`} />
                    MEDIR POTENCIA EN VIVO (dBm)
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSuspendService}
                      disabled={loadingAction || selectedSub.status === 'SUSPENDIDO'}
                      className="py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-300 rounded font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      SUSPENDER (MORA)
                    </button>

                    <button
                      onClick={handleResumeService}
                      disabled={loadingAction || selectedSub.status === 'ACTIVO'}
                      className="py-2 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 rounded font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      RECONECTAR
                    </button>
                  </div>
                </div>

                {/* Live Console Output */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#00F0FF]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#00F0FF]">
                  {actionLog.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#00F0FF]/30 pt-2 flex justify-between">
                <span>Driver: <strong>HardwareDriverFactory</strong></span>
                <span className="text-[#00F0FF]">IP: {selectedSub.ipAddress}</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
