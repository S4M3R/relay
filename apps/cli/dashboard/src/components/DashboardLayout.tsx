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
  { to: '/instances', label: 'Instances', shortLabel: 'INS' },
  { to: '/instances/new', label: 'Create', shortLabel: 'NEW' },
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
        <div className="px-4 py-5 border-b border-glass-border">
          <h1 className="text-sm font-mono font-bold tracking-wider text-accent-cyan">
            RELAY
          </h1>
          <p className="text-[10px] font-mono text-white/30 mt-0.5">
            Dashboard
          </p>
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
                {status.active_instance_count} active / {status.total_instance_count} total
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
