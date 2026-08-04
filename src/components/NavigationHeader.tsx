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
  Search,
  Terminal,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';

interface ModuleTab {
  name: string;
  href: string;
  icon: React.ElementType;
  accentColor: string;
  category: 'OPERACIONES_OSS' | 'NEGOCIO_BSS' | 'SISTEMA';
}

export default function NavigationHeader() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'OPERACIONES_OSS' | 'NEGOCIO_BSS' | 'SISTEMA'>('ALL');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-CL', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navTabs: ModuleTab[] = [
    // CATEGORIA: OPERACIONES & TERRENO (OSS)
    { name: 'NOC Despacho', href: '/', icon: Radio, accentColor: '#00FF66', category: 'OPERACIONES_OSS' },
    { name: 'Mapa FTTH NAPs', href: '/mapa-red', icon: Network, accentColor: '#FF5500', category: 'OPERACIONES_OSS' },
    { name: 'Cuadrillas Stock', href: '/cuadrillas', icon: Truck, accentColor: '#A855F7', category: 'OPERACIONES_OSS' },
    { name: 'WhatsApp AI Bot', href: '/whatsapp-bot', icon: Bot, accentColor: '#D946EF', category: 'OPERACIONES_OSS' },
    { name: 'Bodega Central', href: '/inventario', icon: Package, accentColor: '#10B981', category: 'OPERACIONES_OSS' },

    // CATEGORIA: NEGOCIO & CLIENTES (BSS)
    { name: 'CRM Suscriptores', href: '/clientes', icon: Users, accentColor: '#00F0FF', category: 'NEGOCIO_BSS' },
    { name: 'Facturación Mora', href: '/facturacion', icon: CreditCard, accentColor: '#FFB000', category: 'NEGOCIO_BSS' },
    { name: 'Portal Cliente', href: '/portal-cliente', icon: UserCheck, accentColor: '#3B82F6', category: 'NEGOCIO_BSS' },
    { name: 'Reportes BI', href: '/reportes', icon: BarChart3, accentColor: '#06B6D4', category: 'NEGOCIO_BSS' },

    // CATEGORIA: SISTEMA & ACCESO
    { name: 'Configuración Red', href: '/configuracion', icon: Settings, accentColor: '#EF4444', category: 'SISTEMA' },
    { name: 'Login RBAC', href: '/login', icon: LogIn, accentColor: '#EAB308', category: 'SISTEMA' },
  ];

  const activeTab = navTabs.find((tab) => tab.href === pathname) || navTabs[0];

  const filteredTabs = navTabs.filter((tab) => {
    const matchesSearch = tab.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'ALL' || tab.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <header className="sticky top-0 z-40 bg-[#05070D]/95 backdrop-blur-md border-b-2 border-[#00FF66]/30 selection:bg-[#00FF66] selection:text-black shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      
      {/* Top Header Bar */}
      <div className="max-w-[1650px] mx-auto px-6 py-2.5 flex items-center justify-between border-b border-slate-800/80 text-xs font-mono">
        
        {/* Logo & Category Selector */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-black border-2 border-[#00FF66] flex items-center justify-center text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.3)] group-hover:scale-105 transition">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-widest text-sm font-mono block leading-none">
                TELECO<span className="text-[#00FF66]">OPS</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono">cTOS 2.0 SUITE</span>
            </div>
          </Link>

          <span className="text-slate-700 hidden md:inline">|</span>

          {/* Category Filter Pills (Categorización de Módulos) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#090D16] p-1 rounded border border-slate-800">
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-[#00FF66] text-black shadow-[0_0_8px_rgba(0,255,102,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TODOS (11)
            </button>
            <button
              onClick={() => setActiveCategoryFilter('OPERACIONES_OSS')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                activeCategoryFilter === 'OPERACIONES_OSS'
                  ? 'bg-[#FF5500] text-black shadow-[0_0_8px_rgba(255,85,0,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OPERACIONES OSS (5)
            </button>
            <button
              onClick={() => setActiveCategoryFilter('NEGOCIO_BSS')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                activeCategoryFilter === 'NEGOCIO_BSS'
                  ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              NEGOCIO BSS (4)
            </button>
            <button
              onClick={() => setActiveCategoryFilter('SISTEMA')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                activeCategoryFilter === 'SISTEMA'
                  ? 'bg-[#EF4444] text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SISTEMA (2)
            </button>
          </div>
        </div>

        {/* Right Utilities (Search, Clock & Safety Badge) */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden xl:block w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar módulo..."
              className="w-full bg-[#090D16] border border-slate-800 focus:border-[#00FF66] rounded pl-8 pr-3 py-1 text-[11px] text-white focus:outline-none transition"
            />
          </div>

          {/* System Clock */}
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] bg-black/80 px-2.5 py-1 rounded border border-slate-800 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>{currentTime || '18:26:00'}</span>
          </div>

          {/* Safety Badge */}
          <div className="flex items-center gap-1.5 bg-[#00FF66]/10 border border-[#00FF66]/40 text-[#00FF66] text-[10px] px-2.5 py-1 rounded font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MOCK_SAFE</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs (Categorized Visual Clusters) */}
      <nav className="max-w-[1650px] mx-auto px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-black text-white border-2 shadow-[0_0_14px_rgba(0,0,0,0.5)] scale-[1.02]'
                  : 'bg-[#090D16]/80 text-slate-400 hover:text-white border-slate-800/80 hover:border-slate-700'
              }`}
              style={{
                borderColor: isActive ? tab.accentColor : undefined,
                color: isActive ? tab.accentColor : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: tab.accentColor }} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>

    </header>
  );
}
