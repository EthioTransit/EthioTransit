const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('ethiotransit_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    data: null as any,
    message: 'Network response was not valid JSON.',
  }));

  if (!response.ok || !data.success) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error: any = new Error(errorMsg);
    error.code = data.code;
    error.status = response.status;
    throw error;
  }

  return data.data;
}
