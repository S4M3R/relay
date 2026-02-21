/**
 * API client for the relay daemon.
 * Reads auth token from sessionStorage and includes it as a Bearer token
 * in all requests. Handles 401 (session expired) and connection failures.
 */

const TOKEN_KEY = 'relay-dashboard-token';

// Global 401 listener — components can subscribe to show unauthorized UI
type UnauthorizedListener = () => void;
let onUnauthorized: UnauthorizedListener | null = null;

export function setOnUnauthorized(listener: UnauthorizedListener | null): void {
  onUnauthorized = listener;
}

function getToken(): string | null {
  const session = sessionStorage.getItem(TOKEN_KEY);
  if (session) return session;
  // Fallback to cookie
  const match = document.cookie.match(/(?:^|; )relay-token=([^;]+)/);
  return match ? match[1] : null;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    // Clear stale token
    sessionStorage.removeItem(TOKEN_KEY);
    document.cookie = 'relay-token=; path=/dashboard; max-age=0';
    onUnauthorized?.();
    throw new ApiError(
      'Session expired. Please re-run `relay dashboard` to get a new token.',
      401,
    );
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      // Response may not be JSON
    }
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: string }).error)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'GET',
      headers: getHeaders(),
    });
  } catch {
    throw new ApiError(
      'Cannot reach daemon. Is the relay daemon running?',
      0,
    );
  }
  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Cannot reach daemon. Is the relay daemon running?',
      0,
    );
  }
  return handleResponse<T>(response);
}
