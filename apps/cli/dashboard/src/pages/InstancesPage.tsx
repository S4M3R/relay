/**
 * Page listing all conversation instances with state filtering.
 * Polls the daemon for updates every 5 seconds.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePolling } from '../hooks/usePolling';
import InstanceTable from '../components/InstanceTable';

interface ConversationInstance {
  id: string;
  objective: string;
  target_contact: string;
  state: string;
  channel: string;
  created_at: string;
  updated_at: string;
}

const ALL_STATES = [
  'CREATED',
  'QUEUED',
  'ACTIVE',
  'WAITING_FOR_REPLY',
  'WAITING_FOR_AGENT',
  'HEARTBEAT_SCHEDULED',
  'PAUSED',
  'NEEDS_HUMAN_INTERVENTION',
  'COMPLETED',
  'ABANDONED',
  'FAILED',
] as const;

export default function InstancesPage() {
  const [stateFilter, setStateFilter] = useState<string>('ALL');

  const { data, loading, error, refresh } = usePolling<ConversationInstance[]>({
    endpoint: '/instances',
    interval: 5000,
  });

  const instances = data ?? [];

  const filteredInstances = useMemo(() => {
    if (stateFilter === 'ALL') return instances;
    return instances.filter((inst) => inst.state === stateFilter);
  }, [instances, stateFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white/90">
            Conversations
          </h1>
          <p className="text-xs font-mono text-white/40 mt-1">
            {instances.length} total conversation{instances.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="px-3 py-1.5 text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border rounded-md hover:bg-white/[0.04] transition-colors"
          >
            Refresh
          </button>
          <Link
            to="/instances/new"
            className="px-3 py-1.5 text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue rounded-md transition-colors"
          >
            + Create New
          </Link>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="state-filter"
          className="text-xs font-mono text-white/50"
        >
          Filter by state:
        </label>
        <select
          id="state-filter"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-glass border border-glass-border rounded-md px-2.5 py-1.5 text-xs font-mono text-white/80 focus:outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
        >
          <option value="ALL">All states</option>
          {ALL_STATES.map((state) => (
            <option key={state} value={state}>
              {state.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {stateFilter !== 'ALL' && (
          <span className="text-xs font-mono text-white/40">
            {filteredInstances.length} matching
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && !data && (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm font-mono text-white/40 animate-pulse">
            Loading conversations...
          </p>
        </div>
      )}

      {/* Instance table */}
      {!loading || data ? (
        <InstanceTable instances={filteredInstances} />
      ) : null}
    </div>
  );
}
