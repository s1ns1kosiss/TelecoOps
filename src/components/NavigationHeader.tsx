'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Radio, 
  Wrench, 
  Users, 
  MapPin, 
  MessageSquare, 
  DollarSign, 
  Truck, 
  ShieldCheck, 
  Terminal,
  Search,
  BarChart3,
  Boxes,
  UserCheck,
  Settings,
  LogIn
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  accentColor: string;
  badgeText: string;
}

export default function NavigationHeader() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

  const navItems: NavItem[] = [
    {
      name: 'NOC DESPACHO',
      href: '/',
      icon: Radio,
      accentColor: '#00FF66',
      badgeText: 'NOC',
    },
    {
      name: 'CRM SUSCRIPTORES',
      href: '/clientes',
      icon: Users,
      accentColor: '#00F0FF',
      badgeText: 'BSS',
    },
    {
      name: 'MAPA FTTH NAPs',
      href: '/mapa-red',
      icon: MapPin,
      accentColor: '#FF5500',
      badgeText: 'OSS',
    },
    {
      name: 'WHATSAPP AI BOT',
      href: '/whatsapp-bot',
      icon: MessageSquare,
      accentColor: '#D946EF',
      badgeText: 'AI_PARSER',
    },
    {
      name: 'FACTURACIÓN MORA',
      href: '/facturacion',
      icon: DollarSign,
      accentColor: '#FFB000',
      badgeText: 'BILLING',
    },
    {
      name: 'CUADRILLAS STOCK',
      href: '/cuadrillas',
      icon: Truck,
      accentColor: '#A855F7',
      badgeText: 'LOGISTICS',
    },
    {
      name: 'REPORTES ANALÍTICA',
      href: '/reportes',
      icon: BarChart3,
      accentColor: '#06B6D4',
      badgeText: 'ANALYTICS',
    },
    {
      name: 'BODEGA CENTRAL',
      href: '/inventario',
      icon: Boxes,
      accentColor: '#10B981',
      badgeText: 'WAREHOUSE',
    },
    {
      name: 'PORTAL CLIENTE',
      href: '/portal-cliente',
      icon: UserCheck,
      accentColor: '#3B82F6',
      badgeText: 'SELF_SERVICE',
    },
    {
      name: 'CONFIGURACIÓN RED',
      href: '/configuracion',
      icon: Settings,
      accentColor: '#EF4444',
      badgeText: 'HARDWARE_CONFIG',
    },
    {
      name: 'LOGIN / RBAC',
      href: '/login',
      icon: LogIn,
      accentColor: '#EAB308',
      badgeText: 'AUTH',
    },
  ];

  const currentItem = navItems.find((item) => item.href === pathname) || navItems[0];
  const ActiveIcon = currentItem.icon;

  return (
    <header className="border-b-2 border-slate-800 bg-[#0A0E17] px-6 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-xl font-mono">
      
      {/* Left: Brand Identity & Active Page Context */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div 
            className="w-10 h-10 bg-black border-2 rounded flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{ 
              borderColor: currentItem.accentColor,
              boxShadow: `0 0 15px ${currentItem.accentColor}40`
            }}
          >
            <ActiveIcon className="w-5 h-5 animate-pulse" style={{ color: currentItem.accentColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-[#EAB308] uppercase leading-none font-mono">
                TELECO<span style={{ color: currentItem.accentColor }}>OPS</span>
              </h1>
              <span 
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black border"
                style={{ 
                  color: currentItem.accentColor,
                  borderColor: `${currentItem.accentColor}60`
                }}
              >
                //{currentItem.badgeText}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">DEDSEC cTOS 2.0 OPERATIONAL OS</p>
          </div>
        </Link>
      </div>

      {/* Center: Clean Navigation Tabs Bar */}
      <nav className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full text-xs">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded transition flex items-center gap-2 font-bold whitespace-nowrap ${
                isActive
                  ? 'bg-black border text-white'
                  : 'bg-[#0F1320] text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
              style={{
                borderColor: isActive ? item.accentColor : undefined,
                color: isActive ? item.accentColor : undefined,
                boxShadow: isActive ? `0 0 12px ${item.accentColor}35` : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: item.accentColor }} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right: Quick Search & Safety Indicator */}
      <div className="flex items-center gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SEARCH_ONT_OR_CLIENT..."
            className="bg-black border border-slate-800 focus:border-cyan-400 rounded pl-8 pr-3 py-1 text-xs text-cyan-300 focus:outline-none w-48 font-mono placeholder:text-slate-600"
          />
        </div>

        <div className="hidden xl:flex items-center gap-1.5 bg-black text-[#00FF66] px-2.5 py-1 rounded border border-[#00FF66]/30 text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
          <span>MOCK_SAFE</span>
        </div>
      </div>

    </header>
  );
}
