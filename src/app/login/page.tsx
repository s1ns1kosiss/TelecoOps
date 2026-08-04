'use client';

import React, { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { 
  LogIn, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  Terminal, 
  Key, 
  Building2, 
  Users, 
  Truck, 
  CheckCircle2, 
  CornerDownRight,
  Zap,
  ArrowRight
} from 'lucide-react';

interface UserRoleOption {
  id: string;
  roleName: string;
  code: 'ADMIN_NOC' | 'DESPACHADOR' | 'TECNICO' | 'SUSCRIPTOR';
  email: string;
  description: string;
  accentColor: string;
}

export default function LoginPage() {
  const [tenantSlug, setTenantSlug] = useState('teleco-chile');
  const [email, setEmail] = useState('admin@teleco.cl');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'ADMIN_NOC' | 'DESPACHADOR' | 'TECNICO' | 'SUSCRIPTOR'>('ADMIN_NOC');

  const [authLogs, setAuthLogs] = useState<string[]>([
    '// AUTH_SERVICE_INITIALIZED: DEDSEC_JWT_IDENTITY_ENGINE',
    '// SELECT A QUICK DEMO ROLE OR ENTER CREDENTIALS TO GENERATE AN ENCRYPTED SESSION.',
  ]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const rolesList: UserRoleOption[] = [
    {
      id: '1',
      roleName: 'Administrador NOC',
      code: 'ADMIN_NOC',
      email: 'admin@teleco.cl',
      description: 'Acceso total a los 11 módulos, OLTs, Facturación y Bodega.',
      accentColor: '#00FF66',
    },
    {
      id: '2',
      roleName: 'Despachador Central',
      code: 'DESPACHADOR',
      email: 'despacho@teleco.cl',
      description: 'Gestión de tickets en cola, asignación de cuadrillas y WhatsApp Bot.',
      accentColor: '#00F0FF',
    },
    {
      id: '3',
      roleName: 'Técnico de Campo',
      code: 'TECNICO',
      email: 'carlos.m@teleco.cl',
      description: 'Cierre de órdenes por voz, fotos y control de camioneta.',
      accentColor: '#A855F7',
    },
    {
      id: '4',
      roleName: 'Suscriptor / Cliente',
      code: 'SUSCRIPTOR',
      email: 'juan_perez@gmail.com',
      description: 'Acceso al Portal Mi Cuenta, clave Wi-Fi y test de velocidad.',
      accentColor: '#3B82F6',
    },
  ];

  const handleQuickRoleSelect = (role: UserRoleOption) => {
    setSelectedRole(role.code);
    setEmail(role.email);
    setAuthLogs((prev) => [
      ...prev,
      `🔑 // ROLE_SELECTED: ${role.roleName} (${role.email})`,
    ]);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthLogs((prev) => [
      ...prev,
      `🔐 // VERIFYING_TENANT: Slug="${tenantSlug}"...`,
      `🔐 // AUTHENTICATING_USER: ${email}...`,
    ]);

    setTimeout(() => {
      setAuthLogs((prev) => [
        ...prev,
        `✔ // JWT_SESSION_GENERATED: Token JWT firmado para ${selectedRole} [TENANT: teleco-chile].`,
        '🚀 // ACCESO CONCEDIDO: Redireccionando a la suite operativa cTOS 2.0...',
      ]);
      setIsLoggingIn(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-[#EAB308] font-mono selection:bg-[#EAB308] selection:text-black">
      
      {/* CRT SCANLINE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Global Navigation Header */}
      <NavigationHeader />

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1650px] w-full mx-auto space-y-6">
        
        {/* Banner Auth */}
        <div className="p-4 bg-black border-2 border-[#EAB308] rounded flex justify-between items-center text-xs shadow-[0_0_15px_rgba(234,179,8,0.15)]">
          <div className="flex items-center gap-3">
            <LogIn className="w-5 h-5 text-[#EAB308]" />
            <div>
              <span className="font-bold text-white uppercase">// MÓDULO AUTH: SISTEMA DE AUTENTICACIÓN & SELECCIÓN DE ROLES DEDSEC</span>
              <p className="text-[11px] text-slate-400">Prueba el inicio de sesión rápido por rol (Administrador, Despachador, Técnico o Cliente) con aislamiento multi-tenant.</p>
            </div>
          </div>
          <span className="text-[10px] bg-[#EAB308] text-black px-2.5 py-0.5 rounded font-bold uppercase">
            JWT ENGINE: ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Demo Role Cards (2 Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase">
              <span className="flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#EAB308]" />
                Selecciona un Rol de Demostración Rápida
              </span>
              <span className="text-slate-400">Total: {rolesList.length} Roles RBAC</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rolesList.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleQuickRoleSelect(role)}
                  className={`p-4 rounded border transition cursor-pointer flex flex-col justify-between gap-3 ${
                    selectedRole === role.code
                      ? 'bg-[#1C180A] border-2 border-[#EAB308] shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                      : 'bg-[#0A0D15] border border-[#EAB308]/30 hover:border-[#EAB308]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span 
                        className="px-2.5 py-0.5 bg-black border rounded text-[10px] font-bold"
                        style={{ color: role.accentColor, borderColor: `${role.accentColor}60` }}
                      >
                        {role.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{role.email}</span>
                    </div>

                    <h4 className="font-bold text-sm text-white font-sans mt-1">{role.roleName}</h4>
                    <p className="text-xs text-slate-400">{role.description}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500">Credenciales cargadas</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: role.accentColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Terminal Form & Console Output */}
          <div className="p-5 bg-black border-2 border-[#EAB308] rounded flex flex-col justify-between space-y-5 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <div className="space-y-4">
              <div className="border-b border-[#EAB308]/30 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase">// AUTHENTICATION_PROMPT</span>
                  <h3 className="text-base font-bold text-white font-sans">Iniciar Sesión en cTOS 2.0</h3>
                </div>
                <span className="text-xs font-bold text-[#EAB308] bg-[#EAB308]/10 px-2.5 py-1 rounded border border-[#EAB308]/40">
                  {selectedRole}
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleAuthenticate} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Tenant Slug (Operador):</label>
                  <input
                    type="text"
                    value={tenantSlug}
                    onChange={(e) => setTenantSlug(e.target.value)}
                    className="w-full bg-black border border-[#EAB308]/40 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Correo Usuario:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-[#EAB308]/40 rounded px-3 py-1.5 text-[#EAB308] font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Contraseña:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-[#EAB308]/40 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-2.5 px-3 bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${isLoggingIn ? 'animate-spin' : ''}`} />
                  AUTENTICAR EN ENTORNO DEDSEC
                </button>
              </form>

              {/* Console Log */}
              <div className="bg-[#05070A] p-2.5 rounded border border-[#EAB308]/30 h-28 overflow-y-auto text-[10px] space-y-1 font-mono text-[#EAB308]">
                {authLogs.map((log, i) => (
                  <p key={i} className="leading-tight">{log}</p>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-[#EAB308]/30 pt-2 flex justify-between">
              <span>Tenant: <strong>teleco-chile</strong></span>
              <span className="text-[#EAB308]">ENCRYPTION: AES-256</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
