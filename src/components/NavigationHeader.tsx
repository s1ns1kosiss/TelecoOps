'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogIn,
  Radio, 
  Users, 
  Network, 
  Truck,
  Bot, 
  Package,
  CreditCard, 
  UserCheck, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  Terminal,
  Activity,
  Search
} from 'lucide-react';

interface ModuleTab {
  id: string;
  name: string;
  code: string;
  href: string;
  icon: React.ElementType;
  accentColor: string;
  hotkey: string;
  order: number;
}

export default function NavigationHeader() {
  const pathname = usePathname();
  const [clockTime, setClockTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('es-CL', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 11 Modules ordered in logical operational sequence (01 to 11)
  const navTabs: ModuleTab[] = [
    { id: '1', order: 1, name: 'LOGIN RBAC', code: '01_AUTH', href: '/login', icon: LogIn, accentColor: '#EAB308', hotkey: 'F1' },
    { id: '2', order: 2, name: 'NOC DESPACHO', code: '02_NOC', href: '/', icon: Radio, accentColor: '#00FF66', hotkey: 'F2' },
    { id: '3', order: 3, name: 'CRM SUSCRIPTORES', code: '03_CRM', href: '/clientes', icon: Users, accentColor: '#00F0FF', hotkey: 'F3' },
    { id: '4', order: 4, name: 'MAPA FTTH NAPs', code: '04_MAP', href: '/mapa-red', icon: Network, accentColor: '#FF5500', hotkey: 'F4' },
    { id: '5', order: 5, name: 'CUADRILLAS STOCK', code: '05_CREW', href: '/cuadrillas', icon: Truck, accentColor: '#A855F7', hotkey: 'F5' },
    { id: '6', order: 6, name: 'WHATSAPP AI BOT', code: '06_BOT', href: '/whatsapp-bot', icon: Bot, accentColor: '#D946EF', hotkey: 'F6' },
    { id: '7', order: 7, name: 'BODEGA CENTRAL', code: '07_STOCK', href: '/inventario', icon: Package, accentColor: '#10B981', hotkey: 'F7' },
    { id: '8', order: 8, name: 'FACTURACIÓN MORA', code: '08_BILL', href: '/facturacion', icon: CreditCard, accentColor: '#FFB000', hotkey: 'F8' },
    { id: '9', order: 9, name: 'PORTAL CLIENTE', code: '09_PORTAL', href: '/portal-cliente', icon: UserCheck, accentColor: '#3B82F6', hotkey: 'F9' },
    { id: '10', order: 10, name: 'REPORTES BI', code: '10_BI', href: '/reportes', icon: BarChart3, accentColor: '#06B6D4', hotkey: 'F10' },
    { id: '11', order: 11, name: 'CONFIGURACIÓN RED', code: '11_CFG', href: '/configuracion', icon: Settings, accentColor: '#EF4444', hotkey: 'F11' },
  ];

  const activeTab = navTabs.find((tab) => tab.href === pathname) || navTabs[1];

  const filteredTabs = navTabs.filter((tab) =>
    tab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-[#05070C] border-b-2 border-[#00FF66]/40 font-mono selection:bg-[#00FF66] selection:text-black shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
      
      {/* Top DedSec System HUD Line */}
      <div className="max-w-[1700px] mx-auto px-6 py-2.5 flex items-center justify-between border-b border-slate-900 text-xs">
        
        {/* Left System Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#09101A] border-2 border-[#00FF66] rounded flex items-center justify-center text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.3)] group-hover:scale-105 transition">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-widest text-sm font-mono leading-none">
                  DEDSEC<span className="text-[#00FF66]">//cTOS 2.0</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
              </div>
              <span className="text-[9px] text-slate-400 font-mono block">TELECOM OPERATING SAAS</span>
            </div>
          </Link>

          <span className="text-slate-800 hidden md:inline">|</span>

          {/* Active Tab Accent Pill */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">// CURRENT:</span>
            <span 
              className="px-2.5 py-0.5 bg-black border rounded text-[11px] font-bold tracking-wider"
              style={{ color: activeTab.accentColor, borderColor: `${activeTab.accentColor}60` }}
            >
              [{activeTab.code}] {activeTab.name}
            </span>
          </div>
        </div>

        {/* Center Command Switcher Launcher */}
        <div className="relative hidden md:block w-72">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-[#00FF66]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por código o nombre..."
              className="w-full bg-[#090D15] border border-[#00FF66]/30 focus:border-[#00FF66] rounded pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right HUD Indicators */}
        <div className="flex items-center gap-3 text-xs">
          {/* Live System Time */}
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] bg-black px-3 py-1 rounded border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-[#00FF66] animate-pulse" />
            <span className="text-white font-bold">{clockTime || '18:33:00'}</span>
          </div>

          {/* Safety Isolated Badge */}
          <div className="flex items-center gap-1.5 bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HARDWARE: MOCK_SAFE</span>
          </div>
        </div>

      </div>

      {/* Cyberpunk HUD Navigation Bar (Ordered 01 to 11) */}
      <nav className="max-w-[1700px] mx-auto px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex items-center gap-2 px-3 py-2 rounded text-xs font-mono font-bold whitespace-nowrap transition-all border group ${
                isActive
                  ? 'bg-black text-white border-2 shadow-[0_0_16px_rgba(0,0,0,0.8)] scale-[1.03]'
                  : 'bg-[#090E17]/90 text-slate-400 hover:text-white border-slate-800/90 hover:border-slate-700'
              }`}
              style={{
                borderColor: isActive ? tab.accentColor : undefined,
                color: isActive ? tab.accentColor : undefined,
              }}
            >
              {/* Top Accent Line for Each Module */}
              <span 
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t"
                style={{ backgroundColor: tab.accentColor, opacity: isActive ? 1 : 0.4 }}
              />

              <Icon className="w-3.5 h-3.5" style={{ color: tab.accentColor }} />
              
              <span>[{tab.code}] {tab.name}</span>

              {/* Hotkey Tag */}
              <span className="text-[9px] text-slate-600 group-hover:text-slate-400 border border-slate-800 px-1 rounded font-mono">
                {tab.hotkey}
              </span>
            </Link>
          );
        })}
      </nav>

    </header>
  );
}
