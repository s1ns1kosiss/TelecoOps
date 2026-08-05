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
  CornerDownRight,
  Sliders,
  Play
} from 'lucide-react';

interface OltPonPort {
  portId: number;
  activeOnts: number;
  txPowerDbm: number;
  rxPowerDbm: number;
  status: 'ONLINE' | 'WARNING' | 'ALARM';
  connectedSplitter: string;
}

export default function ConfigurationPage() {
  const [useHardwareMocks, setUseHardwareMocks] = useState(true);
  const [selectedPonPort, setSelectedPonPort] = useState<number>(0);
  const [routerOsInput, setRouterOsInput] = useState('');
  
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '// SESIÓN_CLI_MIKROTIK_ROUTEROS_v7.14_INICIALIZADA',
    '[admin@CCR2116-Core-NOC] > /system/resource/print',
    '--> tiempo-activo: 42d 14h 22m',
    '--> uso-cpu: 8%',
    '--> memoria-libre: 3412MiB / 4096MiB',
    '--> modelo-hardware: CCR2116-12G-4S+',
    '// Escribe un comando o presiona un acceso rápido para ejecutar.',
  ]);

  const ponPortsList: OltPonPort[] = [
    { portId: 0, activeOnts: 64, txPowerDbm: 2.4, rxPowerDbm: -19.4, status: 'ONLINE', connectedSplitter: '1:8 -> 1:8 (Caja NAP 01 a 08)' },
    { portId: 1, activeOnts: 58, txPowerDbm: 2.3, rxPowerDbm: -20.1, status: 'ONLINE', connectedSplitter: '1:8 -> 1:8 (Caja NAP 09 a 16)' },
    { portId: 2, activeOnts: 62, txPowerDbm: 2.5, rxPowerDbm: -18.9, status: 'ONLINE', connectedSplitter: '1:8 -> 1:8 (Caja NAP 17 a 24)' },
    { portId: 3, activeOnts: 48, txPowerDbm: 1.8, rxPowerDbm: -26.8, status: 'WARNING', connectedSplitter: '1:8 -> 1:8 (Atenuación detectada en sector Norte)' },
    { portId: 4, activeOnts: 64, txPowerDbm: 2.4, rxPowerDbm: -19.2, status: 'ONLINE', connectedSplitter: '1:8 -> 1:8 (Caja NAP 25 a 32)' },
    { portId: 5, activeOnts: 51, txPowerDbm: 2.2, rxPowerDbm: -19.8, status: 'ONLINE', connectedSplitter: '1:8 -> 1:8 (Caja NAP 33 a 40)' },
    { portId: 6, activeOnts: 32, txPowerDbm: 2.1, rxPowerDbm: -20.4, status: 'ONLINE', connectedSplitter: '1:8 -> 1:8 (Caja NAP 41 a 48)' },
    { portId: 7, activeOnts: 0, txPowerDbm: 0.0, rxPowerDbm: 0.0, status: 'ALARM', connectedSplitter: 'Puerto libre reservado para expansión' },
  ];

  const handleCommandExecute = (cmdToRun?: string) => {
    const cmd = (cmdToRun || routerOsInput).trim();
    if (!cmd) return;

    const newLogs = [...terminalLogs, `[admin@CCR2116-Core-NOC] > ${cmd}`];

    if (cmd.includes('/ppp/active')) {
      newLogs.push(
        'Banderas: R - RADIUS, D - DYNAMIC',
        '0 R usuario="juan_perez" servicio=pppoe direccion=192.168.10.142 tiempo_conexion=4d12h',
        '1 R usuario="super_central" servicio=pppoe direccion=192.168.10.200 tiempo_conexion=1d08h',
        '2 R usuario="empresa_norte" servicio=pppoe direccion=192.168.10.205 tiempo_conexion=12d04h'
      );
    } else if (cmd.includes('/interface')) {
      newLogs.push(
        'Banderas: X - DESHABILITADO, R - EN_EJECUCION',
        '0 R nombre="sfp-sfpplus1" mtu=1500 mac=64:D1:54:88:12:01 velocidad=10Gbps tx=2.4Gbps rx=1.2Gbps',
        '1 R nombre="ether1-lan" mtu=1500 mac=64:D1:54:88:12:02 velocidad=1Gbps tx=450Mbps rx=180Mbps'
      );
    } else if (cmd.includes('/ping')) {
      newLogs.push(
        'SECUENCIA HOST TAMAÑO TTL TIEMPO ESTADO',
        '0 8.8.8.8 56 118 1.4ms [OK]',
        '1 8.8.8.8 56 118 1.2ms [OK]',
        '2 8.8.8.8 56 118 1.5ms [OK]',
        'enviados=3 recibidos=3 perdida_paquetes=0% latencia_promedio=1.3ms'
      );
    } else if (cmd.includes('/system/resource')) {
      newLogs.push(
        '--> uso-cpu: 8%',
        '--> uso-memoria: 18%',
        '--> temperatura-placa: 38°C',
        '--> arquitectura: tile',
        '--> version-routeros: 7.14.2 (Stable)'
      );
    } else if (cmd.includes('/ip/firewall')) {
      newLogs.push(
        '0 D regla="ANTI-DDOS-RATE-LIMIT" accion=drop puerto=8728 paquetes_bloqueados=142',
        '1 D regla="ACCEPT-META-WHATSAPP-IPS" accion=accept puerto=443 paquetes_permitidos=8942'
      );
    } else {
      newLogs.push(`comando ejecutado: ${cmd} [OK]`);
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
              <p className="text-[11px] text-slate-400">Inspección de chasis OLT Huawei SmartAX y consola interactiva RouterOS v7 de MikroTik.</p>
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
              {useHardwareMocks ? '🛡️ MODO MOCK (AISLADO)' : '⚡ HARDWARE REAL (PROD)'}
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
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono font-bold">
                IP: 10.0.1.10 (Placa GPON 0/1)
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Selecciona un puerto GPON PON para inspeccionar parámetros ópticos y ONTs activas:
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
                    <span className="text-red-400 font-bold">TX: +{pon.txPowerDbm} dBm</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected PON Port Details Panel */}
            <div className="p-3.5 bg-[#0D080A] rounded border border-[#EF4444]/30 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-bold">// PARÁMETROS PUERTO PON {selectedPonPort}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  ponPortsList[selectedPonPort].status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  ESTADO: {ponPortsList[selectedPonPort].status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-white font-mono text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-500 block">ONTs Conectadas:</span>
                  <strong>{ponPortsList[selectedPonPort].activeOnts} / 64</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Potencia Transmisión (TX):</span>
                  <strong className="text-[#00FF66]">+{ponPortsList[selectedPonPort].txPowerDbm} dBm</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Potencia Recepción (RX):</span>
                  <strong className="text-cyan-300">{ponPortsList[selectedPonPort].rxPowerDbm} dBm</strong>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <span>Topología de Splitters: </span>
                <strong className="text-white">{ponPortsList[selectedPonPort].connectedSplitter}</strong>
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
                  PUERTO API 8728
                </span>
              </div>

              {/* Quick Click Command Shortcuts */}
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">// COMANDOS DE ACCESO RÁPIDO:</p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <button
                    onClick={() => handleCommandExecute('/ppp/active/print')}
                    className="px-2 py-1 bg-[#1A0B0D] hover:bg-[#2A1014] border border-[#EF4444]/40 text-[#EF4444] rounded font-mono"
                  >
                    /ppp/active/print
                  </button>
                  <button
                    onClick={() => handleCommandExecute('/interface/print')}
                    className="px-2 py-1 bg-[#1A0B0D] hover:bg-[#2A1014] border border-[#EF4444]/40 text-[#EF4444] rounded font-mono"
                  >
                    /interface/print
                  </button>
                  <button
                    onClick={() => handleCommandExecute('/system/resource/print')}
                    className="px-2 py-1 bg-[#1A0B0D] hover:bg-[#2A1014] border border-[#EF4444]/40 text-[#EF4444] rounded font-mono"
                  >
                    /system/resource/print
                  </button>
                  <button
                    onClick={() => handleCommandExecute('/ping 8.8.8.8')}
                    className="px-2 py-1 bg-[#1A0B0D] hover:bg-[#2A1014] border border-[#EF4444]/40 text-[#EF4444] rounded font-mono"
                  >
                    /ping 8.8.8.8
                  </button>
                </div>
              </div>

              {/* Console Output */}
              <div className="bg-[#05070A] p-3 rounded border border-[#EF4444]/30 h-52 overflow-y-auto font-mono text-[11px] text-[#EF4444] space-y-1">
                {terminalLogs.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>

              {/* Terminal Command Input */}
              <form onSubmit={(e) => { e.preventDefault(); handleCommandExecute(); }} className="flex gap-2">
                <span className="text-white font-bold text-xs py-1.5 whitespace-nowrap">[admin@MikroTik] &gt;</span>
                <input
                  type="text"
                  value={routerOsInput}
                  onChange={(e) => setRouterOsInput(e.target.value)}
                  placeholder="Escribe un comando RouterOS..."
                  className="flex-1 bg-black border border-[#EF4444]/40 rounded px-3 py-1.5 text-xs text-[#EF4444] focus:outline-none focus:border-[#EF4444] font-mono"
                />
              </form>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#EF4444]/30 pt-2 flex justify-between">
              <span>IP Core: <strong>10.0.0.1 (RouterOS v7)</strong></span>
              <span className="text-[#EF4444]">USO CPU: 8%</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
