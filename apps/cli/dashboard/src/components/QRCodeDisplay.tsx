/**
 * QRCodeDisplay -- renders a QR code string as a scannable image.
 * Uses the `qrcode` library to generate a data URL from the raw QR string
 * emitted by Baileys, then displays it as an <img> element.
 */

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  /** Raw QR code string data from Baileys */
  qrData: string | null;
  /** ISO 8601 timestamp of when the QR was generated */
  generatedAt: string | null;
}

export default function QRCodeDisplay({ qrData, generatedAt }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!qrData) {
      setDataUrl(null);
      setError(null);
      return;
    }

    QRCode.toDataURL(qrData, {
      width: 280,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setDataUrl(url);
        setError(null);
      })
      .catch(() => {
        setError('Failed to render QR code');
        setDataUrl(null);
      });
  }, [qrData]);

  if (!qrData) {
    return (
      <div className="flex items-center justify-center h-[280px] w-[280px] rounded-xl border border-glass-border bg-white/5">
        <p className="text-sm font-mono text-white/40 animate-pulse">
          Waiting for QR code...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[280px] w-[280px] rounded-xl border border-glass-border bg-white/5">
        <p className="text-sm font-mono text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-3">
        {dataUrl && (
          <img
            src={dataUrl}
            alt="WhatsApp QR Code"
            width={280}
            height={280}
            className="block"
          />
        )}
      </div>
      {generatedAt && (
        <p className="text-xs font-mono text-white/30">
          Generated {new Date(generatedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
