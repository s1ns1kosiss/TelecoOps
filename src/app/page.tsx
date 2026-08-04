'use client';

import React, { useState, useEffect } from 'react';
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
  Play,
  Plus
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
    '// POSTGRESQL_PERSISTENCE: READY FOR REAL TICKETS AND LIVE DISPATCH.',
  ]);

  // Initialized EMPTY for 100% clean real testing
  const [tickets, setTickets] = useState<MockTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [simulatingAudio, setSimulatingAudio] = useState(false);

  useEffect(() => {
    fetchTicketsFromDb();
  }, []);

  const fetchTicketsFromDb = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: MockTicket[] = data.data.map((t: any) => ({
          id: t.id,
          ticketNumber: t.ticketNumber || `WD2-${Math.floor(8000 + Math.random() * 1000)}`,
          customerName: t.customer?.firstName 
            ? `${t.customer.firstName} ${t.customer.lastName || ''}` 
            : 'Cliente Registrado',
          address: t.customer?.address || 'Dirección de Instalación',
          category: t.category === 'INSTALLATION' ? 'INSTALACION' : t.category === 'REPAIR' ? 'REPARACION' : 'FALLA_MASIVA',
          priority: t.priority === 'CRITICAL' ? 'CRITICA' : t.priority === 'HIGH' ? 'ALTA' : 'MEDIA',
          technician: t.workOrders?.[0]?.technician?.name || 'Sin Asignar',
          status: t.status === 'RESOLVED' ? 'RESUELTO' : t.status === 'IN_PROGRESS' ? 'EN_CURSO' : 'ABIERTO',
          timeAgo: 'Justo ahora',
          signalDbm: t.workOrders?.[0]?.dbmSignalMeasured || undefined,
        }));

        setTickets(mapped);
      }
    } catch (err: any) {
      console.error('Error al consultar tickets en PostgreSQL:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

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
        '  clear          - Limpiar pantalla de consola'
      );
    } else if (cmd === 'ping ont') {
      newLogs.push('// PINGING ONT HWTC-99A821...', '--> Signal: -19.4 dBm [STABLE]', '--> RX: 2.4 Gbps / TX: 1.2 Gbps');
    } else if (cmd === 'scan nap') {
      newLogs.push('// SCANNING NAP_SF_01...', '[+] Port 01-12: BUSY (Active Customers)', '[+] Port 13-16: FREE (Available)');
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

  const handleCreateRealTicket = async () => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Instalación de Fibra Óptica Real',
          description: 'Aprovisionamiento de ONT Huawei en domicilio del cliente',
          category: 'INSTALLATION',
          priority: 'MEDIUM',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTerminalLogs((prev) => [
          ...prev,
          `✔ // TICKET REAL CREADO EN POSTGRESQL: ${data.data.ticketNumber}`,
        ]);
        await fetchTicketsFromDb();
      }
    } catch (err: any) {
      console.error('Error al crear ticket real:', err);
    }
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
              Consola de Operaciones Conectada en Tiempo Real a PostgreSQL
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Los tickets y órdenes provienen de la base de datos real. Si ejecutas db:reset la lista queda vacía hasta crear nuevas órdenes.
            </p>
          </div>

          <button
            onClick={handleCreateRealTicket}
            className="bg-[#00FF66] hover:bg-[#00DD55] text-black font-bold px-3.5 py-2 rounded text-xs uppercase flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            CREAR TICKET REAL EN DB
          </button>
        </div>

        {/* Retro KPI Telemetry Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#0B0F1A] border border-[#00FF66]/40 rounded hover:border-[#00FF66] transition shadow-[0_0_10px_rgba(0,255,102,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// TICKETS EN POSTGRESQL</span>
              <Users className="w-4 h-4 text-[#00FF66]" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">{tickets.length}</h3>
            <p className="text-[11px] text-[#00FF66] mt-0.5">DB: telecom_platform</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-cyan-500/40 rounded hover:border-cyan-400 transition shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// FIBER_SIGNAL_LEVEL</span>
              <Wifi className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">-19.4 dBm</h3>
            <p className="text-[11px] text-cyan-400/80 mt-0.5">[OPTIMAL_RANGE]</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-amber-500/40 rounded hover:border-amber-400 transition shadow-[0_0_10px_rgba(255,176,0,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// FIELD_WORK_ORDERS</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">{tickets.filter(t => t.status !== 'RESUELTO').length}</h3>
            <p className="text-[11px] text-amber-400/80 mt-0.5">PENDIENTES EN COLA</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-purple-500/40 rounded hover:border-purple-400 transition shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>// SLA_COMPLIANCE</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-purple-300 mt-1">99.94%</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">MTTR: 34 MIN</p>
          </div>
        </div>

        {/* WORK ORDERS & INTERACTIVE RETRO TERMINAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Work Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase">
                <CornerDownRight className="w-4 h-4 text-[#00FF66]" />
                // DISPATCH_QUEUE (POSTGRESQL DB)
              </h2>
              <span className="text-[10px] text-[#00FF66] bg-black px-2.5 py-0.5 rounded border border-[#00FF66]/40">
                WHATSAPP_BOT: ONLINE
              </span>
            </div>

            {loadingTickets ? (
              <div className="p-8 bg-[#0A0D15] border border-[#00FF66]/30 rounded text-center text-xs font-mono text-[#00FF66] animate-pulse">
                📡 Consultando tickets en la base de datos PostgreSQL...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 bg-[#0A0D15] border border-[#00FF66]/30 rounded text-center space-y-2">
                <p className="text-sm font-bold text-white font-mono">📭 COLA DE DESPACHO VACÍA</p>
                <p className="text-xs text-slate-400">No hay tickets activos en la base de datos tras la limpieza.</p>
                <button
                  onClick={handleCreateRealTicket}
                  className="mt-2 px-3 py-1.5 bg-[#00FF66] text-black font-bold rounded text-xs uppercase inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  CREAR PRIMER TICKET REAL
                </button>
              </div>
            ) : (
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
            )}
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
                  POSTGRESQL_LIVE
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
          </div>

        </div>

      </main>
    </div>
  );
}
