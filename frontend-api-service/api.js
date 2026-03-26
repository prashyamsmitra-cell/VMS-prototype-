// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// DROP THIS FILE into your frontend at:  src/services/api.js
//
// Set your backend URL in frontend/.env:
//   VITE_API_URL=http://localhost:5000
//
// In production (after deploying backend to Azure / Railway / Render):
//   VITE_API_URL=https://your-backend-domain.azurewebsites.net
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(method, path, body = null, requiresAuth = false) {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = localStorage.getItem('vms_token');
    if (!token) throw new Error('Not authenticated');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    // Surface server validation errors cleanly
    const message = data.errors
      ? data.errors.map((e) => e.msg).join(', ')
      : data.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data; // { success, message, data }
}

const get  = (path, auth = false)       => request('GET',    path, null, auth);
const post = (path, body, auth = false) => request('POST',   path, body, auth);
const put  = (path, body, auth = false) => request('PUT',    path, body, auth);
const del  = (path, auth = false)       => request('DELETE', path, null, auth);

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════

export const authApi = {
  /**
   * Log in as admin.
   * Saves JWT token to localStorage automatically.
   * @returns {{ token, admin: { id, username } }}
   */
  login: async ({ username, password }) => {
    const res = await post('/api/auth/login', { username, password });
    localStorage.setItem('vms_token', res.data.token);
    localStorage.setItem('vms_admin', JSON.stringify(res.data.admin));
    return res.data;
  },

  /** Verify the stored token is still valid */
  me: () => get('/api/auth/me', true),

  /** Clear token from localStorage */
  logout: () => {
    localStorage.removeItem('vms_token');
    localStorage.removeItem('vms_admin');
  },

  /** Check if admin is currently logged in */
  isLoggedIn: () => !!localStorage.getItem('vms_token'),

  /** Get stored admin info */
  getStoredAdmin: () => {
    try { return JSON.parse(localStorage.getItem('vms_admin')); }
    catch { return null; }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const locationsApi = {
  /** Get all locations (public — used on visitor office select page) */
  getAll: () => get('/api/locations').then((r) => r.data),

  /** Get one location by ID (public — used on visitor check-in page) */
  getOne: (id) => get(`/api/locations/${id}`).then((r) => r.data),

  /** Create a new location (admin) */
  create: (data) => post('/api/locations', data, true).then((r) => r.data),

  /** Update a location (admin) */
  update: (id, data) => put(`/api/locations/${id}`, data, true).then((r) => r.data),

  /** Delete a location (admin) */
  delete: (id) => del(`/api/locations/${id}`, true),
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════════════════════

export const employeesApi = {
  /** Get all employees (admin) — optional ?locationId=xxx filter */
  getAll: (locationId = null) => {
    const qs = locationId ? `?locationId=${locationId}` : '';
    return get(`/api/employees${qs}`, true).then((r) => r.data);
  },

  /**
   * Get employees by location (PUBLIC — used for "Whom to Meet" dropdown).
   * Returns only { id, name, department } — no sensitive info.
   */
  getByLocation: (locationId) =>
    get(`/api/employees/by-location/${locationId}`).then((r) => r.data),

  /** Get single employee (admin) */
  getOne: (id) => get(`/api/employees/${id}`, true).then((r) => r.data),

  /** Create employee (admin) */
  create: (data) => post('/api/employees', data, true).then((r) => r.data),

  /** Update employee (admin) */
  update: (id, data) => put(`/api/employees/${id}`, data, true).then((r) => r.data),

  /** Delete employee (admin) */
  delete: (id) => del(`/api/employees/${id}`, true),
};

// ═══════════════════════════════════════════════════════════════════════════════
// VISITS
// ═══════════════════════════════════════════════════════════════════════════════

export const visitsApi = {
  /**
   * Visitor check-in (PUBLIC — called from VisitorPage.jsx on form submit).
   * Maps exactly to your form fields.
   */
  checkIn: (formData) =>
    post('/api/visits/checkin', {
      visitorName:  formData.visitorName,
      visitorEmail: formData.visitorEmail,
      visitorPhone: formData.visitorPhone,
      companyName:  formData.companyName,
      hostName:     formData.hostName,
      purpose:      formData.purpose,
      locationId:   formData.locationId,
      timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).then((r) => r.data),

  /**
   * Get recent check-ins for sidebar on visitor page.
   * Returns last 5 visitors at that location today.
   */
  getRecent: (locationId) =>
    get(`/api/visits/recent/${locationId}`).then((r) => r.data),

  /** Admin dashboard stats */
  getStats: () => get('/api/visits/stats', true).then((r) => r.data),

  /**
   * Get all visits (admin).
   * Supports filters: { locationId, date, page, limit }
   */
  getAll: (filters = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    ).toString();
    return get(`/api/visits${qs ? '?' + qs : ''}`, true).then((r) => r.data);
  },

  /** Delete a visit record (admin) */
  delete: (id) => del(`/api/visits/${id}`, true),
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

export const loginHistoryApi = {
  /**
   * Get login history (admin).
   * Supports filters: { userType: 'visitor'|'admin'|'all', date, page, limit }
   */
  getAll: (filters = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    ).toString();
    return get(`/api/login-history${qs ? '?' + qs : ''}`, true).then((r) => r.data);
  },

  /** Record admin login (call this right after authApi.login succeeds) */
  recordAdminLogin: (timezone) =>
    post('/api/login-history/admin', { timezone }, true),

  /** Clear all login history (admin) */
  clearAll: () => del('/api/login-history', true),
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════════

export const healthCheck = () =>
  fetch(`${BASE_URL}/health`).then((r) => r.json());
