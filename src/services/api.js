// ─────────────────────────────────────────────────────────────
// api.js  –  Central API service for Skill Swap frontend
// All calls go to http://localhost:5000/api
// ─────────────────────────────────────────────────────────────

const BASE = 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────
export const getToken  = ()        => localStorage.getItem('ss_token');
export const setToken  = (token)   => localStorage.setItem('ss_token', token);
export const clearToken = ()       => localStorage.removeItem('ss_token');

// ── Base fetch wrapper ────────────────────────────────────────
const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
};

// ── Users / Profile ───────────────────────────────────────────
export const usersAPI = {
  /** Fetch your own full profile (protected) */
  getMe:        ()       => request('/users/me'),

  /** Update your own profile fields (protected) */
  updateMe:     (body)   => request('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),

  /** Add a skill to your profile */
  addSkill:     (body)   => request('/users/me/skills', { method: 'POST', body: JSON.stringify(body) }),

  /** Remove a skill by id */
  removeSkill:  (id)     => request(`/users/me/skills/${id}`, { method: 'DELETE' }),

  /** Fetch any public profile */
  getUser:      (id)     => request(`/users/${id}`),

  /** Rate a user (score 1-5) */
  rateUser:     (id, body) => request(`/users/${id}/rate`, { method: 'POST', body: JSON.stringify(body) }),

  /** List all users, optionally filtered by skill */
  listUsers:    (skill)  => request(skill ? `/users?skill=${encodeURIComponent(skill)}` : '/users'),
};

// ── Health ────────────────────────────────────────────────────
export const healthCheck = () => request('/health');
