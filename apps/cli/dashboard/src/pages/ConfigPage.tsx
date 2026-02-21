/**
 * ConfigPage -- displays current configuration and provides editing.
 * Also includes an initialization section for relay init (POST /init).
 *
 * - Config Display: fetches GET /config on mount, shows all fields
 * - Config Edit: toggled edit mode, saves via POST /init (which persists config)
 * - Initialization Section: form for model_api_key, model_provider, identity_file, soul_file
 *   that submits POST /init and triggers WhatsApp connection
 */

import { useState, useCallback, useEffect } from 'react';
import { apiGet, apiPost, ApiError } from '../lib/api';

interface RelayConfig {
  model_api_key: string | null;
  model_provider: string | null;
  whatsapp_connected: boolean;
  telegram_connected: boolean;
  telegram_bot_token: string | null;
  elevenlabs_api_key: string | null;
  elevenlabs_phone_number_id: string | null;
  daemon_port: number;
  identity_file: string;
  soul_file: string;
}

interface InitResponse {
  whatsapp_qr_displayed: boolean;
  error?: string;
}

function maskSecret(value: string | null): string {
  if (!value) return '(not set)';
  if (value.length <= 8) return '********';
  return value.slice(0, 4) + '****' + value.slice(-4);
}

function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-glass-border bg-glass backdrop-blur-xl p-5">
      <h2 className="text-xs font-mono font-semibold tracking-wider text-white/40 uppercase mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ConfigRow({
  label,
  value,
  masked,
}: {
  label: string;
  value: string | number | boolean | null;
  masked?: boolean;
}) {
  let displayValue: string;
  if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No';
  } else if (value === null || value === undefined) {
    displayValue = '(not set)';
  } else if (masked && typeof value === 'string') {
    displayValue = maskSecret(value);
  } else {
    displayValue = String(value);
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-glass-border last:border-b-0">
      <span className="text-xs font-mono text-white/50">{label}</span>
      <span className="text-sm font-mono text-white/90">{displayValue}</span>
    </div>
  );
}

