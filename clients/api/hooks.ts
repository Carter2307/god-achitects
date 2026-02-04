/**
 * React hooks for the API client
 *
 * Usage with React Query:
 *
 * ```tsx
 * import { useQuery, useMutation } from '@tanstack/react-query';
 * import { createApiClient } from './client';
 * import { queryKeys, mutationFns } from './hooks';
 *
 * const api = createApiClient({ baseUrl: 'http://localhost:3000' });
 *
 * // In a component:
 * const { data } = useQuery({
 *   queryKey: queryKeys.reservations.list(),
 *   queryFn: () => api.reservations.list(),
 * });
 * ```
 */

// Query keys for React Query
export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  users: {
    all: () => ['users'] as const,
    list: (params?: Record<string, unknown>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },

  parkingSpots: {
    all: () => ['parkingSpots'] as const,
    list: (params?: Record<string, unknown>) => ['parkingSpots', 'list', params] as const,
    detail: (id: string) => ['parkingSpots', 'detail', id] as const,
    available: (params?: Record<string, unknown>) => ['parkingSpots', 'available', params] as const,
  },

  reservations: {
    all: () => ['reservations'] as const,
    list: (params?: Record<string, unknown>) => ['reservations', 'list', params] as const,
    listAll: (params?: Record<string, unknown>) => ['reservations', 'listAll', params] as const,
    detail: (id: string) => ['reservations', 'detail', id] as const,
  },

  history: {
    all: () => ['history'] as const,
    list: (params?: Record<string, unknown>) => ['history', 'list', params] as const,
    listAll: (params?: Record<string, unknown>) => ['history', 'listAll', params] as const,
  },

  dashboard: {
    all: () => ['dashboard'] as const,
    metrics: (params?: Record<string, unknown>) => ['dashboard', 'metrics', params] as const,
    usageByDay: (params?: Record<string, unknown>) => ['dashboard', 'usageByDay', params] as const,
    popularSpots: (params?: Record<string, unknown>) =>
      ['dashboard', 'popularSpots', params] as const,
  },

  emailQueue: {
    all: () => ['emailQueue'] as const,
    list: (params?: Record<string, unknown>) => ['emailQueue', 'list', params] as const,
  },
} as const;

// Invalidation helpers
export const invalidateKeys = {
  users: () => queryKeys.users.all(),
  parkingSpots: () => queryKeys.parkingSpots.all(),
  reservations: () => queryKeys.reservations.all(),
  history: () => queryKeys.history.all(),
  dashboard: () => queryKeys.dashboard.all(),
  emailQueue: () => queryKeys.emailQueue.all(),
} as const;
