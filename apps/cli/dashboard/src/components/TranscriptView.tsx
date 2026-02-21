/**
 * Chat-style message list for displaying transcript messages.
 * Visually distinguishes message roles (agent, contact, manual, system).
 * Auto-scrolls to bottom on new messages unless user has scrolled up.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface TranscriptMessage {
  id: string;
  instance_id: string;
  role: 'agent' | 'contact' | 'system' | 'manual';
  content: string;
  timestamp: string;
}

interface TranscriptViewProps {
  messages: TranscriptMessage[];
}

/** Threshold in pixels from bottom to consider "scrolled to bottom". */
const SCROLL_THRESHOLD = 60;

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return time;
  }

  const dateStr = date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  return `${dateStr} ${time}`;
}

function roleLabel(role: TranscriptMessage['role']): string {
  switch (role) {
    case 'agent':
      return 'Agent';
    case 'contact':
      return 'Contact';
    case 'manual':
      return 'Manual';
    case 'system':
      return 'System';
    default:
      return role;
  }
}

function MessageBubble({ message }: { message: TranscriptMessage }) {
  const { role, content, timestamp } = message;

  if (role === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className="max-w-md px-3 py-1.5 rounded-md bg-white/[0.03] border border-glass-border">
          <p className="text-xs font-mono text-white/40 italic text-center">
            {content}
          </p>
          <p className="text-[10px] font-mono text-white/20 text-center mt-1">
            {formatTimestamp(timestamp)}
          </p>
        </div>
      </div>
    );
  }

  const isOutbound = role === 'agent' || role === 'manual';

  const bubbleStyles: Record<string, string> = {
    agent:
      'bg-accent-blue/15 border-accent-blue/20 text-white/90',
    contact:
      'bg-glass border-glass-border text-white/90',
    manual:
      'bg-amber-500/15 border-amber-500/20 text-white/90',
  };

  const labelStyles: Record<string, string> = {
    agent: 'text-accent-blue',
    contact: 'text-white/50',
    manual: 'text-amber-400',
  };

  return (
    <div
      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} my-1.5`}
    >
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 border ${bubbleStyles[role] ?? bubbleStyles.contact}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] font-mono font-bold uppercase ${labelStyles[role] ?? labelStyles.contact}`}
          >
            {roleLabel(role)}
          </span>
          <span className="text-[10px] font-mono text-white/25">
            {formatTimestamp(timestamp)}
          </span>
        </div>
        <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
}

export default function TranscriptView({ messages }: TranscriptViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const prevMessageCount = useRef(messages.length);

  const checkIfAtBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    setIsAtBottom(atBottom);
    if (atBottom) {
      setHasNewMessages(false);
    }
  }, []);

  /** Scroll to bottom of container. */
  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setHasNewMessages(false);
    setIsAtBottom(true);
  }, []);

  // Auto-scroll when new messages arrive and user is at bottom.
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      if (isAtBottom) {
        // Use requestAnimationFrame to ensure DOM has updated.
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      } else {
        setHasNewMessages(true);
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages.length, isAtBottom, scrollToBottom]);

  // Scroll to bottom on initial load.
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
    // Only run on initial mount with messages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length > 0]);

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div
        ref={containerRef}
        onScroll={checkIfAtBottom}
        className="flex-1 overflow-y-auto px-4 py-3"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* New messages indicator */}
      {hasNewMessages && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-accent-blue/80 text-white text-xs font-mono backdrop-blur-sm border border-accent-blue/30 hover:bg-accent-blue transition-colors cursor-pointer"
        >
          New messages
        </button>
      )}
    </div>
  );
}
