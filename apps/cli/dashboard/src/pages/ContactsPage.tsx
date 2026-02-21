/**
 * Page listing all contacts with search and actions.
 * Polls the daemon for updates every 5 seconds.
 */

import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePolling } from '../hooks/usePolling';
import { apiPost, apiDelete, ApiError } from '../lib/api';
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

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const { data, loading, error, refresh } = usePolling<Contact[]>({
    endpoint: '/contacts',
    interval: 5000,
  });

  const contacts = data ?? [];

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.telegram_chat_id && c.telegram_chat_id.includes(q)),
    );
  }, [contacts, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono font-bold text-white/90">
            Contacts
          </h1>
          <p className="text-xs font-mono text-white/40 mt-1">
            {contacts.length} total contact{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="px-3 py-1.5 text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border rounded-md hover:bg-white/[0.04] transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue rounded-md transition-colors"
          >
            + Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or Telegram ID..."
          className="w-full max-w-md rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
        />
      </div>

      {/* Add contact form */}
      {showAddForm && (
        <AddContactForm
          onSuccess={() => {
            setShowAddForm(false);
            refresh();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

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
            Loading contacts...
          </p>
        </div>
      )}

      {/* Contact table */}
      {(!loading || data) && (
        <ContactTable contacts={filteredContacts} onDelete={refresh} />
      )}
    </div>
  );
}

function ContactTable({
  contacts,
  onDelete,
}: {
  contacts: Contact[];
  onDelete: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Delete this contact?')) return;
      setDeleting(id);
      try {
        await apiDelete(`/contacts/${id}`);
        onDelete();
      } catch {
        // ignore
      } finally {
        setDeleting(null);
      }
    },
    [onDelete],
  );

  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border border-glass-border bg-glass p-8 text-center">
        <p className="text-white/40 font-mono text-sm">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-glass-border bg-glass overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-glass-border">
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Channel
            </th>
            <th className="px-4 py-3 text-xs font-mono font-medium text-white/50 uppercase tracking-wider">
              Telegram ID
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
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="hover:bg-white/[0.03] transition-colors"
            >
              <td className="px-4 py-3 text-white/80 font-mono text-xs">
                {contact.name}
              </td>
              <td className="px-4 py-3 text-white/60 font-mono text-xs">
                {contact.phone || '—'}
              </td>
              <td className="px-4 py-3">
                <ChannelBadge channel={contact.channel} />
              </td>
              <td className="px-4 py-3 text-white/60 font-mono text-xs">
                {contact.telegram_chat_id || '—'}
              </td>
              <td className="px-4 py-3 text-white/40 font-mono text-xs">
                {formatTimestamp(contact.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="text-xs font-mono text-accent-blue hover:text-accent-cyan transition-colors"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleting === contact.id}
                    className="text-xs font-mono text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deleting === contact.id ? '...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddContactForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [notes, setNotes] = useState('');
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
        const body: Record<string, unknown> = {
          name: name.trim(),
          channel,
        };
        if (phone.trim()) body.phone = phone.trim();
        if (telegramChatId.trim()) body.telegram_chat_id = telegramChatId.trim();
        if (notes.trim()) body.notes = notes.trim();

        await apiPost('/contacts', body);
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
    [name, phone, telegramChatId, channel, notes, onSuccess],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-glass-border bg-glass p-5 space-y-4"
    >
      <h2 className="text-sm font-mono font-bold text-white/80">
        Add Contact
      </h2>

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
            placeholder="John Doe"
            className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none"
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
            Channel
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-1.5 text-sm font-mono text-white/90 focus:border-accent-blue focus:outline-none"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="phone">Phone</option>
          </select>
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
          {submitting ? 'Adding...' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}
