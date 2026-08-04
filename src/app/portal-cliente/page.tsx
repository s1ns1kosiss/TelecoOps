'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  UserCheck, 
  Wifi, 
  KeyRound, 
  CreditCard, 
  Gauge, 
  CheckCircle2, 
  Terminal, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  CornerDownRight,
  Zap,
  Globe
} from 'lucide-react';

export default function CustomerPortalPage() {
  const [wifiSsid, setWifiSsid] = useState('JuanPerez_Fibra_5G');
  const [wifiPassword, setWifiPassword] = useState('SpeedGamer2026');
  const [isUpdatingWifi, setIsUpdatingWifi] = useState(false);

  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [speedResult, setSpeedResult] = useState<{ ping: number; download: number; upload: number } | null>({
    ping: 2,
    download: 942,
    upload: 938,
  });

  const [portalLogs, setPortalLogs] = useState<string[]>([
    '// CLIENT_PORTAL_INITIALIZED: DEDSEC_SELF_SERVICE',
    '// ONT_REMOTE_MANAGEMENT: CONNECTED TO HOME ROUTER HWTC-99A821...',
  ]);

  const handleUpdateWifi = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingWifi(true);
    setPortalLogs((prev) => [
      ...prev,
      `📶 // UPDATING_ONT_WIFI_CONFIG: SSID="${wifiSsid}"...`,
      '⚡ // TR069_COMMAND_SENT: Pushing new WPA2 key to ONT...',
    ]);

    setTimeout(() => {
      setPortalLogs((prev) => [
        ...prev,
        `✔ // WIFI_UPDATED_SUCCESSFULLY: Red "${wifiSsid}" activa en ambas bandas 2.4GHz & 5GHz.`,
      ]);
      setIsUpdatingWifi(false);
    }, 1500);
  };

  const handleRunSpeedtest = () => {
    setSpeedTestRunning(true);
    setPortalLogs((prev) => [
      ...prev,
      '🚀 // INITIATING_SPEEDTEST: Testing ping to Central Node...',
    ]);

    setTimeout(() => {
      const ping = Math.floor(Math.random() * 2) + 2;
      const dl = Math.floor(Math.random() * 20) + 930;
      const ul = Math.floor(Math.random() * 20) + 925;

      setSpeedResult({ ping, download: dl, upload: ul });
      setPortalLogs((prev) => [
        ...prev,
        `🎯 // SPEEDTEST_COMPLETE: Latencia=${ping}ms | Bajada=${dl}Mbps | Subida=${ul}Mbps [940M PLAN VALIDATED]`,
      ]);
      setSpeedTestRunning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#3B82F6] font-mono selection:bg-[#3B82F6] selection:text-white">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Portal Suscriptor */}
        <div className="p-4 bg-black border-2 border-[#3B82F6] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-[#3B82F6]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO AUTO-SERVICIO: PORTAL DE MI CUENTA SUSCRIPTOR</span>
              <p className="text-[11px] text-slate-400">El cliente final puede cambiar su clave Wi-Fi, revisar su señal de fibra y realizar test de velocidad en tiempo real.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#3B82F6] text-white px-2.5 py-0.5 rounded font-bold uppercase">
            ESTADO CONEXIÓN: ACTIVO
          </span>
        </div>

        {/* Customer Profile & Plan Overview */}
        <div className="p-5 bg-black border border-[#3B82F6]/40 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">// BIENVENIDO DE VUELTA</span>
            <h2 className="text-lg font-bold text-white font-sans">Juan Pérez Residencial</h2>
            <p className="text-slate-400">RUT: 16.892.412-K • Dirección: Av. Las Condes 10420, Dpto 42</p>
          </div>

          <div className="flex items-center gap-3 bg-[#0B101D] p-3 rounded border border-[#3B82F6]/30">
            <Wifi className="w-6 h-6 text-[#3B82F6]" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">// PLAN CONTRATADO</p>
              <p className="text-sm font-bold text-white">Fibra Gamer Ultra 940M</p>
              <p className="text-[11px] text-[#00FF66]">940 Mbps Simétrico (ONT HWTC-99A821)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Wi-Fi & Speedtest Controls (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Wi-Fi Credentials Management Card */}
            <div className="p-5 bg-[#090D18] border border-[#3B82F6]/40 rounded space-y-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase border-b border-slate-800 pb-2">
                <KeyRound className="w-4 h-4 text-[#3B82F6]" />
                // ADMINISTRAR MI RED WI-FI (CAMBIO DE CLAVE EN VIVO)
              </div>

              <form onSubmit={handleUpdateWifi} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Nombre de Red Wi-Fi (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full bg-black border border-[#3B82F6]/40 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Clave de Seguridad (WPA2/WPA3):</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full bg-black border border-[#3B82F6]/40 rounded px-3 py-2 text-[#00FF66] font-mono text-xs focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingWifi}
                    className="w-full py-2.5 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isUpdatingWifi ? 'animate-spin' : ''}`} />
                    GUARDAR NUEVA CLAVE WI-FI EN MÓDEM
                  </button>
                </div>
              </form>
            </div>

            {/* Integrated Speedtest Widget Card */}
            <div className="p-5 bg-[#090D18] border border-[#3B82F6]/40 rounded space-y-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
                  <Gauge className="w-4 h-4 text-[#3B82F6]" />
                  // TEST DE VELOCIDAD DE FIBRA EN TIEMPO REAL
                </div>

                <button
                  onClick={handleRunSpeedtest}
                  disabled={speedTestRunning}
                  className="bg-black border border-[#3B82F6] hover:bg-[#3B82F6]/20 text-[#3B82F6] font-bold px-3 py-1 rounded text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 ${speedTestRunning ? 'animate-spin' : ''}`} />
                  PROBAR VELOCIDAD
                </button>
              </div>

              {speedResult && (
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 bg-black border border-slate-800 rounded">
                    <span className="text-slate-500 text-[10px] block">LATENCIA</span>
                    <strong className="text-2xl text-white font-bold">{speedResult.ping} ms</strong>
                  </div>

                  <div className="p-3 bg-black border border-slate-800 rounded">
                    <span className="text-slate-500 text-[10px] block">DESCARGA</span>
                    <strong className="text-2xl text-[#00FF66] font-bold">{speedResult.download} Mbps</strong>
                  </div>

                  <div className="p-3 bg-black border border-slate-800 rounded">
                    <span className="text-slate-500 text-[10px] block">SUBIDA</span>
                    <strong className="text-2xl text-[#00F0FF] font-bold">{speedResult.upload} Mbps</strong>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Account Status & Portal Console */}
          <div className="p-5 bg-black border-2 border-[#3B82F6] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <div className="space-y-4">
              <div className="border-b border-[#3B82F6]/30 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase">// ACCOUNT_STATUS</span>
                  <h3 className="text-base font-bold text-white font-sans">Estado de Cuota Mensual</h3>
                </div>
                <span className="text-xs font-bold text-[#00FF66] bg-[#00FF66]/10 px-2.5 py-1 rounded border border-[#00FF66]/40">
                  AL DÍA
                </span>
              </div>

              {/* Monthly Invoice Summary */}
              <div className="bg-[#0B101D] p-3 rounded border border-[#3B82F6]/30 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Próximo Vencimiento:</span>
                  <strong className="text-white">05/08/2026</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total a Pagar:</span>
                  <strong className="text-[#3B82F6] text-sm">$29.990 CLP</strong>
                </div>

                <button
                  className="w-full mt-2 py-2 px-3 bg-[#00E676] hover:bg-[#00C564] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  PAGAR BOLETA ONLINE
                </button>
              </div>

              {/* Console Output */}
              <div className="bg-[#05070A] p-2.5 rounded border border-[#3B82F6]/30 h-32 overflow-y-auto text-[10px] space-y-1 font-mono text-[#3B82F6]">
                {portalLogs.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#3B82F6]/30 pt-2 flex justify-between">
              <span>Portal: <strong>Self-Service TR-069</strong></span>
              <span className="text-[#3B82F6]">SIGNAL: -19.4 dBm [STABLE]</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
