'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  DollarSign, 
  CreditCard, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Activity, 
  TrendingUp,
  RefreshCw,
  Zap,
  CornerDownRight,
  FileText
} from 'lucide-react';
import { MockHardwareDriver } from '@/drivers/mocks/mock_hardware_driver';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  subscriberCode: string;
  subscriberName: string;
  amount: number;
  dueDate: string;
  status: 'PAGADO' | 'MOROSO' | 'PENDIENTE';
  pppoeUser: string;
  autoCutTriggered: boolean;
}

export default function BillingPage() {
  const driver = new MockHardwareDriver();

  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: '1',
      invoiceNumber: 'INV-9410',
      subscriberCode: 'SUB-1088',
      subscriberName: 'Supermercado Central B2B',
      amount: 120000,
      dueDate: '01/08/2026',
      status: 'MOROSO',
      pppoeUser: 'super_central_b2b',
      autoCutTriggered: true,
    },
    {
      id: '2',
      invoiceNumber: 'INV-9411',
      subscriberCode: 'SUB-1042',
      subscriberName: 'Juan Pérez Residencial',
      amount: 29990,
      dueDate: '05/08/2026',
      status: 'PAGADO',
      pppoeUser: 'juan_perez_ftth',
      autoCutTriggered: false,
    },
    {
      id: '3',
      invoiceNumber: 'INV-9412',
      subscriberCode: 'SUB-1095',
      subscriberName: 'María González',
      amount: 19990,
      dueDate: '10/08/2026',
      status: 'PENDIENTE',
      pppoeUser: 'maria_gonzalez_home',
      autoCutTriggered: false,
    },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(invoices[0]);
  const [billingLogs, setBillingLogs] = useState<string[]>([
    '// BILLING_MODULE_INITIALIZED: DEDSEC_FINANCIAL_SUITE',
    '// AUTO_DISCONNECT_DAEMON: MONITORING OVERDUE INVOICES...',
  ]);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleSimulatePayment = async () => {
    if (!selectedInvoice) return;
    setProcessingPayment(true);
    setBillingLogs((prev) => [
      ...prev,
      `💳 // MERCADOPAGO_WEBHOOK_RECEIVED: Pago recibido por $${selectedInvoice.amount.toLocaleString('es-CL')} para factura ${selectedInvoice.invoiceNumber}`,
      `⚡ // EXEC_CMD: resumeService("${selectedInvoice.pppoeUser}")...`,
    ]);

    await driver.resumeService(selectedInvoice.pppoeUser);

    setTimeout(() => {
      setBillingLogs((prev) => [
        ...prev,
        `✔ // AUTOMATIC_RECONNECTION: Servicio del suscriptor ${selectedInvoice.subscriberCode} reactivado automáticamente en MikroTik/OLT.`,
      ]);

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'PAGADO', autoCutTriggered: false }
            : inv
        )
      );
      setSelectedInvoice((prev) => (prev ? { ...prev, status: 'PAGADO', autoCutTriggered: false } : null));
      setProcessingPayment(false);
    }, 1500);
  };

  const handleTriggerAutoCut = async () => {
    if (!selectedInvoice) return;
    setProcessingPayment(true);
    setBillingLogs((prev) => [
      ...prev,
      `⚠️ // OVERDUE_DAEMON_TRIGGERED: Factura ${selectedInvoice.invoiceNumber} vencida > 5 días.`,
      `🔒 // EXEC_CMD: suspendService("${selectedInvoice.pppoeUser}")...`,
    ]);

    await driver.suspendService(selectedInvoice.pppoeUser);

    setTimeout(() => {
      setBillingLogs((prev) => [
        ...prev,
        `🔒 // AUTOMATIC_DISCONNECTION: Servicio del suscriptor ${selectedInvoice.subscriberCode} cortado en red.`,
      ]);

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: 'MOROSO', autoCutTriggered: true }
            : inv
        )
      );
      setSelectedInvoice((prev) => (prev ? { ...prev, status: 'MOROSO', autoCutTriggered: true } : null));
      setProcessingPayment(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#FFB000] font-mono selection:bg-[#FFB000] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Billing */}
        <div className="p-4 bg-black border-2 border-[#FFB000] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(255,176,0,0.15)]">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-[#FFB000]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO BSS: FACTURACIÓN RECURRENTE & CORTE AUTOMÁTICO POR MORA</span>
              <p className="text-[11px] text-slate-400">Si un cliente paga en la pasarela, el sistema reconecta el servicio en segundos sin intervención humana.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#FFB000] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            DAEMON CORTE: ACTIVE
          </span>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#0B0F1A] border border-[#FFB000]/40 rounded hover:border-[#FFB000] transition">
            <span className="text-slate-400 text-[10px]">// RECAUDACIÓN MENSUAL (MRR)</span>
            <h3 className="text-2xl font-bold text-white mt-1">$142.580.000</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">↑ +8.4% recaudo pactado</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-emerald-500/40 rounded hover:border-emerald-400 transition">
            <span className="text-slate-400 text-[10px]">// COBRADO ESTE MES</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">$128.400.000</h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">90.1% efectividad de cobro</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-red-500/40 rounded hover:border-red-400 transition">
            <span className="text-slate-400 text-[10px]">// FACTURAS EN MORA</span>
            <h3 className="text-2xl font-bold text-red-400 mt-1">$14.180.000</h3>
            <p className="text-[11px] text-red-400 mt-0.5">14 suscripciones en mora</p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-cyan-500/40 rounded hover:border-cyan-400 transition">
            <span className="text-slate-400 text-[10px]">// RECONEXIONES AUTOMÁTICAS</span>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">42</h3>
            <p className="text-[11px] text-cyan-400 mt-0.5">Promedio reconexión: 4 seg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Invoices List (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#FFB000]" />
                Facturación Recurrente de Suscriptores
              </span>
              <span className="text-slate-400">Total: {invoices.length} Registro(s)</span>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    selectedInvoice?.id === inv.id
                      ? 'bg-[#1F1810] border-2 border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.2)]'
                      : 'bg-[#0A0D15] border border-[#FFB000]/30 hover:border-[#FFB000]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-black text-[#FFB000] border border-[#FFB000]/40 rounded font-bold">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-slate-400 font-sans">{inv.subscriberName}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">({inv.subscriberCode})</span>
                    </div>

                    <p className="text-xs text-white font-sans font-bold">
                      Vencimiento: {inv.dueDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-slate-400">// AMOUNT</p>
                      <p className="text-sm font-bold text-white">
                        ${inv.amount.toLocaleString('es-CL')}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      inv.status === 'PAGADO' ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40' :
                      inv.status === 'MOROSO' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Automation & Payment Webhook Simulator */}
          {selectedInvoice && (
            <div className="p-5 bg-black border-2 border-[#FFB000] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(255,176,0,0.15)]">
              <div className="space-y-4">
                <div className="border-b border-[#FFB000]/30 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase">// INVOICE_DETAILS</span>
                    <h3 className="text-base font-bold text-white font-sans">{selectedInvoice.invoiceNumber}</h3>
                    <p className="text-xs text-slate-400">{selectedInvoice.subscriberName} ({selectedInvoice.subscriberCode})</p>
                  </div>
                  <span className="text-sm font-bold text-[#FFB000] bg-[#FFB000]/10 px-2.5 py-1 rounded border border-[#FFB000]/40">
                    ${selectedInvoice.amount.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* Auto Cut Status */}
                <div className="bg-[#120E08] p-3 rounded border border-[#FFB000]/30 text-xs space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// DAEMON CORTE STATUS:</p>
                  <p className="font-bold text-white">
                    Usuario PPPoE: <span className="text-cyan-300">{selectedInvoice.pppoeUser}</span>
                  </p>
                  <p className={`text-[11px] font-bold ${
                    selectedInvoice.autoCutTriggered ? 'text-red-400' : 'text-[#00E676]'
                  }`}>
                    {selectedInvoice.autoCutTriggered ? '🔴 SERVICIO SUSPENDIDO EN RED' : '🟢 SERVICIO ACTIVO SIN MORA'}
                  </p>
                </div>

                {/* Automation Actions */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">// SIMULADOR DE PASARELA Y DAEMON:</p>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={processingPayment || selectedInvoice.status === 'PAGADO'}
                    className="w-full py-2.5 px-3 bg-[#00E676] hover:bg-[#00C564] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <CreditCard className="w-4 h-4" />
                    SIMULAR PAGO EN MERCADOPAGO / WEBPAY
                  </button>

                  <button
                    onClick={handleTriggerAutoCut}
                    disabled={processingPayment || selectedInvoice.status === 'MOROSO'}
                    className="w-full py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-300 font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    GATILLAR CORTE AUTOMÁTICO EN MIKROTIK
                  </button>
                </div>

                {/* Console Log Output */}
                <div className="bg-[#05070A] p-2.5 rounded border border-[#FFB000]/30 h-24 overflow-y-auto text-[10px] space-y-1 font-mono text-[#FFB000]">
                  {billingLogs.map((log, i) => (
                    <p key={i} className="leading-tight">{log}</p>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-[#FFB000]/30 pt-2 flex justify-between">
                <span>Pasarela: <strong>MercadoPago/Stripe Webhook</strong></span>
                <span className="text-[#FFB000]">STATUS: ONLINE</span>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
