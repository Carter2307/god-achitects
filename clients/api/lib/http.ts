import type { AuthResponse } from '../types';
import { ENDPOINTS } from './endpoints';

export interface HttpClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  onTokenRefresh?: (tokens: AuthResponse) => void;
  onUnauthorized?: () => void;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export interface RequestOptions {
  body?: unknown;
  params?: Record<string, unknown>;
  requireAuth?: boolean;
}

export function createHttpClient(config: HttpClientConfig) {
  const { baseUrl, getAccessToken, getRefreshToken, onTokenRefresh, onUnauthorized } = config;

  let isRefreshing = false;
  let refreshPromise: Promise<AuthResponse> | null = null;

  async function refreshTokens(): Promise<AuthResponse> {
    const refreshToken = getRefreshToken?.();
    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token available');
    }

    const response = await fetch(`${baseUrl}${ENDPOINTS.auth.refresh}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || 'Token refresh failed',
        errorData,
      );
    }

    return response.json();
  }

  async function request<T>(
    method: string,
    endpoint: string,
    options?: RequestOptions,
    isRetry = false,
  ): Promise<T> {
    const { body, params, requireAuth = true } = options || {};
    const url = `${baseUrl}${endpoint}${buildQueryString(params)}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requireAuth && getAccessToken) {
      const token = getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // Handle 401 with automatic token refresh
      if (response.status === 401 && requireAuth && !isRetry && getRefreshToken) {
        try {
          // Prevent multiple simultaneous refresh requests
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshTokens();
          }

          if (!refreshPromise) {
            throw new ApiError(401, 'Refresh promise is null');
          }

          const newTokens = await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;

          // Notify about new tokens
          onTokenRefresh?.(newTokens);

          // Retry the original request with the new token
          return request<T>(method, endpoint, options, true);
        } catch (refreshError) {
          isRefreshing = false;
          refreshPromise = null;
          onUnauthorized?.();
          throw refreshError;
        }
      }

      if (response.status === 401) {
        onUnauthorized?.();
      }

      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `Request failed with status ${response.status}`,
        errorData,
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  return {
    get<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
      return request<T>('GET', endpoint, options);
    },
    post<T>(endpoint: string, options?: RequestOptions): Promise<T> {
      return request<T>('POST', endpoint, options);
    },
    put<T>(endpoint: string, options?: RequestOptions): Promise<T> {
      return request<T>('PUT', endpoint, options);
    },
    delete<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
      return request<T>('DELETE', endpoint, options);
    },
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
