/**
 * TranscriptPage -- chat-style transcript view for a conversation instance.
 * Polls for new messages every 3 seconds and displays instance context at top.
 */

import { useParams, Link } from 'react-router-dom';
import { usePolling } from '../hooks/usePolling';
import TranscriptView from '../components/TranscriptView';
import StateBadge from '../components/StateBadge';

interface TranscriptMessage {
  id: string;
  instance_id: string;
  role: 'agent' | 'contact' | 'system' | 'manual';
  content: string;
  timestamp: string;
}

interface InstanceSummary {
  id: string;
  objective: string;
  state: string;
  target_contact: string;
  channel: string;
  created_at: string;
}

export default function TranscriptPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: messages,
    loading: messagesLoading,
    error: messagesError,
  } = usePolling<TranscriptMessage[]>({
    endpoint: `/instances/${id}/transcript`,
    interval: 3000,
    enabled: !!id,
  });

  const { data: instance } = usePolling<InstanceSummary>({
    endpoint: `/instances/${id}`,
    interval: 10000,
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/40 font-mono text-sm">No conversation ID provided.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-theme(spacing.12)-theme(spacing.12))]">
      {/* Header bar */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Link
            to={`/instances/${id}`}
            className="text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
          >
            &larr; Back to conversation
          </Link>
        </div>

        {instance && (
          <div className="rounded-lg border border-glass-border bg-glass backdrop-blur-sm px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-mono text-white/90 truncate">
                  {instance.objective}
                </h2>
                <p className="text-xs font-mono text-white/40 mt-0.5">
                  {instance.target_contact} via {instance.channel}
                </p>
              </div>
              <StateBadge state={instance.state} />
            </div>
          </div>
        )}
      </div>

      {/* Transcript area */}
      <div className="flex-1 min-h-0 rounded-lg border border-glass-border bg-glass/50 backdrop-blur-sm flex flex-col">
        {messagesLoading && !messages ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-white/40 font-mono text-sm">
              Loading transcript...
            </p>
          </div>
        ) : messagesError ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-red-400/80 font-mono text-sm">{messagesError}</p>
          </div>
        ) : messages && messages.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-white/30 font-mono text-sm">
              No messages yet
            </p>
          </div>
        ) : messages ? (
          <TranscriptView messages={messages} />
        ) : null}
      </div>
    </div>
  );
}
