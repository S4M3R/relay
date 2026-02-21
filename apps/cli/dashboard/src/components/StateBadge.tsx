/**
 * Color-coded badge for all 11 instance states.
 * Uses brand-consistent colors on dark backgrounds.
 */

interface StateBadgeProps {
  state: string;
}

const STATE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CREATED: {
    bg: 'bg-white/10',
    text: 'text-white/70',
    label: 'Created',
  },
  QUEUED: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    label: 'Queued',
  },
  ACTIVE: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    label: 'Active',
  },
  WAITING_FOR_REPLY: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    label: 'Waiting for Reply',
  },
  WAITING_FOR_AGENT: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    label: 'Waiting for Agent',
  },
  HEARTBEAT_SCHEDULED: {
    bg: 'bg-violet-500/15',
    text: 'text-violet-400',
    label: 'Heartbeat Scheduled',
  },
  PAUSED: {
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    label: 'Paused',
  },
  NEEDS_HUMAN_INTERVENTION: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    label: 'Needs Intervention',
  },
  COMPLETED: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'Completed',
  },
  ABANDONED: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    label: 'Abandoned',
  },
  FAILED: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    label: 'Failed',
  },
};

const DEFAULT_STYLE = {
  bg: 'bg-white/10',
  text: 'text-white/50',
  label: 'Unknown',
};

export default function StateBadge({ state }: StateBadgeProps) {
  const style = STATE_STYLES[state] ?? DEFAULT_STYLE;
  const label = STATE_STYLES[state]?.label ?? state;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium ${style.bg} ${style.text}`}
    >
      {label}
    </span>
  );
}
