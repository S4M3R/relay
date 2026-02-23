/**
 * LoginPage -- WhatsApp QR code login flow.
 * Provides a "Connect WhatsApp" button that triggers the connection,
 * then polls the QR endpoint to display a scannable QR code.
 * Shows connection status and success state.
 */

import { useState, useCallback } from 'react';
import { usePolling } from '../hooks/usePolling';
import { apiPost, ApiError } from '../lib/api';
import QRCodeDisplay from '../components/QRCodeDisplay';

interface QrResponse {
  qr: string | null;
  generated_at: string | null;
  connected: boolean;
  status: string;
}

export default function LoginPage() {
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [pollEnabled, setPollEnabled] = useState(false);

  const { data: qrData } = usePolling<QrResponse>({
    endpoint: '/api/login/qr',
    interval: 3000,
    enabled: pollEnabled,
  });

  const isConnected = qrData?.connected === true;

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    setConnectError(null);
    setPollEnabled(true);

    try {
      await apiPost<{ initiated: boolean }>('/api/login/connect');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to initiate connection';
      setConnectError(message);
    } finally {
      setConnecting(false);
    }
  }, []);

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-lg font-mono font-bold text-white/90">Login</h1>

      {/* WhatsApp Section */}
      <div className="rounded-xl border border-glass-border bg-glass backdrop-blur-xl p-6">
        <h2 className="text-xs font-mono font-semibold tracking-wider text-white/40 uppercase mb-4">
          WhatsApp
        </h2>

        {isConnected ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <span className="inline-block h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            <p className="text-sm font-mono text-emerald-400 font-semibold">
              WhatsApp Connected
            </p>
            <p className="text-xs font-mono text-white/40">
              You can close this page. The daemon will maintain the connection.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {/* Status indicator */}
            {qrData && !isConnected && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    qrData.status === 'scanning'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-white/20'
                  }`}
                />
                <span className="text-xs font-mono text-white/50">
                  {qrData.status === 'scanning'
                    ? 'Waiting for scan...'
                    : 'Ready to connect'}
                </span>
              </div>
            )}

            {/* QR Code */}
            {pollEnabled && qrData ? (
              <QRCodeDisplay
                qrData={qrData.qr}
                generatedAt={qrData.generated_at}
              />
            ) : null}

            {/* Connect button */}
            {!pollEnabled && (
              <button
                type="button"
                onClick={handleConnect}
                disabled={connecting}
                className="px-5 py-2.5 rounded-lg bg-accent-cyan/15 text-accent-cyan text-sm font-mono font-medium hover:bg-accent-cyan/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? 'Connecting...' : 'Connect WhatsApp'}
              </button>
            )}

            {/* Instructions */}
            {pollEnabled && (
              <div className="text-center space-y-1">
                <p className="text-xs font-mono text-white/50">
                  Scan with WhatsApp on your phone:
                </p>
                <p className="text-xs font-mono text-white/30">
                  Settings &gt; Linked Devices &gt; Link a Device
                </p>
              </div>
            )}

            {/* Error */}
            {connectError && (
              <p className="text-xs font-mono text-red-400">{connectError}</p>
            )}
          </div>
        )}
      </div>

      {/* Telegram Section (placeholder) */}
      <div className="rounded-xl border border-glass-border bg-glass backdrop-blur-xl p-6">
        <h2 className="text-xs font-mono font-semibold tracking-wider text-white/40 uppercase mb-4">
          Telegram
        </h2>
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm font-mono text-white/40">
            Telegram login is configured via CLI.
          </p>
          <p className="text-xs font-mono text-white/30">
            Run: <code className="text-accent-cyan">relay-agent telegram-login</code>
          </p>
        </div>
      </div>
    </div>
  );
}
