'use client';

import React, { useState } from 'react';
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
  CornerDownRight
} from 'lucide-react';
import { MockHardwareDriver } from '@/drivers/mocks/mock_hardware_driver';

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
  const driver = new MockHardwareDriver();

  const [subscribers, setSubscribers] = useState<CustomerSubscriber[]>([
    {
      id: '1',
      code: 'SUB-1042',
      name: 'Juan Pérez Residencial',
      taxId: '16.892.412-K',
      phone: '+56 9 8492 1042',
      address: 'Av. Las Condes 10420, Dpto 42',
      planName: 'Fibra Gamer Ultra',
      speed: '940 Mbps / 940 Mbps Simétrico',
      monthlyPrice: 29990,
      status: 'ACTIVO',
      ontSn: 'HWTC-99A821',
      napBox: 'NAP-LAS-CONDES-04 (Puerto 08)',
      signalDbm: -19.4,
      ipAddress: '192.168.10.142',
      pppoeUser: 'juan_perez_ftth',
    },
    {
      id: '2',
      code: 'SUB-1088',
      name: 'Supermercado Central B2B',
      taxId: '76.120.400-3',
      phone: '+56 9 5512 8812',
      address: 'Calle San Martín 512',
      planName: 'Fibra Empresa Dedicada',
      speed: '2000 Mbps / 2000 Mbps',
      monthlyPrice: 120000,
      status: 'MOROSO',
      ontSn: 'ZTEG-88F410',
      napBox: 'NAP-CENTRO-01 (Puerto 02)',
      signalDbm: -26.2,
      ipAddress: '192.168.10.200',
      pppoeUser: 'super_central_b2b',
    },
    {
      id: '3',
      code: 'SUB-1095',
      name: 'María González',
      taxId: '14.210.884-1',
      phone: '+56 9 7712 3341',
      address: 'Pasaje El Roble 88',
      planName: 'Fibra Hogar Conectado',
      speed: '500 Mbps / 500 Mbps',
      monthlyPrice: 19990,
      status: 'ACTIVO',
      ontSn: 'VSOL-44A902',
      napBox: 'NAP-ROBLE-02 (Puerto 05)',
      signalDbm: -20.1,
      ipAddress: '192.168.10.195',
      pppoeUser: 'maria_gonzalez_home',
    },
  ]);

  const [selectedSub, setSelectedSub] = useState<CustomerSubscriber | null>(subscribers[0]);
  const [actionLog, setActionLog] = useState<string[]>([
    '// CRM_MODULE_INITIALIZED: DEDSEC_SUBSCRIBER_DATABASE',
    '// TYPE OR CLICK REMOTE NETWORK ACTIONS TO TEST ONT HARDWARE DRIVERS.',
  ]);
  const [loadingAction, setLoadingAction] = useState(false);

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
              <span className="font-bold text-white uppercase">// MÓDULO BSS: GESTIÓN DE SUSCRIPTORES & CONTROL DE FIBRA</span>
              <p className="text-[11px] text-slate-400">Selecciona un cliente de la lista para probar las mediciones de señal dBm y acciones de corte/reconexión.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#00F0FF] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            DRIVER HARDWARE: READY
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Subscribers Directory Table (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#00F0FF]" />
                Directorio de Suscriptores de Fibra
              </span>
              <span className="text-slate-400">Total: {subscribers.length} Suscriptor(es)</span>
            </div>

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
          </div>

          {/* Customer Telemetry & Actions Drawer */}
          {selectedSub && (
            <div className="p-5 bg-black border-2 border-[#00F0FF] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#00F0FF]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase">// SUBSCRIBER_DETAILS</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedSub.name}</h3>
                    <p className="text-xs text-slate-400">{selectedSub.code} • RUT/RUC: {selectedSub.taxId}</p>
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
                <span>Driver: <strong>MockHardwareDriver</strong></span>
                <span className="text-[#00F0FF]">IP: {selectedSub.ipAddress}</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
