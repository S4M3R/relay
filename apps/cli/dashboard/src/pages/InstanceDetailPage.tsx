/**
 * Detail page for a single conversation instance.
 * Shows full instance data with action buttons and message sending.
 * Polls for updates every 3 seconds.
 */

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolling } from '../hooks/usePolling';
import { apiPost } from '../lib/api';
import StateBadge from '../components/StateBadge';
import ChannelBadge from '../components/ChannelBadge';
import TodoList from '../components/TodoList';

interface TodoItem {
  id: string;
  text: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

interface HeartbeatConfig {
  interval_ms: number;
  max_followups: number;
}

interface ConversationInstance {
  id: string;
  objective: string;
  target_contact: string;
  contact_id: string | null;
  todos: TodoItem[];
  state: string;
  previous_state: string | null;
  heartbeat_config: HeartbeatConfig;
  follow_up_count: number;
  failure_reason: string | null;
  channel: string;
  created_at: string;
  updated_at: string;
}

const TERMINAL_STATES = ['COMPLETED', 'ABANDONED', 'FAILED'];
const PAUSABLE_STATES = [
  'ACTIVE',
  'WAITING_FOR_REPLY',
  'WAITING_FOR_AGENT',
  'HEARTBEAT_SCHEDULED',
  'NEEDS_HUMAN_INTERVENTION',
];

function isTerminal(state: string): boolean {
  return TERMINAL_STATES.includes(state);
}

function canPause(state: string): boolean {
  return PAUSABLE_STATES.includes(state);
}

function canResume(state: string): boolean {
  return state === 'PAUSED';
}

function canCancel(state: string): boolean {
  return !isTerminal(state);
}

function canSendMessage(state: string): boolean {
  return !isTerminal(state) && state !== 'PAUSED';
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatInterval(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  if (minutes > 0 && seconds > 0) return `${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

interface ActionFeedback {
  status: ActionStatus;
  message: string;
}

export default function InstanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback>({
    status: 'idle',
    message: '',
  });
  const [messageText, setMessageText] = useState('');
  const [sendStatus, setSendStatus] = useState<ActionFeedback>({
    status: 'idle',
    message: '',
  });

  const { data: instance, loading, error, refresh } = usePolling<ConversationInstance>({
    endpoint: `/instances/${id}`,
    interval: 3000,
    enabled: !!id,
  });

  const clearFeedbackAfterDelay = useCallback((setter: (fb: ActionFeedback) => void) => {
    setTimeout(() => setter({ status: 'idle', message: '' }), 4000);
  }, []);

  const handleAction = useCallback(
    async (action: 'pause' | 'resume' | 'cancel') => {
      if (!id) return;
      setActionFeedback({ status: 'loading', message: `${action}ing...` });
      try {
        await apiPost(`/instances/${id}/${action}`);
        setActionFeedback({
          status: 'success',
          message: `Conversation ${action}d successfully`,
        });
        refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Action failed';
        setActionFeedback({ status: 'error', message });
      }
      clearFeedbackAfterDelay(setActionFeedback);
    },
    [id, refresh, clearFeedbackAfterDelay],
  );

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!id || !messageText.trim()) return;
      setSendStatus({ status: 'loading', message: 'Sending...' });
      try {
        await apiPost(`/instances/${id}/send`, { message: messageText.trim() });
        setSendStatus({ status: 'success', message: 'Message sent' });
        setMessageText('');
        refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Send failed';
        setSendStatus({ status: 'error', message });
      }
      clearFeedbackAfterDelay(setSendStatus);
    },
    [id, messageText, refresh, clearFeedbackAfterDelay],
  );

  if (!id) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-mono text-red-400">No conversation ID provided</p>
      </div>
    );
  }

  if (loading && !instance) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm font-mono text-white/40 animate-pulse">
          Loading conversation...
        </p>
      </div>
    );
  }

  if (error && !instance) {
    return (
      <div className="space-y-4">
        <Link
          to="/instances"
          className="text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
        >
          &larr; Back to conversations
        </Link>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!instance) return null;

  const state = instance.state;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link
        to="/instances"
        className="inline-block text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
      >
        &larr; Back to conversations
      </Link>

      {/* Header section */}
      <div className="rounded-lg border border-glass-border bg-glass p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <StateBadge state={state} />
              <ChannelBadge channel={instance.channel} />
            </div>
            <h1 className="text-base font-mono font-medium text-white/90 break-words">
              {instance.objective}
            </h1>
          </div>
          <button
            onClick={refresh}
            className="flex-shrink-0 px-2.5 py-1 text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border rounded-md hover:bg-white/[0.04] transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-mono">
          <div>
            <span className="text-white/40">Conversation ID</span>
            <p className="text-white/70 mt-0.5 break-all">{instance.id}</p>
          </div>
          <div>
            <span className="text-white/40">Contact</span>
            <p className="text-white/70 mt-0.5">
              {instance.target_contact}
              {instance.contact_id && (
                <Link
                  to={`/contacts/${instance.contact_id}`}
                  className="ml-2 text-accent-blue hover:text-accent-cyan transition-colors"
                >
                  View Contact
                </Link>
              )}
            </p>
          </div>
          <div>
            <span className="text-white/40">Created</span>
            <p className="text-white/70 mt-0.5">
              {formatTimestamp(instance.created_at)}
            </p>
          </div>
          <div>
            <span className="text-white/40">Updated</span>
            <p className="text-white/70 mt-0.5">
              {formatTimestamp(instance.updated_at)}
            </p>
          </div>
        </div>

        {/* Failure reason */}
        {instance.failure_reason && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-xs font-mono text-white/40 mb-1">Failure reason</p>
            <p className="text-sm font-mono text-red-400">
              {instance.failure_reason}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="rounded-lg border border-glass-border bg-glass p-5 space-y-4">
        <h2 className="text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
          Actions
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('pause')}
            disabled={!canPause(state) || actionFeedback.status === 'loading'}
            className="px-3 py-1.5 text-xs font-mono rounded-md border transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
          >
            Pause
          </button>
          <button
            onClick={() => handleAction('resume')}
            disabled={!canResume(state) || actionFeedback.status === 'loading'}
            className="px-3 py-1.5 text-xs font-mono rounded-md border transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          >
            Resume
          </button>
          <button
            onClick={() => handleAction('cancel')}
            disabled={!canCancel(state) || actionFeedback.status === 'loading'}
            className="px-3 py-1.5 text-xs font-mono rounded-md border transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Cancel
          </button>
          <Link
            to={`/instances/${id}/transcript`}
            className="px-3 py-1.5 text-xs font-mono rounded-md border border-glass-border text-white/60 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
          >
            View Transcript
          </Link>
        </div>

        {/* Action feedback */}
        {actionFeedback.status !== 'idle' && (
          <p
            className={`text-xs font-mono ${
              actionFeedback.status === 'success'
                ? 'text-emerald-400'
                : actionFeedback.status === 'error'
                  ? 'text-red-400'
                  : 'text-white/50 animate-pulse'
            }`}
          >
            {actionFeedback.message}
          </p>
        )}
      </div>

      {/* Send message */}
      <div className="rounded-lg border border-glass-border bg-glass p-5 space-y-4">
        <h2 className="text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
          Send Message
        </h2>
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={
              canSendMessage(state)
                ? 'Type a message...'
                : 'Cannot send in current state'
            }
            disabled={!canSendMessage(state)}
            className="flex-1 bg-white/[0.03] border border-glass-border rounded-md px-3 py-2 text-sm font-mono text-white/80 placeholder:text-white/30 focus:outline-none focus:border-accent-blue/50 disabled:opacity-30 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={
              !canSendMessage(state) ||
              !messageText.trim() ||
              sendStatus.status === 'loading'
            }
            className="px-4 py-2 text-xs font-mono font-medium rounded-md bg-accent-blue/80 text-white hover:bg-accent-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>

        {/* Send feedback */}
        {sendStatus.status !== 'idle' && (
          <p
            className={`text-xs font-mono ${
              sendStatus.status === 'success'
                ? 'text-emerald-400'
                : sendStatus.status === 'error'
                  ? 'text-red-400'
                  : 'text-white/50 animate-pulse'
            }`}
          >
            {sendStatus.message}
          </p>
        )}
      </div>

      {/* Todo items */}
      <div className="rounded-lg border border-glass-border bg-glass p-5 space-y-4">
        <h2 className="text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
          Todo Items
        </h2>
        <TodoList todos={instance.todos} />
      </div>

      {/* Heartbeat config */}
      <div className="rounded-lg border border-glass-border bg-glass p-5 space-y-4">
        <h2 className="text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
          Heartbeat Config
        </h2>
        <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-xs font-mono">
          <div>
            <span className="text-white/40">Interval</span>
            <p className="text-white/70 mt-0.5">
              {formatInterval(instance.heartbeat_config.interval_ms)}
            </p>
          </div>
          <div>
            <span className="text-white/40">Max follow-ups</span>
            <p className="text-white/70 mt-0.5">
              {instance.heartbeat_config.max_followups}
            </p>
          </div>
          <div>
            <span className="text-white/40">Follow-up count</span>
            <p className="text-white/70 mt-0.5">
              {instance.follow_up_count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
