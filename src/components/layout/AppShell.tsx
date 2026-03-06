import type { ReactNode } from 'react';
import { ContactCTA } from './ContactCTA';

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg text-text font-sans antialiased overflow-x-hidden">
      {children}
      <ContactCTA />
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]"
        style={{ backgroundImage: GRAIN_SVG }}
        aria-hidden="true"
      />
    </div>
  );
}
