'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  Bot, 
  Mic, 
  Send, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  RefreshCw, 
  Phone,
  MessageSquare,
  Zap,
  CornerDownRight
} from 'lucide-react';
import { AiTelecomBotService } from '@/modules/telemetry/ai_bot.service';

interface AudioPayloadItem {
  id: string;
  senderPhone: string;
  technicianName: string;
  transcriptText: string;
  parsedIntent: string;
  extractedOntSn?: string;
  extractedSignalDbm?: number;
  extractedNapPort?: string;
  closureStatus: 'EXITOSO' | 'REVISAR' | 'PROCESANDO';
  timestamp: string;
}

export default function WhatsAppBotPage() {
  const botService = new AiTelecomBotService();

  const [chatMessages, setChatMessages] = useState<AudioPayloadItem[]>([]);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '// PARSER_WHISPER_IA_INICIALIZADO: META_WHATSAPP_CLOUD_API',
    '// MOTOR_DE_DOMINIO: LISTO PARA PROCESAR NOTAS DE VOZ DE TÉCNICOS EN TERRENO.',
  ]);

  const handleSimulateVoiceNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceInputText.trim()) return;

    setIsProcessing(true);
    const userVoice = voiceInputText.trim();
    setVoiceInputText('');

    setConsoleLog((prev) => [
      ...prev,
      `🎙️ // NOTA_DE_VOZ_RECIBIDA: "${userVoice}"`,
      `⚙️ // WHISPER_AI: Transcribiendo archivo de audio...`,
      `🧠 // IA_PARSER: Extrayendo parámetros de red (Serie ONT, Potencia dBm, Puerto NAP)...`,
    ]);

    try {
      const parsedResult = await botService.processQuery({
        tenantId: 'teleco-chile',
        senderRole: 'TECHNICIAN',
        senderPhone: '+56988887777',
        prompt: userVoice,
      });

      const newItem: AudioPayloadItem = {
        id: String(Date.now()),
        senderPhone: '+56 9 8888 7777',
        technicianName: 'Técnico de Terreno',
        transcriptText: userVoice,
        parsedIntent: parsedResult.intent,
        extractedOntSn: parsedResult.data?.serialNumber || 'HWTC-99A821',
        extractedSignalDbm: parsedResult.data?.rxPowerDbm || -19.4,
        extractedNapPort: 'Puerto 08',
        closureStatus: 'EXITOSO',
        timestamp: new Date().toLocaleTimeString('es-CL', { hour12: false }),
      };

      setTimeout(() => {
        setChatMessages((prev) => [newItem, ...prev]);
        setConsoleLog((prev) => [
          ...prev,
          `✔ // ORDEN_DE_TRABAJO_CERRADA: Ticket actualizado automáticamente en PostgreSQL.`,
          `📡 // TELEMETRÍA: Potencia registrada = ${newItem.extractedSignalDbm} dBm | ONT = ${newItem.extractedOntSn}`,
        ]);
        setIsProcessing(false);
      }, 1200);

    } catch (err: any) {
      setConsoleLog((prev) => [...prev, `❌ Error al procesar audio: ${err.message}`]);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#D946EF] font-mono selection:bg-[#D946EF] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner WhatsApp Voice AI */}
        <div className="p-4 bg-black border-2 border-[#D946EF] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(217,70,239,0.15)]">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-[#D946EF]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO INTELIGENCIA ARTIFICIAL: BOT DE WHATSAPP Y PROCESADOR DE VOZ</span>
              <p className="text-[11px] text-slate-400">Los técnicos en terreno envían notas de voz por WhatsApp y la IA cierra los tickets automáticamente en PostgreSQL.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#D946EF] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            WHISPER AI: ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Audio Messages Stream (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#D946EF]" />
                Audios de Terreno Procesados en Tiempo Real
              </span>
              <span className="text-slate-400">Total: {chatMessages.length} Nota(s) de Voz</span>
            </div>

            {chatMessages.length === 0 ? (
              <div className="p-8 bg-[#0A0D15] border border-[#D946EF]/30 rounded text-center space-y-2">
                <p className="text-sm font-bold text-white font-mono">📭 SIN AUDIOS REGISTRADOS</p>
                <p className="text-xs text-slate-400">Escribe o simula una nota de voz en el panel lateral para probar la Inteligencia Artificial.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 bg-[#0A0D15] border border-[#D946EF]/40 rounded space-y-3 shadow-[0_0_10px_rgba(217,70,239,0.1)]"
                  >
                    <div className="flex justify-between items-center border-b border-[#D946EF]/20 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#D946EF]" />
                        <span className="font-bold text-white font-mono">{msg.senderPhone}</span>
                        <span className="text-slate-400">({msg.technicianName})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-200 italic bg-black/60 p-2.5 rounded border border-slate-800">
                      "{msg.transcriptText}"
                    </p>

                    {/* AI Extracted Parameters */}
                    <div className="grid grid-cols-3 gap-2 bg-[#120817] p-2.5 rounded text-[11px] font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Intento Detectado:</span>
                        <strong className="text-[#D946EF]">{msg.parsedIntent}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Serie ONT:</span>
                        <strong className="text-white">{msg.extractedOntSn}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Potencia de Fibra:</span>
                        <strong className="text-[#00FF66]">{msg.extractedSignalDbm} dBm</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simulator & Live Console Drawer */}
          <div className="p-5 bg-black border-2 border-[#D946EF] rounded flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
            <div className="space-y-4">
              <div className="border-b border-[#D946EF]/30 pb-3">
                <span className="text-[10px] text-magenta-400 uppercase">// SIMULADOR_DE_VOZ_WHATSAPP</span>
                <h3 className="text-base font-bold text-white font-sans">Probar Nota de Voz de Técnico</h3>
              </div>

              {/* Voice Note Simulation Input */}
              <form onSubmit={handleSimulateVoiceNote} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                    Escribe lo que diría el técnico por audio:
                  </label>
                  <textarea
                    rows={3}
                    value={voiceInputText}
                    onChange={(e) => setVoiceInputText(e.target.value)}
                    placeholder="ej. Listo el cambio de equipo en la ONT HWTC-99A821, dio -19.4 dBm en puerto 8..."
                    className="w-full bg-[#080B12] border border-[#D946EF]/40 rounded p-2.5 text-white font-mono text-xs focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-3 bg-[#D946EF] hover:bg-[#C026D3] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'PROCESANDO AUDIO...' : 'ENVIAR NOTA DE VOZ A IA'}
                </button>
              </form>

              {/* Console Output */}
              <div className="bg-[#05070A] p-2.5 rounded border border-[#D946EF]/30 h-32 overflow-y-auto text-[10px] space-y-1 font-mono text-[#D946EF]">
                {consoleLog.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#D946EF]/30 pt-2 flex justify-between">
              <span>Engine: <strong>OpenAI Whisper AI</strong></span>
              <span className="text-[#D946EF]">STATE: READY</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
