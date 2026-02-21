/**
 * Form page to initiate a voice call via ElevenLabs.
 * Provides feature parity with `relay call` CLI command.
 * Submits to POST /call and displays the call initiation result.
 */

import { useState, useCallback } from 'react';
import { apiPost, ApiError } from '../lib/api';

interface CallResponse {
  success: boolean;
  message: string;
  conversation_id: string;
  agent_id: string;
  callSid?: string;
}

const E164_PATTERN = /^\+\d{1,15}$/;

export default function CallPage() {
  const [toNumber, setToNumber] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [language, setLanguage] = useState('en');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CallResponse | null>(null);

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!toNumber.trim()) {
      errors.to_number = 'Phone number is required';
    } else if (!E164_PATTERN.test(toNumber.trim())) {
      errors.to_number = 'Must be E.164 format (e.g. +15551234567)';
    }

    if (!phoneNumberId.trim()) {
      errors.phone_number_id = 'Phone number ID is required';
    }

    if (!elevenlabsApiKey.trim()) {
      errors.elevenlabs_api_key = 'API key is required';
    }

    if (!prompt.trim()) {
      errors.prompt = 'Prompt is required';
    }

    if (!firstMessage.trim()) {
      errors.first_message = 'First message is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [toNumber, phoneNumberId, elevenlabsApiKey, prompt, firstMessage]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setResult(null);

      if (!validate()) return;

      setSubmitting(true);

      const payload: Record<string, string> = {
        to_number: toNumber.trim(),
        phone_number_id: phoneNumberId.trim(),
        elevenlabs_api_key: elevenlabsApiKey.trim(),
        prompt: prompt.trim(),
        first_message: firstMessage.trim(),
        language: language.trim() || 'en',
      };

      if (voiceId.trim()) {
        payload.voice_id = voiceId.trim();
      }

      try {
        const data = await apiPost<CallResponse>('/call', payload);
        setResult(data);
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
    [toNumber, phoneNumberId, elevenlabsApiKey, prompt, firstMessage, voiceId, language, validate],
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-lg font-mono font-bold text-white/90 mb-6">
        Place Call
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 space-y-1">
          <p className="text-sm font-mono text-emerald-400">Call initiated successfully</p>
          <div className="text-xs font-mono text-emerald-300/70 space-y-0.5">
            <p>Agent ID: {result.agent_id}</p>
            <p>Conversation ID: {result.conversation_id}</p>
            {result.callSid && <p>Call SID: {result.callSid}</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-glass-border bg-glass p-6 space-y-5">
          {/* To Number */}
          <div>
            <label
              htmlFor="to_number"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              Target Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              id="to_number"
              type="text"
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
              placeholder="+15551234567"
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
            />
            {fieldErrors.to_number && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.to_number}</p>
            )}
          </div>

          {/* Phone Number ID */}
          <div>
            <label
              htmlFor="phone_number_id"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              Phone Number ID <span className="text-red-400">*</span>
            </label>
            <input
              id="phone_number_id"
              type="text"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="ElevenLabs agent phone number ID (Twilio)"
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
            />
            {fieldErrors.phone_number_id && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.phone_number_id}</p>
            )}
          </div>

          {/* ElevenLabs API Key */}
          <div>
            <label
              htmlFor="elevenlabs_api_key"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              ElevenLabs API Key <span className="text-red-400">*</span>
            </label>
            <input
              id="elevenlabs_api_key"
              type="password"
              value={elevenlabsApiKey}
              onChange={(e) => setElevenlabsApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
            />
            {fieldErrors.elevenlabs_api_key && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.elevenlabs_api_key}</p>
            )}
          </div>

          {/* Prompt */}
          <div>
            <label
              htmlFor="prompt"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              System Prompt <span className="text-red-400">*</span>
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="System prompt for the call agent..."
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50 resize-y"
            />
            {fieldErrors.prompt && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.prompt}</p>
            )}
          </div>

          {/* First Message */}
          <div>
            <label
              htmlFor="first_message"
              className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
            >
              First Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="first_message"
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              rows={2}
              placeholder="First message the agent says when the call connects..."
              className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50 resize-y"
            />
            {fieldErrors.first_message && (
              <p className="mt-1 text-xs font-mono text-red-400">{fieldErrors.first_message}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="voice_id"
                className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
              >
                Voice ID <span className="text-white/30">(optional)</span>
              </label>
              <input
                id="voice_id"
                type="text"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                placeholder="Defaults to Rachel"
                className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label
                htmlFor="language"
                className="block text-xs font-mono font-medium text-white/60 uppercase tracking-wider mb-1.5"
              >
                Language <span className="text-white/30">(optional)</span>
              </label>
              <input
                id="language"
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="en"
                className="w-full rounded-md border border-glass-border bg-white/[0.03] px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md text-xs font-mono font-medium text-white bg-accent-blue/80 hover:bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Initiating...' : 'Place Call'}
          </button>
        </div>
      </form>
    </div>
  );
}
