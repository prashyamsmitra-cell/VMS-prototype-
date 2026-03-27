const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  if (!rawBody) {
    return { data: null, rawBody: '' };
  }

  if (contentType.includes('application/json')) {
    try {
      return { data: JSON.parse(rawBody), rawBody };
    } catch (error) {
      throw new Error(`Backend returned invalid JSON (${response.status})`);
    }
  }

  return { data: null, rawBody };
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
      throw new Error('Backend unavailable. Check your deployed API URL and backend health.');
    }
    throw error;
  }

  const { data, rawBody } = await parseResponse(response);

  if (!response.ok) {
    const message = data?.errors
      ? data.errors.map((error) => error.msg).join(', ')
      : data?.message
        || rawBody
        || `Request failed (${response.status})`;
    throw new Error(message);
  }

  if (!data) {
    throw new Error(`Backend returned non-JSON response (${response.status}) from ${BASE_URL}${path}`);
  }

  return data;
}

const get = (path, auth = false) => request('GET', path, null, auth);
const post = (path, body, auth = false) => request('POST', path, body, auth);
const put = (path, body, auth = false) => request('PUT', path, body, auth);
const del = (path, auth = false) => request('DELETE', path, null, auth);

export const authApi = {
  login: async ({ username, password }) => {
    const response = await post('/api/auth/login', { username, password });
    localStorage.setItem('vms_token', response.data.token);
    localStorage.setItem('vms_admin', JSON.stringify(response.data.admin));
    return response.data;
  },

  me: () => get('/api/auth/me', true).then((response) => response.data),

  logout: () => {
    localStorage.removeItem('vms_token');
    localStorage.removeItem('vms_admin');
  },

  isLoggedIn: () => !!localStorage.getItem('vms_token'),
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
