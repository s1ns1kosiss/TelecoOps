import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TelecoOps - Plataforma Integral de Telecomunicaciones (OSS/BSS)',
  description: 'Sistema modular de operaciones de red, despacho de campo, gestión de cuadrillas y facturación para empresas de telecomunicaciones.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#0B1120] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
