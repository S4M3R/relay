/**
 * Channel indicator badge for conversation instances.
 * Displays the communication channel (whatsapp, telegram, phone).
 */

interface ChannelBadgeProps {
  channel: string;
}

const CHANNEL_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: 'WA',
    color: 'text-emerald-400 bg-emerald-500/15',
  },
  telegram: {
    label: 'Telegram',
    icon: 'TG',
    color: 'text-blue-400 bg-blue-500/15',
  },
  phone: {
    label: 'Phone',
    icon: 'PH',
    color: 'text-violet-400 bg-violet-500/15',
  },
};

const DEFAULT_CONFIG = {
  label: 'Unknown',
  icon: '??',
  color: 'text-white/50 bg-white/10',
};

export default function ChannelBadge({ channel }: ChannelBadgeProps) {
  const config = CHANNEL_CONFIG[channel] ?? DEFAULT_CONFIG;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-medium ${config.color}`}
      title={config.label}
    >
      <span className="text-[10px] font-bold">{config.icon}</span>
      {config.label}
    </span>
  );
}
