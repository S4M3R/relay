/**
 * Contact detail page showing contact info, edit form, and associated instances.
 */

import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePolling } from '../hooks/usePolling';
import { apiPut, apiDelete, ApiError } from '../lib/api';
import StateBadge from '../components/StateBadge';
import ChannelBadge from '../components/ChannelBadge';

interface Contact {
  id: string;
  name: string;
  phone: string | null;
  telegram_chat_id: string | null;
  channel: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ConversationInstance {
  id: string;
  objective: string;
  state: string;
  channel: string;
  created_at: string;
  updated_at: string;
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const { data: contact, loading, error, refresh } = usePolling<Contact>({
    endpoint: `/contacts/${id}`,
    interval: 5000,
  });

  const { data: instances } = usePolling<ConversationInstance[]>({
    endpoint: `/contacts/${id}/instances`,
    interval: 5000,
  });

  const handleDelete = useCallback(async () => {
    if (!confirm('Delete this contact?')) return;
    try {
      await apiDelete(`/contacts/${id}`);
      navigate('/contacts');
    } catch {
      // ignore
    }
  }, [id, navigate]);

  if (loading && !contact) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm font-mono text-white/40 animate-pulse">
          Loading contact...
        </p>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-sm font-mono text-red-400">
          {error || 'Contact not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white/90">
            {contact.name}
          </h1>
          <p className="text-xs font-mono text-white/40 mt-1">
            Contact Detail
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border rounded-md hover:bg-white/[0.04] transition-colors"
          >
            {editing ? 'Cancel Edit' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs font-mono text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-md transition-colors"
          >
            Delete
          </button>
          <Link
            to={`/instances/new?contact=${contact.id}`}
            className="px-3 py-1.5 text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue rounded-md transition-colors"
          >
            + New Conversation
          </Link>
        </div>
      </div>

      {/* Edit form or info panel */}
      {editing ? (
        <EditContactForm
          contact={contact}
          onSuccess={() => {
            setEditing(false);
            refresh();
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="rounded-lg border border-glass-border bg-glass p-5 space-y-3">
          <InfoRow label="ID" value={contact.id} />
          <InfoRow label="Name" value={contact.name} />
          <InfoRow label="Phone" value={contact.phone || '—'} />
          <InfoRow label="Channel" value={contact.channel} />
          <InfoRow label="Telegram Chat ID" value={contact.telegram_chat_id || '—'} />
          <InfoRow label="Notes" value={contact.notes || '—'} />
          <InfoRow label="Created" value={formatTimestamp(contact.created_at)} />
          <InfoRow label="Updated" value={formatTimestamp(contact.updated_at)} />
        </div>
      )}

      {/* Associated instances */}
      <div>
        <h2 className="text-sm font-mono font-bold text-white/70 mb-3">
          Conversations ({instances?.length ?? 0})
        </h2>
        {instances && instances.length > 0 ? (
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
                    Channel
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {instances.map((inst) => (
                  <tr key={inst.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <StateBadge state={inst.state} />
                    </td>
                    <td className="px-4 py-3 text-white/80 font-mono text-xs">
                      {inst.objective.length > 60
                        ? inst.objective.substring(0, 57) + '...'
                        : inst.objective}
                    </td>
                    <td className="px-4 py-3">
                      <ChannelBadge channel={inst.channel} />
                    </td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">
                      {formatTimestamp(inst.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/instances/${inst.id}`}
                        className="text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-glass-border bg-glass p-6 text-center">
            <p className="text-white/40 font-mono text-sm">
              No conversations for this contact
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs font-mono text-white/40 w-32 flex-shrink-0 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs font-mono text-white/80 break-all">
        {value}
      </span>
    </div>
  );
}

function EditContactForm({
  contact,
  onSuccess,
  onCancel,
}: {
  contact: Contact;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone || '');
  const [telegramChatId, setTelegramChatId] = useState(
    contact.telegram_chat_id || '',
  );
  const [notes, setNotes] = useState(contact.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      setSubmitting(true);
      setError(null);
      try {
        await apiPut(`/contacts/${contact.id}`, {
          name: name.trim(),
          phone: phone.trim() || null,
          telegram_chat_id: telegramChatId.trim() || null,
          notes: notes.trim() || null,
        });
        onSuccess();
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
    [contact.id, name, phone, telegramChatId, notes, onSuccess],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-glass-border bg-glass p-5 space-y-4"
    >
      {error && (
        <p className="text-xs font-mono text-red-400">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-white/50 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 focus:border-accent-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/50 mb-1">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+15551234567"
            className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/50 mb-1">
            Telegram Chat ID
          </label>
          <input
            type="text"
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            placeholder="123456789"
            className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/50 mb-1">
            Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border rounded-md hover:bg-white/[0.04] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-1.5 text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue disabled:opacity-50 rounded-md transition-colors"
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
