/**
 * Form page to create a new conversation instance.
 * Provides feature parity with `relay create` CLI command.
 * Submits to POST /instances and redirects to the instance detail page on success.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, ApiError } from '../lib/api';

interface CreateInstanceResponse {
  id: string;
  state: string;
}

type Channel = 'whatsapp' | 'telegram' | 'phone';

interface TodoEntry {
  key: number;
  text: string;
}

const E164_PATTERN = /^\+\d{1,15}$/;

let nextTodoKey = 1;

function createTodoEntry(text = ''): TodoEntry {
  return { key: nextTodoKey++, text };
}

export default function CreateInstancePage() {
  const navigate = useNavigate();

  const [objective, setObjective] = useState('');
  const [targetContact, setTargetContact] = useState('');
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [todos, setTodos] = useState<TodoEntry[]>(() => [createTodoEntry()]);
  const [intervalMs, setIntervalMs] = useState(1800000);
  const [maxFollowups, setMaxFollowups] = useState(5);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!objective.trim()) {
      errors.objective = 'Objective is required';
    }

    if (!targetContact.trim()) {
      errors.target_contact = 'Contact phone number is required';
    } else if (!E164_PATTERN.test(targetContact.trim())) {
      errors.target_contact = 'Must be E.164 format (e.g. +15551234567)';
    }

    const nonEmptyTodos = todos.filter((t) => t.text.trim().length > 0);
    if (nonEmptyTodos.length === 0) {
      errors.todos = 'At least one todo item with text is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [objective, targetContact, todos]);

  const handleAddTodo = useCallback(() => {
    setTodos((prev) => [...prev, createTodoEntry()]);
  }, []);

  const handleRemoveTodo = useCallback((key: number) => {
    setTodos((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((t) => t.key !== key);
    });
  }, []);

  const handleTodoTextChange = useCallback((key: number, text: string) => {
    setTodos((prev) => prev.map((t) => (t.key === key ? { ...t, text } : t)));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!validate()) return;

      setSubmitting(true);

      const payload = {
        objective: objective.trim(),
        target_contact: targetContact.trim(),
        channel,
        todos: todos
          .filter((t) => t.text.trim().length > 0)
          .map((t) => ({ text: t.text.trim() })),
        heartbeat_config: {
          interval_ms: intervalMs,
          max_followups: maxFollowups,
        },
      };

      try {
        const result = await apiPost<CreateInstanceResponse>('/instances', payload);
        navigate(`/instances/${result.id}`);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setSubmitting(false);
      }
    },
    [objective, targetContact, channel, todos, intervalMs, maxFollowups, validate, navigate],
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-lg font-mono font-bold text-white/90 mb-6">
        Create Instance
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-glass-border bg-glass p-6 space-y-5">
          {/* Objective */}
          <div>
            <label
              htmlFor="objective"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              Objective <span className="text-red-400">*</span>
            </label>
            <textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              placeholder="Describe the conversation objective..."
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50 resize-y"
            />
            {fieldErrors.objective && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.objective}</p>
            )}
          </div>

          {/* Target Contact */}
          <div>
            <label
              htmlFor="target_contact"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              Contact Phone <span className="text-red-400">*</span>
            </label>
            <input
              id="target_contact"
              type="text"
              value={targetContact}
              onChange={(e) => setTargetContact(e.target.value)}
              placeholder="+15551234567"
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
            />
            {fieldErrors.target_contact && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.target_contact}</p>
            )}
          </div>

          {/* Channel */}
          <div>
            <label
              htmlFor="channel"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              Channel
            </label>
            <select
              id="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Todos */}
          <div>
            <label className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5">
              Todo Items <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {todos.map((todo, index) => (
                <div key={todo.key} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/30 w-5 text-right flex-shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={todo.text}
                    onChange={(e) => handleTodoTextChange(todo.key, e.target.value)}
                    placeholder="Todo item text..."
                    className="flex-1 rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTodo(todo.key)}
                    disabled={todos.length <= 1}
                    className="text-xs font-mono text-white/30 hover:text-red-400 disabled:opacity-20 disabled:hover:text-white/30 transition-colors px-1"
                    title="Remove todo"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTodo}
              className="mt-2 text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
            >
              + Add todo
            </button>
            {fieldErrors.todos && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.todos}</p>
            )}
          </div>

          {/* Heartbeat Config */}
          <div>
            <p className="text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5">
              Heartbeat Config
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="interval_ms"
                  className="block text-xs font-mono text-white/40 mb-1"
                >
                  Interval (ms)
                </label>
                <input
                  id="interval_ms"
                  type="number"
                  value={intervalMs}
                  onChange={(e) => setIntervalMs(Number(e.target.value))}
                  min={0}
                  className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                />
              </div>
              <div>
                <label
                  htmlFor="max_followups"
                  className="block text-xs font-mono text-white/40 mb-1"
                >
                  Max Followups
                </label>
                <input
                  id="max_followups"
                  type="number"
                  value={maxFollowups}
                  onChange={(e) => setMaxFollowups(Number(e.target.value))}
                  min={0}
                  className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/instances')}
            className="px-4 py-2 rounded-md text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Creating...' : 'Create Instance'}
          </button>
        </div>
      </form>
    </div>
  );
}
