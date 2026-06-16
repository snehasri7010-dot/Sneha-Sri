const AUTH_STORAGE_KEY = 'drivehub_auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getApiBaseUrl = () => API_BASE_URL;

export const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const decodeJwtPayload = (token) => {
  if (!token) return null;

  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;

    const normalized = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(''),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getDashboardPath = (role) => {
  const normalized = role?.toLowerCase?.() || '';
  if (normalized.includes('admin')) return '/admin-dashboard';
  if (normalized.includes('owner')) return '/owner-dashboard';
  if (normalized.includes('renter')) return '/renter-dashboard';
  return '/login';
};

export const getStoredAuth = () => {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY) || window.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getCurrentUser = () => getStoredAuth()?.user ?? null;

export const getToken = () => getStoredAuth()?.token ?? null;

export const getCurrentRole = () => {
  const user = getCurrentUser();
  if (user?.role) {
    return user.role;
  }

  const token = getToken();
  return decodeJwtPayload(token)?.role ?? null;
};

export const setAuthData = ({ token, user }, remember = true) => {
  const authPayload = { token, user };
  const raw = JSON.stringify(authPayload);

  if (remember) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, raw);
  } else {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, raw);
  }

  return authPayload;
};

export const updateStoredUser = (updates = {}) => {
  const current = getStoredAuth();
  if (!current?.token || !current?.user) return null;

  const nextPayload = {
    ...current,
    user: {
      ...current.user,
      ...updates,
    },
  };
  const raw = JSON.stringify(nextPayload);

  if (window.localStorage.getItem(AUTH_STORAGE_KEY)) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, raw);
  } else {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, raw);
  }

  return nextPayload.user;
};

export const clearAuthData = () => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (response.status === 401) {
    clearAuthData();
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || (Array.isArray(payload?.errors) && payload.errors[0]?.msg);
    throw new Error(message || 'Request failed');
  }

  return payload;
};

export const registerRequest = async ({
  fullName,
  email,
  mobileNumber,
  username,
  password,
  confirmPassword,
  role,
}) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName,
      email,
      mobileNumber,
      username,
      password,
      confirmPassword,
      role: role?.toLowerCase?.(),
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Registration failed');
  }

  if (!payload || !payload.token || !payload.user) {
    throw new Error('Registration response did not contain valid auth data.');
  }

  return payload;
};

export const loginRequest = async ({ emailOrUsername, username, email, userName, loginId, password }) => {
  const requestBody = {
    emailOrUsername: (emailOrUsername ?? username ?? email ?? userName ?? loginId ?? '').trim(),
    password,
  };

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || payload.error || 'Login failed');
  }

  if (!payload || !payload.token || !payload.user) {
    throw new Error('Login response did not contain valid auth data.');
  }

  return payload;
};
