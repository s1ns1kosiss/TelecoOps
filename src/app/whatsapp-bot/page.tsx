'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  MessageSquare, 
  Mic, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  Smartphone, 
  Image as ImageIcon,
  Bot,
  Zap,
  CornerDownRight,
  Send
} from 'lucide-react';
import { TicketService } from '@/modules/field_service/ticket.service';

interface AudioPayloadItem {
  id: string;
  technicianName: string;
  workOrderNumber: string;
  audioDuration: string;
  receivedAt: string;
  rawTranscript: string;
  extractedOntSn: string;
  extractedStatus: string;
  measuredSignalDbm: number;
  photos: string[];
}

interface ChatMessage {
  sender: 'USER' | 'BOT';
  text: string;
  timestamp: string;
  data?: any;
}

export default function WhatsAppBotPage() {
  const ticketService = new TicketService();

  const [audios, setAudios] = useState<AudioPayloadItem[]>([
    {
      id: '1',
      technicianName: 'Carlos M. (Cuadrilla DedSec 2)',
      workOrderNumber: 'WD2-8492',
      audioDuration: '0:14 s',
      receivedAt: 'Hace 5 min',
      rawTranscript: 'Finalizada la instalación en Av. Las Condes 10420. Dejé la ONT en el living con serial HWTC-99A821, la fibra quedó en -19.4 dBm todo excelente.',
      extractedOntSn: 'HWTC-99A821',
      extractedStatus: 'INSTALACION_EXITOSA',
      measuredSignalDbm: -19.4,
      photos: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&q=80',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&q=80',
      ],
    },
    {
      id: '2',
      technicianName: 'Esteban R. (Cuadrilla DedSec 1)',
      workOrderNumber: 'WD2-8488',
      audioDuration: '0:22 s',
      receivedAt: 'Hace 45 min',
      rawTranscript: 'Atendido reclamo por corte en Pasaje El Roble. Fue un doblez en la roseta óptica, reemplacé el latiguillo y recuperó señal en -20.1 dBm.',
      extractedOntSn: 'VSOL-44A902',
      extractedStatus: 'REPARACION_COMPLETADA',
      measuredSignalDbm: -20.1,
      photos: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
      ],
    },
  ]);

  const [selectedAudio, setSelectedAudio] = useState<AudioPayloadItem | null>(audios[0]);
  
  // Interactive Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: 'BOT',
      text: '🤖 // DEDSEC_SENTINEL_AI: Conectado. Escribe una consulta como "Medir señal HWTC-99A821", "Reiniciar ONT" o "Revisar stock en camioneta".',
      timestamp: '16:05',
    },
  ]);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isBotThinking) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      sender: 'USER',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsBotThinking(true);

    try {
      // Consume el endpoint API backend /api/bot/chat
      const res = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          senderRole: 'TECHNICIAN',
          senderPhone: '+56984921042',
        }),
      });

      const data = await res.json();
      const botResponse = data.response;

      const botMsg: ChatMessage = {
        sender: 'BOT',
        text: botResponse.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: botResponse.data,
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'BOT',
          text: '❌ Error al procesar consulta con el bot.',
          timestamp: 'Ahora',
        },
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#D946EF] font-mono selection:bg-[#D946EF] selection:text-white">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner WhatsApp Bot */}
        <div className="p-4 bg-black border-2 border-[#D946EF] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(217,70,239,0.15)]">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#D946EF]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO OPERATIVO: CENTRAL DE WHATSAPP & BOT IA EN VIVO</span>
              <p className="text-[11px] text-slate-400">Los técnicos envían notas de voz por WhatsApp o chatean con el Asistente DedSec para medir potencias en vivo.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#D946EF] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            WHISPER AI ENGINE: ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Audio Messages Feed (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#D946EF]" />
                Histórico de Audios y Reportes de Terreno
              </span>
              <span className="text-slate-400">Total: {audios.length} Payload(s)</span>
            </div>

            <div className="space-y-3">
              {audios.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAudio(item)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedAudio?.id === item.id
                      ? 'bg-[#1D1026] border-2 border-[#D946EF] shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                      : 'bg-[#0A0D15] border border-[#D946EF]/30 hover:border-[#D946EF]/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#D946EF] border border-[#D946EF]/40 rounded font-bold">
                        {item.workOrderNumber}
                      </span>
                      <span className="text-slate-400 font-sans">{item.technicianName}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">({item.receivedAt})</span>
                    </div>

                    <p className="text-xs text-white italic font-sans">
                      "{item.rawTranscript}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-cyan-400">// ONT_DETECTED</p>
                      <p className="text-xs font-bold text-white">{item.extractedOntSn}</p>
                      <p className="text-xs text-[#00FF66] font-bold mt-0.5">
                        {item.measuredSignalDbm} dBm
                      </p>
                    </div>

                    <div className="p-3 bg-black border border-[#D946EF]/40 rounded text-[#D946EF]">
                      <Mic className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Chat & Detail Inspector */}
          <div className="p-5 bg-black border-2 border-[#D946EF] rounded flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
            <div className="space-y-3">
              <div className="border-b border-[#D946EF]/30 pb-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#D946EF]">
                  <Bot className="w-4 h-4" />
                  <h3 className="font-bold text-xs uppercase tracking-wider">// CHAT_INTERACTIVO_AI_BOT</h3>
                </div>
                <span className="text-[9px] bg-[#D946EF]/10 text-[#D946EF] px-2 py-0.5 rounded border border-[#D946EF]/30">
                  LIVE_API
                </span>
              </div>

              {/* Chat Stream Display */}
              <div className="bg-[#090610] p-3 rounded border border-[#D946EF]/30 h-64 overflow-y-auto space-y-2 font-mono text-xs">
                {chatHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded border max-w-[90%] text-xs ${
                      msg.sender === 'USER' 
                        ? 'bg-[#1D1026] text-white border-[#D946EF]/40 ml-auto text-right' 
                        : 'bg-black text-[#D946EF] border-[#D946EF]/20 mr-auto'
                    }`}
                  >
                    <p className="text-[9px] text-slate-500 font-bold mb-0.5">{msg.sender === 'USER' ? 'TÉCNICO' : 'BOT DEDSEC'} • {msg.timestamp}</p>
                    <p className="leading-snug">{msg.text}</p>
                  </div>
                ))}
                {isBotThinking && (
                  <div className="p-2 rounded bg-black text-[#D946EF] border border-[#D946EF]/20 text-xs italic animate-pulse">
                    🤖 Bot pensando consulta...
                  </div>
                )}
              </div>

              {/* Interactive Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Escribe 'Medir señal', 'Stock', 'Reinicio'..."
                  className="flex-1 bg-black border border-[#D946EF]/40 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D946EF]"
                />
                <button
                  type="submit"
                  disabled={isBotThinking}
                  className="bg-[#D946EF] hover:bg-[#C026D3] text-black font-bold px-3 py-1.5 rounded text-xs transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#D946EF]/30 pt-2 flex justify-between">
              <span>Endpoint: <strong>/api/bot/chat</strong></span>
              <span className="text-[#D946EF]">STATUS: CONNECTED</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
