const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest (path, { method = 'GET', data, auth, headers: customHeaders, signal } = {}) {
  const headers = new Headers(customHeaders || {});

  if (auth?.id) {
    headers.set('x-user-id', auth.id);
  }
  if (auth?.role) {
    headers.set('x-user-role', auth.role);
  }

  let body;
  if (data instanceof FormData) {
    body = data;
  } else if (data !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body,
    signal
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const error = new Error(errorPayload.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function buildQueryString (params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}
