const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PROTOTYPE_ADMIN = { id: 'prototype-admin', username: 'admin' };
const PROTOTYPE_PASSWORD = 'admin123';
const PROTOTYPE_SESSION_KEY = 'vms_prototype_mode';

function isPrototypeSession() {
  return localStorage.getItem(PROTOTYPE_SESSION_KEY) === 'true';
}

function startPrototypeSession() {
  localStorage.setItem(PROTOTYPE_SESSION_KEY, 'true');
  localStorage.setItem('vms_token', 'prototype-token');
  localStorage.setItem('vms_admin', JSON.stringify(PROTOTYPE_ADMIN));
}

async function request(method, path, body = null, requiresAuth = false) {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = localStorage.getItem('vms_token');
    if (!token) throw new Error('Not authenticated');
    headers.Authorization = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, config);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Backend unavailable. Prototype offline mode can still use admin/admin123.');
    }
    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data.errors
      ? data.errors.map((error) => error.msg).join(', ')
      : data.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

const get = (path, auth = false) => request('GET', path, null, auth);
const post = (path, body, auth = false) => request('POST', path, body, auth);
const put = (path, body, auth = false) => request('PUT', path, body, auth);
const del = (path, auth = false) => request('DELETE', path, null, auth);

export const authApi = {
  login: async ({ username, password }) => {
    try {
      const response = await post('/api/auth/login', { username, password });
      localStorage.removeItem(PROTOTYPE_SESSION_KEY);
      localStorage.setItem('vms_token', response.data.token);
      localStorage.setItem('vms_admin', JSON.stringify(response.data.admin));
      return response.data;
    } catch (error) {
      if (
        username.trim() === PROTOTYPE_ADMIN.username &&
        password === PROTOTYPE_PASSWORD &&
        /Backend unavailable|Failed to fetch/i.test(error.message)
      ) {
        startPrototypeSession();
        return { token: 'prototype-token', admin: PROTOTYPE_ADMIN };
      }
      throw error;
    }
  },

  me: () => {
    if (isPrototypeSession()) {
      return Promise.resolve({ admin: PROTOTYPE_ADMIN });
    }
    return get('/api/auth/me', true).then((response) => response.data);
  },

  logout: () => {
    localStorage.removeItem(PROTOTYPE_SESSION_KEY);
    localStorage.removeItem('vms_token');
    localStorage.removeItem('vms_admin');
  },

  isLoggedIn: () => !!localStorage.getItem('vms_token') || isPrototypeSession(),
};

export const locationsApi = {
  getAll: () => get('/api/locations').then((response) => response.data),
  getOne: (id) => get(`/api/locations/${id}`).then((response) => response.data),
  create: (data) => post('/api/locations', data, true).then((response) => response.data),
  update: (id, data) => put(`/api/locations/${id}`, data, true).then((response) => response.data),
  delete: (id) => del(`/api/locations/${id}`, true),
};

export const employeesApi = {
  getAll: (locationId = null) => {
    const query = locationId ? `?locationId=${locationId}` : '';
    return get(`/api/employees${query}`, true).then((response) => response.data);
  },

  getByLocation: (locationId) =>
    get(`/api/employees/by-location/${locationId}`).then((response) => response.data),

  create: (data) => post('/api/employees', data, true).then((response) => response.data),
  update: (id, data) => put(`/api/employees/${id}`, data, true).then((response) => response.data),
  delete: (id) => del(`/api/employees/${id}`, true),
};

export const visitsApi = {
  checkIn: (formData) =>
    post('/api/visits/checkin', {
      visitorName: formData.visitorName,
      visitorEmail: formData.visitorEmail,
      visitorPhone: formData.visitorPhone,
      companyName: formData.companyName,
      hostName: formData.hostName,
      purpose: formData.purpose,
      locationId: formData.locationId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).then((response) => response.data),

  getRecent: (locationId) =>
    get(`/api/visits/recent/${locationId}`).then((response) => response.data),

  getStats: () => get('/api/visits/stats', true).then((response) => response.data),

  getAll: (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
    ).toString();

    return get(`/api/visits${query ? `?${query}` : ''}`, true).then((response) => response.data);
  },

  delete: (id) => del(`/api/visits/${id}`, true),
};

export const loginHistoryApi = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
    ).toString();

    return get(`/api/login-history${query ? `?${query}` : ''}`, true).then((response) => response.data);
  },

  recordAdminLogin: (timezone) => post('/api/login-history/admin', { timezone }, true),
  clearAll: () => del('/api/login-history', true),
};