function StatusIndicator({
  success,
  message,
}: {
  success: boolean;
  message: string;
}) {
  return (
    <div
      className={`mt-3 rounded-lg border px-4 py-3 ${
        success
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-red-500/30 bg-red-500/10'
      }`}
    >
      <p
        className={`text-sm font-mono ${
          success ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {message}
      </p>
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50';

const selectClass =
  'w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50';

const labelClass =
  'block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5';

export default function ConfigPage() {
  const [config, setConfig] = useState<RelayConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editProvider, setEditProvider] = useState('');
  const [editApiKey, setEditApiKey] = useState('');
  const [editIdentityFile, setEditIdentityFile] = useState('');
  const [editSoulFile, setEditSoulFile] = useState('');
  const [editElevenLabsKey, setEditElevenLabsKey] = useState('');
  const [editElevenLabsPhoneId, setEditElevenLabsPhoneId] = useState('');
  const [editTelegramToken, setEditTelegramToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Init section state
  const [initProvider, setInitProvider] = useState('anthropic');
  const [initApiKey, setInitApiKey] = useState('');
  const [initIdentityFile, setInitIdentityFile] = useState('');
  const [initSoulFile, setInitSoulFile] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [initResult, setInitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const result = await apiGet<{ config: RelayConfig }>('/config');
      setConfig(result.config);
      setFetchError(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to fetch configuration';
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const startEditing = useCallback(() => {
    if (!config) return;
    setEditProvider(config.model_provider ?? '');
    setEditApiKey('');
    setEditIdentityFile(config.identity_file ?? '');
    setEditSoulFile(config.soul_file ?? '');
    setEditElevenLabsKey('');
    setEditElevenLabsPhoneId(config.elevenlabs_phone_number_id ?? '');
    setEditTelegramToken('');
    setSaveResult(null);
    setEditing(true);
  }, [config]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
    setSaveResult(null);
  }, []);

  const handleSaveConfig = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setSaveResult(null);

      // Build payload with only changed/non-empty fields
      const payload: Record<string, string> = {};
      if (editProvider) payload.model_provider = editProvider;
      if (editApiKey) payload.model_api_key = editApiKey;
      if (editIdentityFile) payload.identity_file = editIdentityFile;
      if (editSoulFile) payload.soul_file = editSoulFile;

      if (Object.keys(payload).length === 0) {
        setSaveResult({
          success: false,
          message: 'No changes to save',
        });
        setSaving(false);
        return;
      }

      try {
        // POST /init saves config and triggers WhatsApp connection.
        // For config-only edits, this is the available endpoint.
        await apiPost<InitResponse>('/init', payload);
        setSaveResult({
          success: true,
          message: 'Configuration saved successfully',
        });
        setEditing(false);
        // Refresh config display
        await fetchConfig();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Failed to save configuration';
        setSaveResult({ success: false, message });
      } finally {
        setSaving(false);
      }
    },
    [
      editProvider,
      editApiKey,
      editIdentityFile,
      editSoulFile,
      fetchConfig,
    ],
  );

  const handleInit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setInitializing(true);
      setInitResult(null);

      if (!initApiKey.trim()) {
        setInitResult({
          success: false,
          message: 'API key is required for initialization',
        });
        setInitializing(false);
        return;
      }

      const payload: Record<string, string> = {
        model_api_key: initApiKey.trim(),
        model_provider: initProvider,
      };
      if (initIdentityFile.trim()) {
        payload.identity_file = initIdentityFile.trim();
      }
      if (initSoulFile.trim()) {
        payload.soul_file = initSoulFile.trim();
      }

      try {
        const result = await apiPost<InitResponse>('/init', payload);
        if (result.whatsapp_qr_displayed) {
          setInitResult({
            success: true,
            message:
              'Initialization successful. WhatsApp QR code displayed. Navigate to the Login page to scan.',
          });
        } else {
          setInitResult({
            success: false,
            message: result.error
              ? `Initialization saved but WhatsApp connection failed: ${result.error}`
              : 'Initialization saved but WhatsApp QR was not displayed.',
          });
        }
        // Refresh config display
        await fetchConfig();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Failed to initialize relay';
        setInitResult({ success: false, message });
      } finally {
        setInitializing(false);
      }
    },
    [initApiKey, initProvider, initIdentityFile, initSoulFile, fetchConfig],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm font-mono text-white/40 animate-pulse">
          Loading configuration...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm font-mono text-red-400">{fetchError}</p>
          <button
            type="button"
            onClick={fetchConfig}
            className="text-xs font-mono text-accent-cyan hover:text-accent-cyan/80 transition-colors underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-lg font-mono font-bold text-white/90">
        Configuration
      </h1>

      {/* Current Config Display / Edit */}
      <GlassCard title="Current Configuration">
        {!editing ? (
          <>
            <ConfigRow label="Model Provider" value={config.model_provider} />
            <ConfigRow
              label="Model API Key"
              value={config.model_api_key}
              masked
            />
            <ConfigRow label="Identity File" value={config.identity_file} />
            <ConfigRow label="Soul File" value={config.soul_file} />
            <ConfigRow label="Daemon Port" value={config.daemon_port} />
            <ConfigRow
              label="WhatsApp Connected"
              value={config.whatsapp_connected}
            />
            <ConfigRow
              label="Telegram Connected"
              value={config.telegram_connected}
            />
            <ConfigRow
              label="Telegram Bot Token"
              value={config.telegram_bot_token}
              masked
            />
            <ConfigRow
              label="ElevenLabs API Key"
              value={config.elevenlabs_api_key}
              masked
            />
            <ConfigRow
              label="ElevenLabs Phone Number ID"
              value={config.elevenlabs_phone_number_id}
            />

            <div className="mt-4">
              <button
                type="button"
                onClick={startEditing}
                className="px-4 py-2 rounded-md text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue transition-colors"
              >
                Edit Configuration
              </button>
            </div>

            {saveResult && (
              <StatusIndicator
                success={saveResult.success}
                message={saveResult.message}
              />
            )}
          </>
        ) : (
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label htmlFor="edit-provider" className={labelClass}>
                Model Provider
              </label>
              <select
                id="edit-provider"
                value={editProvider}
                onChange={(e) => setEditProvider(e.target.value)}
                className={selectClass}
              >
                <option value="">-- select --</option>
                <option value="anthropic">Anthropic</option>
                <option value="openai">OpenAI</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-api-key" className={labelClass}>
                Model API Key
              </label>
              <input
                id="edit-api-key"
                type="password"
                value={editApiKey}
                onChange={(e) => setEditApiKey(e.target.value)}
                placeholder="Leave blank to keep current key"
                className={inputClass}
              />
              <p className="mt-1 text-xs font-mono text-white/30">
                Current: {maskSecret(config.model_api_key)}
              </p>
            </div>

            <div>
              <label htmlFor="edit-identity" className={labelClass}>
                Identity File
              </label>
              <input
                id="edit-identity"
                type="text"
                value={editIdentityFile}
                onChange={(e) => setEditIdentityFile(e.target.value)}
                placeholder={config.identity_file || 'IDENTITY.md'}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="edit-soul" className={labelClass}>
                Soul File
              </label>
              <input
                id="edit-soul"
                type="text"
                value={editSoulFile}
                onChange={(e) => setEditSoulFile(e.target.value)}
                placeholder={config.soul_file || 'SOUL.md'}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-md text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 rounded-md text-xs font-mono text-white/50 hover:text-white/80 border border-glass-border hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
            </div>

            {saveResult && (
              <StatusIndicator
                success={saveResult.success}
                message={saveResult.message}
              />
            )}
          </form>
        )}
      </GlassCard>

      {/* Initialization Section */}
      <GlassCard title="Initialize Relay">
        <p className="text-xs font-mono text-white/40 mb-4">
          Set up your relay agent with an LLM provider and connect WhatsApp.
          After initialization, navigate to the Login page to scan the QR code.
        </p>

        <form onSubmit={handleInit} className="space-y-4">
          <div>
            <label htmlFor="init-provider" className={labelClass}>
              Model Provider
            </label>
            <select
              id="init-provider"
              value={initProvider}
              onChange={(e) => setInitProvider(e.target.value)}
              className={selectClass}
            >
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          <div>
            <label htmlFor="init-api-key" className={labelClass}>
              Model API Key <span className="text-red-400">*</span>
            </label>
            <input
              id="init-api-key"
              type="password"
              value={initApiKey}
              onChange={(e) => setInitApiKey(e.target.value)}
              placeholder="Enter your API key"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="init-identity" className={labelClass}>
              Identity File
            </label>
            <input
              id="init-identity"
              type="text"
              value={initIdentityFile}
              onChange={(e) => setInitIdentityFile(e.target.value)}
              placeholder="IDENTITY.md"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="init-soul" className={labelClass}>
              Soul File
            </label>
            <input
              id="init-soul"
              type="text"
              value={initSoulFile}
              onChange={(e) => setInitSoulFile(e.target.value)}
              placeholder="SOUL.md"
              className={inputClass}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={initializing}
              className="px-4 py-2 rounded-md text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {initializing
                ? 'Initializing...'
                : 'Initialize & Connect WhatsApp'}
            </button>
          </div>

          {initResult && (
            <StatusIndicator
              success={initResult.success}
              message={initResult.message}
            />
          )}
        </form>
      </GlassCard>
    </div>
  );
}
