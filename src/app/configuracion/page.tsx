'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Settings, 
  Server, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Terminal, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Cpu, 
  HardDrive,
  CornerDownRight
} from 'lucide-react';

interface OltPonPort {
  portId: number;
  activeOnts: number;
  txPowerDbm: number;
  status: 'ONLINE' | 'WARNING' | 'ALARM';
}

export default function ConfigurationPage() {
  const [useHardwareMocks, setUseHardwareMocks] = useState(true);
  const [selectedPonPort, setSelectedPonPort] = useState<number>(0);
  const [routerOsInput, setRouterOsInput] = useState('');
  
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '// MIKROTIK_ROUTEROS_v7.14_CLI_SESSION_OPENED',
    '[admin@CCR2116-Core-NOC] > /system/resource/print',
    '--> uptime: 42d 14h 22m',
    '--> cpu-load: 8%',
    '--> free-memory: 3412MiB / 4096MiB',
    '--> board-name: CCR2116-12G-4S+',
  ]);

  const ponPortsList: OltPonPort[] = [
    { portId: 0, activeOnts: 64, txPowerDbm: 2.4, status: 'ONLINE' },
    { portId: 1, activeOnts: 58, txPowerDbm: 2.3, status: 'ONLINE' },
    { portId: 2, activeOnts: 62, txPowerDbm: 2.5, status: 'ONLINE' },
    { portId: 3, activeOnts: 48, txPowerDbm: 1.8, status: 'WARNING' },
    { portId: 4, activeOnts: 64, txPowerDbm: 2.4, status: 'ONLINE' },
    { portId: 5, activeOnts: 51, txPowerDbm: 2.2, status: 'ONLINE' },
    { portId: 6, activeOnts: 32, txPowerDbm: 2.1, status: 'ONLINE' },
    { portId: 7, activeOnts: 0, txPowerDbm: 0.0, status: 'ALARM' },
  ];

  const handleCommandExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routerOsInput.trim()) return;

    const cmd = routerOsInput.trim();
    const newLogs = [...terminalLogs, `[admin@CCR2116-Core-NOC] > ${cmd}`];

    if (cmd.includes('/ppp/active')) {
      newLogs.push('Flags: R - RADIUS, D - DYNAMIC', '0 R name="juan_perez" service=pppoe address=192.168.10.142 uptime=4d12h');
    } else if (cmd.includes('/interface')) {
      newLogs.push('Flags: X - DISABLED, R - RUNNING', '0 R name="sfp-sfpplus1" mtu=1500 mac-address=64:D1:54:88:12:01');
    } else if (cmd.includes('/ping')) {
      newLogs.push('SEQ HOST SIZE TTL TIME STATUS', '0 8.8.8.8 56 118 1.4ms', '1 8.8.8.8 56 118 1.2ms', 'sent=2 received=2 packet-loss=0%');
    } else {
      newLogs.push(`command executed: ${cmd} [OK]`);
    }

    setTerminalLogs(newLogs);
    setRouterOsInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#EF4444] font-mono selection:bg-[#EF4444] selection:text-white">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Safety Switch */}
        <div className="p-4 bg-black border-2 border-[#EF4444] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#EF4444]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO 11: CONFIGURACIÓN DE RED & HARDWARE SAFETY ENGINE</span>
              <p className="text-[11px] text-slate-400">Control de aislamiento de hardware y consola interactiva de RouterOS MikroTik & OLT Huawei.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-bold">ESTADO DEL MOTOR:</span>
            <button
              onClick={() => setUseHardwareMocks(!useHardwareMocks)}
              className={`px-3 py-1.5 rounded font-bold uppercase text-xs flex items-center gap-2 transition ${
                useHardwareMocks 
                  ? 'bg-[#00FF66] text-black shadow-[0_0_10px_rgba(0,255,102,0.4)]' 
                  : 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
              }`}
            >
              <Zap className="w-4 h-4" />
              {useHardwareMocks ? '🛡️ MODO MOCK (ISOLATED)' : '⚡ HARDWARE REAL (PROD)'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Visual Panel OLT Huawei SmartAX Chassis */}
          <div className="p-5 bg-black border-2 border-[#EF4444] rounded space-y-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <div className="flex justify-between items-center border-b border-[#EF4444]/30 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#EF4444]" />
                <h3 className="font-bold text-white text-sm font-sans">Chasis OLT Huawei SmartAX MA5608T</h3>
              </div>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono">
                IP: 10.0.1.10 (GPON Board 0/1)
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Selecciona un puerto GPON PON para inspeccionar métricas ópticas en tiempo real:
            </p>

            {/* 8 PON Ports Graphical Grid */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {ponPortsList.map((pon) => (
                <button
                  key={pon.portId}
                  onClick={() => setSelectedPonPort(pon.portId)}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition ${
                    selectedPonPort === pon.portId
                      ? 'bg-[#1F0909] border-2 border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                      : 'bg-[#0A0D15] border-slate-800 hover:border-red-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">PON {pon.portId}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      pon.status === 'ONLINE' ? 'bg-[#00FF66] shadow-[0_0_6px_#00FF66]' :
                      pon.status === 'WARNING' ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' :
                      'bg-red-600 shadow-[0_0_6px_#ef4444]'
                    }`} />
                  </div>

                  <div className="mt-2 text-[10px]">
                    <span className="text-slate-400 block">ONTs: {pon.activeOnts}/64</span>
                    <span className="text-red-400 font-bold">{pon.txPowerDbm} dBm</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected PON Port Details */}
            <div className="p-3 bg-[#0D080A] rounded border border-[#EF4444]/30 space-y-2 text-xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold">// METRICAS PUERTO PON {selectedPonPort}</p>
              <div className="grid grid-cols-3 gap-2 text-white font-mono text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-500 block">ONTs Activas:</span>
                  <strong>{ponPortsList[selectedPonPort].activeOnts} / 64</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Potencia TX OLT:</span>
                  <strong className="text-[#00FF66]">+{ponPortsList[selectedPonPort].txPowerDbm} dBm</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Estado Slot:</span>
                  <strong className="text-red-400">{ponPortsList[selectedPonPort].status}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive MikroTik RouterOS Console CLI */}
          <div className="p-5 bg-black border-2 border-[#EF4444] rounded flex flex-col justify-between space-y-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EF4444]/30 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#EF4444]" />
                  <h3 className="font-bold text-white text-sm font-sans">MikroTik RouterOS v7.14 CLI (CCR2116)</h3>
                </div>
                <span className="text-[10px] bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 px-2 py-0.5 rounded font-mono font-bold">
                  API PORT 8728
                </span>
              </div>

              {/* Console Output */}
              <div className="bg-[#05070A] p-3 rounded border border-[#EF4444]/30 h-64 overflow-y-auto font-mono text-[11px] text-[#EF4444] space-y-1">
                {terminalLogs.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>

              {/* Terminal Command Input */}
              <form onSubmit={handleCommandExecute} className="flex gap-2">
                <span className="text-white font-bold text-xs py-1.5 whitespace-nowrap">[admin@MikroTik] &gt;</span>
                <input
                  type="text"
                  value={routerOsInput}
                  onChange={(e) => setRouterOsInput(e.target.value)}
                  placeholder="ej. /ppp/active/print, /interface/print, /ping 8.8.8.8"
                  className="flex-1 bg-black border border-[#EF4444]/40 rounded px-3 py-1.5 text-xs text-[#EF4444] focus:outline-none focus:border-[#EF4444] font-mono"
                />
              </form>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#EF4444]/30 pt-2 flex justify-between">
              <span>Core IP: <strong>10.0.0.1 (RouterOS)</strong></span>
              <span className="text-[#EF4444]">CPU LOAD: 8%</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
