'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Radio, 
  Users, 
  Network, 
  Bot, 
  CreditCard, 
  Truck, 
  BarChart3, 
  Package, 
  UserCheck, 
  Settings, 
  LogIn,
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';

interface ModuleTab {
  name: string;
  code: string;
  href: string;
  icon: React.ElementType;
  accentColor: string;
}

export default function NavigationHeader() {
  const pathname = usePathname();
  const [clockTime, setClockTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('es-CL', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navTabs: ModuleTab[] = [
    { name: 'NOC DESPACHO', code: '01_NOC', href: '/', icon: Radio, accentColor: '#00FF66' },
    { name: 'CRM SUSCRIPTORES', code: '02_CRM', href: '/clientes', icon: Users, accentColor: '#00F0FF' },
    { name: 'MAPA FTTH NAPs', code: '03_MAP', href: '/mapa-red', icon: Network, accentColor: '#FF5500' },
    { name: 'WHATSAPP AI BOT', code: '04_BOT', href: '/whatsapp-bot', icon: Bot, accentColor: '#D946EF' },
    { name: 'FACTURACIÓN MORA', code: '05_BILL', href: '/facturacion', icon: CreditCard, accentColor: '#FFB000' },
    { name: 'CUADRILLAS STOCK', code: '06_CREW', href: '/cuadrillas', icon: Truck, accentColor: '#A855F7' },
    { name: 'REPORTES BI', code: '07_BI', href: '/reportes', icon: BarChart3, accentColor: '#06B6D4' },
    { name: 'BODEGA CENTRAL', code: '08_WH', href: '/inventario', icon: Package, accentColor: '#10B981' },
    { name: 'PORTAL CLIENTE', code: '09_PORTAL', href: '/portal-cliente', icon: UserCheck, accentColor: '#3B82F6' },
    { name: 'CONFIGURACIÓN RED', code: '10_CFG', href: '/configuracion', icon: Settings, accentColor: '#EF4444' },
    { name: 'LOGIN RBAC', code: '11_AUTH', href: '/login', icon: LogIn, accentColor: '#EAB308' },
  ];

  const activeTab = navTabs.find((tab) => tab.href === pathname) || navTabs[0];

  return (
    <header className="sticky top-0 z-40 bg-[#05070A] border-b-2 border-[#00FF66] font-mono selection:bg-[#00FF66] selection:text-black shadow-[0_0_20px_rgba(0,255,102,0.2)]">
      
      {/* Top Cyber Terminal Prompt Bar */}
      <div className="max-w-[1650px] mx-auto px-6 py-2 flex items-center justify-between border-b border-[#00FF66]/20 text-xs">
        
        {/* DedSec Shell Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-black border border-[#00FF66] rounded flex items-center justify-center text-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.4)] group-hover:bg-[#00FF66] group-hover:text-black transition">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-wider text-xs">
              root@dedsec-ctos2.0:~# <span className="text-[#00FF66]">TELECO_OPS</span>
            </span>
          </Link>

          <span className="text-slate-700 hidden md:inline">|</span>

          {/* Active Module Bracket Display */}
          <div className="hidden md:flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">// ACTIVE_MODULE:</span>
            <span 
              className="font-bold px-2 py-0.5 bg-black border rounded"
              style={{ color: activeTab.accentColor, borderColor: `${activeTab.accentColor}60` }}
            >
              [ {activeTab.code}: {activeTab.name} ]
            </span>
          </div>
        </div>

        {/* Real-time System Telemetry */}
        <div className="flex items-center gap-4 text-xs">
          
          {/* Clock */}
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] bg-black px-2.5 py-1 rounded border border-[#00FF66]/30 font-mono">
            <Activity className="w-3.5 h-3.5 text-[#00FF66] animate-pulse" />
            <span>SYS_TIME: {clockTime || '18:27:00'}</span>
          </div>

          {/* Safety Status */}
          <div className="flex items-center gap-1.5 bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] text-[10px] px-2.5 py-1 rounded font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HARDWARE_MOCK: SECURE</span>
          </div>
        </div>
      </div>

      {/* Cyberpunk Module Tab Matrix */}
      <nav className="max-w-[1650px] mx-auto px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-black text-white border-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] scale-[1.02]'
                  : 'bg-[#090D15] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
              style={{
                borderColor: isActive ? tab.accentColor : undefined,
                color: isActive ? tab.accentColor : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: tab.accentColor }} />
              <span>[{tab.name}]</span>
            </Link>
          );
        })}
      </nav>

    </header>
  );
}
