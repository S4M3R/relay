/**
 * Main dashboard layout with sidebar navigation and header.
 * Uses glass UI aesthetic with dark theme.
 */

import { NavLink, Outlet } from 'react-router-dom';
import { usePolling } from '../hooks/usePolling';

interface DaemonStatus {
  pid: number;
  uptime_seconds: number;
  whatsapp_connected: boolean;
  telegram_connected: boolean;
  active_instance_count: number;
  total_instance_count: number;
}

interface NavItem {
  to: string;
  label: string;
  shortLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Status', shortLabel: 'STS' },
  { to: '/contacts', label: 'Contacts', shortLabel: 'CON' },
  { to: '/instances', label: 'Conversations', shortLabel: 'CVS' },
  { to: '/login', label: 'Login', shortLabel: 'LOG' },
  { to: '/config', label: 'Config', shortLabel: 'CFG' },
  { to: '/call', label: 'Call', shortLabel: 'CAL' },
  { to: '/telegram-login', label: 'Telegram', shortLabel: 'TG' },
];

function ConnectionIndicator({
  label,
  connected,
}: {
  label: string;
  connected: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span
        className={`h-2 w-2 rounded-full ${
          connected ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-red-400/60'
        }`}
      />
      <span className={connected ? 'text-white/70' : 'text-white/40'}>
        {label}
      </span>
    </div>
  );
}

export default function DashboardLayout() {
  const { data: status } = usePolling<DaemonStatus>({
    endpoint: '/status',
    interval: 5000,
  });

  return (
    <div className="flex h-screen bg-bg text-white overflow-hidden">
      {/* Sidebar */}
      <nav className="w-52 flex-shrink-0 border-r border-glass-border bg-glass backdrop-blur-xl flex flex-col">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-glass-border flex items-center gap-2.5">
          <svg viewBox="75 110 250 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0">
            <defs>
              <radialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="60%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </radialGradient>
              <radialGradient id="rimLight" cx="30%" cy="20%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <radialGradient id="eyeGrad" cx="45%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
              <linearGradient id="bodyHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <ellipse cx="170" cy="345" rx="18" ry="28" fill="#2563EB" />
            <ellipse cx="170" cy="345" rx="18" ry="28" fill="url(#rimLight)" />
            <ellipse cx="168" cy="368" rx="22" ry="12" fill="#2563EB" />
            <ellipse cx="230" cy="345" rx="18" ry="28" fill="#2563EB" />
            <ellipse cx="230" cy="345" rx="18" ry="28" fill="url(#rimLight)" />
            <ellipse cx="232" cy="368" rx="22" ry="12" fill="#2563EB" />
            <ellipse cx="200" cy="240" rx="110" ry="105" fill="url(#bodyGrad)" />
            <ellipse cx="155" cy="170" rx="55" ry="50" fill="url(#bodyGrad)" />
            <ellipse cx="245" cy="175" rx="48" ry="45" fill="url(#bodyGrad)" />
            <ellipse cx="200" cy="155" rx="45" ry="42" fill="url(#bodyGrad)" />
            <ellipse cx="120" cy="220" rx="42" ry="50" fill="url(#bodyGrad)" />
            <ellipse cx="280" cy="225" rx="40" ry="48" fill="url(#bodyGrad)" />
            <ellipse cx="200" cy="300" rx="95" ry="50" fill="url(#bodyGrad)" />
            <ellipse cx="200" cy="240" rx="110" ry="105" fill="url(#bodyHighlight)" />
            <ellipse cx="155" cy="170" rx="55" ry="50" fill="url(#bodyHighlight)" />
            <ellipse cx="245" cy="175" rx="48" ry="45" fill="url(#bodyHighlight)" />
            <ellipse cx="200" cy="155" rx="45" ry="42" fill="url(#bodyHighlight)" />
            <ellipse cx="200" cy="240" rx="110" ry="105" fill="url(#rimLight)" />
            <ellipse cx="175" cy="128" rx="12" ry="16" fill="#3B82F6" />
            <ellipse cx="175" cy="128" rx="12" ry="16" fill="url(#bodyHighlight)" />
            <ellipse cx="175" cy="120" rx="8" ry="8" fill="#60A5FA" opacity="0.6" />
            <ellipse cx="225" cy="132" rx="10" ry="14" fill="#3B82F6" />
            <ellipse cx="225" cy="132" rx="10" ry="14" fill="url(#bodyHighlight)" />
            <ellipse cx="225" cy="125" rx="7" ry="7" fill="#60A5FA" opacity="0.6" />
            <ellipse cx="170" cy="228" rx="24" ry="26" fill="url(#eyeGrad)" />
            <ellipse cx="163" cy="218" rx="6" ry="7" fill="white" opacity="0.85" />
            <ellipse cx="176" cy="234" rx="3" ry="3.5" fill="white" opacity="0.4" />
            <ellipse cx="230" cy="228" rx="24" ry="26" fill="url(#eyeGrad)" />
            <ellipse cx="223" cy="218" rx="6" ry="7" fill="white" opacity="0.85" />
            <ellipse cx="236" cy="234" rx="3" ry="3.5" fill="white" opacity="0.4" />
            <path d="M 188 262 Q 200 274 212 262" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <ellipse cx="145" cy="248" rx="14" ry="8" fill="#60A5FA" opacity="0.15" />
            <ellipse cx="255" cy="248" rx="14" ry="8" fill="#60A5FA" opacity="0.15" />
            <ellipse cx="185" cy="165" rx="30" ry="12" fill="white" opacity="0.08" />
          </svg>
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-accent-cyan">
              RELAY
            </h1>
            <p className="text-[10px] font-mono text-white/30 mt-0.5">
              Dashboard
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-accent-blue/15 text-accent-blue'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                }`
              }
            >
              <span className="text-[10px] font-bold w-6 opacity-50">
                {item.shortLabel}
              </span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Connection status in sidebar footer */}
        <div className="px-4 py-3 border-t border-glass-border space-y-2">
          <ConnectionIndicator
            label="WhatsApp"
            connected={status?.whatsapp_connected ?? false}
          />
          <ConnectionIndicator
            label="Telegram"
            connected={status?.telegram_connected ?? false}
          />
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 flex-shrink-0 border-b border-glass-border bg-glass/50 backdrop-blur-sm flex items-center justify-between px-5">
          <div className="flex items-center gap-4">
            {status && (
              <>
                <span className="text-xs font-mono text-white/40">
                  PID {status.pid}
                </span>
                <span className="text-xs font-mono text-white/40">
                  {formatUptime(status.uptime_seconds)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <span className="text-xs font-mono text-white/40">
                {status.active_instance_count} active / {status.total_instance_count} conversations
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
