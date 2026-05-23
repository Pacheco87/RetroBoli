const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'retroboli_admin_token';

export function getAssetUrl(url) {
  if (!url) {
    return '/logo-retroboli.jpg';
  }

  if (url.startsWith('http')) {
    return url;
  }

  if (url.startsWith('/uploads')) {
    return `${API_BASE_URL}${url}`;
  }

  return url;
}

export function getAdminToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function apiGet(path, options = {}) {
  return apiRequest(path, { method: 'GET', ...options });
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAdminToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || 'Request failed');
  }

  return body;
}
