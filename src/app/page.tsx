'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Radio, 
  Wrench, 
  Wifi, 
  Users, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Search, 
  Activity,
  Terminal,
  Cpu,
  Smartphone,
  Binary,
  Globe,
  CornerDownRight,
  TrendingUp,
  Server,
  Play
} from 'lucide-react';

interface MockTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  address: string;
  category: 'INSTALACION' | 'REPARACION' | 'FALLA_MASIVA';
  priority: 'ALTA' | 'MEDIA' | 'CRITICA';
  technician: string;
  status: 'ABIERTO' | 'EN_CURSO' | 'RESUELTO';
  timeAgo: string;
  signalDbm?: number;
  nodeCode?: string;
}

export default function TelecomDashboard() {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '// CTOS_2.0_RETRO_HACKER_OS initialized.',
    '// NETWORK_INFRASTRUCTURE: DEDSEC_TELECOM_NODE_01',
    '// TYPE "help" OR CLICK BUTTONS TO EXECUTE OPERATIONAL COMMANDS.',
  ]);

  const [tickets, setTickets] = useState<MockTicket[]>([
    {
      id: '1',
      ticketNumber: 'WD2-8492',
      customerName: 'Juan Pérez - Residencial',
      address: 'Av. Las Condes 10420, Dpto 42',
      category: 'INSTALACION',
      priority: 'MEDIA',
      technician: 'Cuadrilla DedSec 2 (Carlos M.)',
      status: 'EN_CURSO',
      timeAgo: 'Hace 25 min',
      signalDbm: -19.4,
      nodeCode: 'NAP_SF_01',
    },
    {
      id: '2',
      ticketNumber: 'WD2-8493',
      customerName: 'Supermercado Central',
      address: 'Calle San Martín 512',
      category: 'FALLA_MASIVA',
      priority: 'CRITICA',
      technician: 'Sin Asignar',
      status: 'ABIERTO',
      timeAgo: 'Hace 5 min',
      nodeCode: 'NAP_CTOS_MAIN',
    },
    {
      id: '3',
      ticketNumber: 'WD2-8488',
      customerName: 'María González',
      address: 'Pasaje El Roble 88',
      category: 'REPARACION',
      priority: 'ALTA',
      technician: 'Cuadrilla DedSec 1 (Esteban R.)',
      status: 'RESUELTO',
      timeAgo: 'Hace 1 hora',
      signalDbm: -20.1,
      nodeCode: 'NAP_SOMA_04',
    },
  ]);

  const [simulatingAudio, setSimulatingAudio] = useState(false);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newLogs = [...terminalLogs, `root@dedsec-teleco:~# ${terminalInput}`];

    if (cmd === 'help') {
      newLogs.push(
        'COMMANDS AVAILABLE:',
        '  ping ont       - Pruebas de latencia y potencia de fibra',
        '  scan nap       - Escanear puertos ocupados en cajas NAP',
        '  resolve tk-1   - Simular resolución de orden WD2-8492 por audio',
        '  clear          - Limpiar pantalla de consola'
      );
    } else if (cmd === 'ping ont') {
      newLogs.push('// PINGING ONT HWTC-99A821...', '--> Signal: -19.4 dBm [STABLE]', '--> RX: 2.4 Gbps / TX: 1.2 Gbps');
    } else if (cmd === 'scan nap') {
      newLogs.push('// SCANNING NAP_SF_01...', '[+] Port 01-12: BUSY (Active Customers)', '[+] Port 13-16: FREE (Available)');
    } else if (cmd === 'resolve tk-1') {
      runMockTechVoiceClosure();
    } else if (cmd === 'clear') {
      setTerminalLogs(['// CONSOLE CLEARED.']);
      setTerminalInput('');
      return;
    } else {
      newLogs.push(`bash: command not found: ${cmd}. Type "help" for info.`);
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const runMockTechVoiceClosure = () => {
    setSimulatingAudio(true);
    setTerminalLogs((prev) => [
      ...prev,
      '🎙️ // WHATSAPP_AUDIO_STREAM_RECEIVED: "Instalación lista en Av. Las Condes. ONT SN: HWTC-99A821"',
      '⚡ // AI_PARSER: Extrayendo ONT SN: HWTC-99A821 | Status: OK',
      '📡 // OLT_MOCK_DRIVER: Leyendo potencia de fibra en vivo...',
    ]);

    setTimeout(() => {
      const dbm = (-19.1 - Math.random() * 2).toFixed(2);
      setTerminalLogs((prev) => [
        ...prev,
        `🎯 // TELEMETRY_SUCCESS: Potencia en OLT = ${dbm} dBm [RANGO HEROICO DEDSEC]`,
        '✔ // TICKET WD2-8492 CERRADO Y ASIGNADO A INVENTARIO AUTOMÁTICO.',
      ]);

      setTickets((prev) =>
        prev.map((t) =>
          t.id === '1'
            ? { ...t, status: 'RESUELTO', signalDbm: parseFloat(dbm) }
            : t
        )
      );
      setSimulatingAudio(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#00FF66] font-mono selection:bg-[#00FF66] selection:text-black">
      
      {/* RETRO CRT SCANLINE OVERLAY EFFECT */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Unified Global Navigation Header */}
      <NavigationHeader />

      {/* Main Grid Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Estilo Hacker Retro Watch Dogs 2 */}
        <div className="p-5 bg-black border-2 border-[#00FF66] rounded shadow-[0_0_20px_rgba(0,255,102,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-black bg-[#00FF66] px-2.5 py-0.5 rounded">
              MODULO: NOC DESPACHO & CONTROL DE OPERACIONES
            </span>
            <h2 className="text-base font-bold text-white mt-1">
              Estética de Consola CRT Retro, Diagramas de Fibra y Comandos Interactivos
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Combinación del estilo hacker underground de Marcus Holloway en San Francisco con la fluidez de un software moderno de operaciones de telecomunicaciones.
            </p>
          </div>

          <div className="text-xs text-[#00FF66] bg-slate-950 p-2.5 rounded border border-[#00FF66]/40 font-mono">
            <pre className="text-[10px] leading-tight">
{` [OLT_CENTRAL] ───(FIBER_DROP)───► [NAP_BOX] ───► [ONT_CLIENT]
 STATUS: OK | POTENCIA: -19.4 dBm | LATENCIA: 2ms`}
            </pre>
          </div>
        </div>

        {/* Retro KPI Telemetry Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#0B0F1A] border border-[#00FF66]/40 rounded hover:border-[#00FF66] transition shadow-[0_0_10px_rgba(0,255,102,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// ACTIVE_SUBSCRIBERS</span>
              <Users className="w-4 h-4 text-[#00FF66]" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">4,892</h3>
            <p className="text-[11px] text-[#00FF66] mt-0.5">↑ +14.2% [NODE_GROWTH]</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-cyan-500/40 rounded hover:border-cyan-400 transition shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// FIBER_SIGNAL_LEVEL</span>
              <Wifi className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">-19.8 dBm</h3>
            <p className="text-[11px] text-cyan-400/80 mt-0.5">[OPTIMAL_RANGE]</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-amber-500/40 rounded hover:border-amber-400 transition shadow-[0_0_10px_rgba(255,176,0,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// FIELD_WORK_ORDERS</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">12</h3>
            <p className="text-[11px] text-amber-400/80 mt-0.5">8 ACTIVE • 4 QUEUED</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-purple-500/40 rounded hover:border-purple-400 transition shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// SLA_COMPLIANCE</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-purple-300 mt-1">98.2%</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">MTTR: 42 MIN</p>
          </div>
        </div>

        {/* WORK ORDERS & INTERACTIVE RETRO TERMINAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Work Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase">
                <CornerDownRight className="w-4 h-4 text-[#00FF66]" />
                // DISPATCH_QUEUE (DEDSEC_CREWS)
              </h2>
              <span className="text-[10px] text-[#00FF66] bg-black px-2.5 py-0.5 rounded border border-[#00FF66]/40">
                WHATSAPP_BOT: ONLINE
              </span>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div 
                  key={t.id}
                  className="p-4 bg-[#0A0D15] border border-[#00FF66]/30 hover:border-[#00FF66] rounded transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-black text-[#00FF66] border border-[#00FF66]/40 rounded">
                        {t.ticketNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'CRITICA' ? 'bg-red-950 text-red-400 border border-red-800' :
                        t.priority === 'ALTA' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}>
                        [{t.priority}]
                      </span>
                      <span className="text-xs text-slate-400">• {t.category}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{t.customerName}</h4>
                    <p className="text-xs text-slate-400">{t.address}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-[#00FF66] uppercase">// CREW</p>
                      <p className="text-xs font-bold text-white">{t.technician}</p>
                      {t.signalDbm && (
                        <p className="text-xs text-cyan-300 font-bold mt-0.5">
                          SIGNAL: {t.signalDbm} dBm
                        </p>
                      )}
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      t.status === 'RESUELTO' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40' :
                      t.status === 'EN_CURSO' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RETRO CONSOLE & COMMAND PROMPT WIDGET */}
          <div className="p-5 bg-black border-2 border-[#00FF66] rounded flex flex-col justify-between space-y-4 shadow-[0_0_15px_rgba(0,255,102,0.15)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#00FF66]/30 pb-2">
                <div className="flex items-center gap-2 text-[#00FF66]">
                  <Terminal className="w-4 h-4" />
                  <h3 className="font-bold text-xs uppercase tracking-wider">// DEDSEC_TERMINAL_PROMPT</h3>
                </div>
                <span className="text-[9px] bg-[#00FF66]/10 text-[#00FF66] px-2 py-0.5 rounded border border-[#00FF66]/30">
                  INTERACTIVE
                </span>
              </div>

              {/* Console Logs Display */}
              <div className="bg-[#05070A] p-3 rounded border border-[#00FF66]/30 h-44 overflow-y-auto font-mono text-[11px] text-[#00FF66] space-y-1">
                {terminalLogs.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>

              {/* Interactive Terminal Input */}
              <form onSubmit={handleCommandSubmit} className="flex gap-2">
                <span className="text-[#00FF66] font-bold text-xs py-1.5">root@dedsec:~#</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'help', 'ping ont', 'scan nap'..."
                  className="flex-1 bg-black border border-[#00FF66]/40 rounded px-3 py-1.5 text-xs text-[#00FF66] focus:outline-none focus:border-[#00FF66]"
                />
              </form>
            </div>

            {/* Quick Trigger Button */}
            <button
              onClick={runMockTechVoiceClosure}
              disabled={simulatingAudio}
              className="w-full py-2.5 px-4 bg-[#00FF66] hover:bg-[#00CC52] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {simulatingAudio ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-black" />
                  EJECUTANDO AUDIO DE TÉCNICO...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black text-black" />
                  SIMULAR AUDIO DE TÉCNICO (WD2-8492)
                </>
              )}
            </button>
          </div>

        </div>

        {/* cTOS FTTH Network Hardware Status */}
        <div className="p-5 bg-black border border-[#00FF66]/40 rounded space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00FF66]" />
              // cTOS_2.0_HARDWARE_INFRASTRUCTURE (FTTH OLTs)
            </h3>
            <span className="text-[10px] text-[#00FF66] font-bold">4 OLTs OPERATIONAL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#06080E] border border-[#00FF66]/30 rounded space-y-2">
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-bold">OLT-CENTRAL-01 (Huawei)</span>
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
              </div>
              <p className="text-[11px] text-slate-400">IP: 10.0.1.10 • 8 PON PORTS</p>
              <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                <div className="bg-[#00FF66] h-full w-[65%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#00FF66]">
                <span>LOAD: 65%</span>
                <span>1,024 ONUs</span>
              </div>
            </div>

            <div className="p-3 bg-[#06080E] border border-cyan-500/30 rounded space-y-2">
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-bold">OLT-NORTE-02 (ZTE)</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400">IP: 10.0.2.10 • 4 PON PORTS</p>
              <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                <div className="bg-cyan-400 h-full w-[42%]" />
              </div>
              <div className="flex justify-between text-[10px] text-cyan-400">
                <span>LOAD: 42%</span>
                <span>512 ONUs</span>
              </div>
            </div>

            <div className="p-3 bg-[#06080E] border border-amber-500/30 rounded space-y-2">
              <div className="flex justify-between items-center text-slate-200">
                <span className="font-bold">OLT-SUR-03 (V-SOL)</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400">IP: 10.0.3.10 • 16 PON PORTS</p>
              <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                <div className="bg-amber-400 h-full w-[88%]" />
              </div>
              <div className="flex justify-between text-[10px] text-amber-400">
                <span>LOAD: 88%</span>
                <span>1,840 ONUs</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
