'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Activity, 
  Users, 
  Download, 
  RefreshCw, 
  Terminal, 
  Award, 
  CornerDownRight,
  Zap,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface CrewPerformanceItem {
  crewCode: string;
  name: string;
  resolvedTickets: number;
  avgMttrMinutes: number;
  qualityRating: number;
  materialsEfficiency: string;
}

export default function AnalyticsReportsPage() {
  const [crewMetrics, setCrewMetrics] = useState<CrewPerformanceItem[]>([
    {
      crewCode: 'CREW-01',
      name: 'Cuadrilla DedSec 1 (Esteban R.)',
      resolvedTickets: 48,
      avgMttrMinutes: 32,
      qualityRating: 4.9,
      materialsEfficiency: '98.5%',
    },
    {
      crewCode: 'CREW-02',
      name: 'Cuadrilla DedSec 2 (Carlos M.)',
      resolvedTickets: 52,
      avgMttrMinutes: 41,
      qualityRating: 4.8,
      materialsEfficiency: '96.2%',
    },
    {
      crewCode: 'CREW-03',
      name: 'Cuadrilla DedSec Support (Gonzalo P.)',
      resolvedTickets: 24,
      avgMttrMinutes: 28,
      qualityRating: 5.0,
      materialsEfficiency: '99.1%',
    },
  ]);

  const [analyticsLogs, setAnalyticsLogs] = useState<string[]>([
    '// ANALYTICS_ENGINE_INITIALIZED: DEDSEC_TELECOM_BUSINESS_INTELLIGENCE',
    '// MTTR_DAEMON: MONITORING RESOLUTION TIMES AND NETWORK UPTIME...',
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const handleRecalculateMetrics = () => {
    setIsExporting(true);
    setAnalyticsLogs((prev) => [
      ...prev,
      '⚡ // RECALCULATING_MTTR: Procesando 124 tickets del periodo...',
      '📡 // QUERYING_OLT_TELEMETRY: Analizando atenuación óptica histórica (-19.4 dBm avg)...',
    ]);

    setTimeout(() => {
      setAnalyticsLogs((prev) => [
        ...prev,
        '✔ // METRICAS RECALCULADAS: Uptime global de red = 99.94% | MTTR promedio = 34 min [EXCELENTE]',
      ]);
      setIsExporting(false);
    }, 1200);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    setAnalyticsLogs((prev) => [
      ...prev,
      '📄 // GENERATING_EXECUTIVE_PDF: Compilando informe de rendimiento de red y cobros...',
    ]);

    setTimeout(() => {
      setAnalyticsLogs((prev) => [
        ...prev,
        '✔ // INFORME GENERADO: Descargado "Informe_Ejecutivo_TelecoOps_Q3.pdf" [3.2 MB].',
      ]);
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#06B6D4] font-mono selection:bg-[#06B6D4] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Analytics */}
        <div className="p-4 bg-black border-2 border-[#06B6D4] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#06B6D4]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO BI: REPORTES DE RED & ANALÍTICA DE RENDIMIENTO</span>
              <p className="text-[11px] text-slate-400">Métricas de tiempo medio de reparación (MTTR), efectividad de cuadrillas y analítica de recaudación.</p>
            </div>
          </div>
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold px-3 py-1.5 rounded uppercase text-[11px] transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            DESCARGAR INFORME EJECUTIVO (PDF)
          </button>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#0B0F1A] border border-[#06B6D4]/40 rounded hover:border-[#06B6D4] transition shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <span className="text-slate-400 text-[10px]">// MTTR PROMEDIO (TIEMPO RESOLUCIÓN)</span>
            <h3 className="text-2xl font-bold text-white mt-1">34 MIN</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">↓ -12 min vs mes anterior</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-emerald-500/40 rounded hover:border-emerald-400 transition shadow-[0_0_10px_rgba(0,255,102,0.1)]">
            <span className="text-slate-400 text-[10px]">// DISPONIBILIDAD DE RED (UPTIME)</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">99.94%</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">[SLA TELECOM EXCELENTE]</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-cyan-500/40 rounded hover:border-cyan-400 transition shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <span className="text-slate-400 text-[10px]">// ARPU (INGRESO PROMEDIO / USUARIO)</span>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">$29.140 CLP</h3>
            <p className="text-[11px] text-cyan-400 mt-0.5">↑ +4.2% ventas de planes Gamer</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-purple-500/40 rounded hover:border-purple-400 transition shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <span className="text-slate-400 text-[10px]">// TASA DE CANCELACIÓN (CHURN)</span>
            <h3 className="text-2xl font-bold text-purple-300 mt-1">1.1%</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">↓ Retención récord de clientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Crew Performance Table (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#06B6D4]" />
                Rendimiento y Eficiencia de Cuadrillas de Campo
              </span>
              <span className="text-slate-400">Total: {crewMetrics.length} Cuadrilla(s)</span>
            </div>

            <div className="space-y-3">
              {crewMetrics.map((item) => (
                <div
                  key={item.crewCode}
                  className="p-4 rounded border transition bg-[#0A0D15] border-[#06B6D4]/30 hover:border-[#06B6D4] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#06B6D4] border border-[#06B6D4]/40 rounded font-bold">
                        {item.crewCode}
                      </span>
                      <span className="text-slate-400 font-sans">{item.name}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white font-sans">
                      Tickets Resueltos: <span className="text-[#06B6D4]">{item.resolvedTickets}</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-[10px] text-slate-400">// MTTR PROMEDIO</p>
                      <p className="text-xs font-bold text-white">{item.avgMttrMinutes} min</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">// CALIFICACIÓN</p>
                      <p className="text-xs font-bold text-amber-400">{item.qualityRating} / 5.0 ⭐</p>
                    </div>

                    <span className="px-3 py-1 rounded text-xs font-bold bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40">
                      EFICIENCIA {item.materialsEfficiency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Control Panel & Console Output */}
          <div className="p-5 bg-black border-2 border-[#06B6D4] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="space-y-4">
              <div className="border-b border-[#06B6D4]/30 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase">// BI_ENGINE_CONTROLS</span>
                  <h3 className="text-base font-bold text-white font-sans">Analítica de Red cTOS 2.0</h3>
                </div>
                <span className="text-xs font-bold text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded border border-[#06B6D4]/40">
                  REALTIME
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold">// ACCIONES ANALÍTICAS:</p>

                <button
                  onClick={handleRecalculateMetrics}
                  disabled={isExporting}
                  className="w-full py-2.5 px-3 bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
                  RECULCULAR MTTR & UPTIME EN VIVO
                </button>

                <button
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="w-full py-2 px-3 bg-black hover:bg-[#06B6D4]/20 border border-[#06B6D4] text-[#06B6D4] font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  EXPORTAR TABLAS DE COBRO (CSV)
                </button>
              </div>

              {/* Console Log */}
              <div className="bg-[#05070A] p-2.5 rounded border border-[#06B6D4]/30 h-32 overflow-y-auto text-[10px] space-y-1 font-mono text-[#06B6D4]">
                {analyticsLogs.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#06B6D4]/30 pt-2 flex justify-between">
              <span>Motor BI: <strong>DedSec Analytics 2.0</strong></span>
              <span className="text-[#06B6D4]">UPTIME: 99.94%</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
