/**
 * Table component for displaying a list of conversation instances.
 * Shows state badges, channel badges, and links to detail pages.
 */

import { Link } from 'react-router-dom';
import StateBadge from './StateBadge';
import ChannelBadge from './ChannelBadge';

interface ConversationInstance {
  id: string;
  objective: string;
  target_contact: string;
  state: string;
  channel: string;
  created_at: string;
  updated_at: string;
}

interface InstanceTableProps {
  instances: ConversationInstance[];
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export default function InstanceTable({ instances }: InstanceTableProps) {
  if (instances.length === 0) {
    return (
      <div className="rounded-lg border border-glass-border bg-glass p-8 text-center">
        <p className="text-white/40 font-mono text-sm">No instances found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-glass-border bg-glass overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-glass-border">
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              State
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Objective
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Channel
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-glass-border">
          {instances.map((instance) => (
            <tr
              key={instance.id}
              className="hover:bg-white/[0.03] transition-colors"
            >
              <td className="px-4 py-3">
                <StateBadge state={instance.state} />
              </td>
              <td className="px-4 py-3 text-white/80 font-mono text-xs">
                {truncate(instance.objective, 60)}
              </td>
              <td className="px-4 py-3 text-white/60 font-mono text-xs">
                {instance.target_contact}
              </td>
              <td className="px-4 py-3">
                <ChannelBadge channel={instance.channel} />
              </td>
              <td className="px-4 py-3 text-white/40 font-mono text-xs">
                {formatTimestamp(instance.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/instances/${instance.id}`}
                    className="text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
                  >
                    Detail
                  </Link>
                  <Link
                    to={`/instances/${instance.id}/transcript`}
                    className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors"
                  >
                    Transcript
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
