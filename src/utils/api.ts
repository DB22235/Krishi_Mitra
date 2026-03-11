// src/utils/api.ts
// Centralised API helper — every authenticated request goes through here.

const API_BASE = 'http://localhost:5000';

/** Read the JWT from localStorage (set during login / signup). */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/** Generic fetch wrapper that automatically attaches the Bearer token. */
async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const errMsg = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(errMsg);
  }

  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
  message: string;
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return apiFetch<{ user: { id: string; name: string; email: string } }>('/api/auth/me');
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface ProfileData {
  name?: string;
  mobile?: string;
  age?: string | number;
  gender?: string;
  state?: string;
  district?: string;
  village?: string;
  profileImage?: string | null;
  caste?: string;
  category?: string;
  annualIncome?: string;
  incomeSource?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  pmKisanStatus?: string;
  landSize?: number;
  landUnit?: string;
  landOwnership?: string;
  soilType?: string;
  livestock?: string;
  selectedCrops?: string[];
  selectedSeasons?: string[];
  irrigation?: string[];
  aadhaar?: string | null;
  aadhaarVerified?: boolean;
  documents?: Record<string, string>;
  memberSince?: string;
}

export async function saveProfile(data: ProfileData) {
  return apiFetch<{ ok: boolean; profile: any }>('/api/profile/save', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loadProfile() {
  return apiFetch<{ exists: boolean; profile: any }>('/api/profile/me');
}

export async function getProfileCompletion() {
  return apiFetch<{ completion: number; filled: number; total: number }>(
    '/api/profile/completion'
  );
}
