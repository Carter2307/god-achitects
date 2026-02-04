const API_PREFIX = '/api';

export const ENDPOINTS = {
  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    refresh: `${API_PREFIX}/auth/refresh`,
    logout: `${API_PREFIX}/auth/logout`,
    me: `${API_PREFIX}/auth/me`,
  },

  users: {
    list: `${API_PREFIX}/users`,
    detail: (id: string) => `${API_PREFIX}/users/${id}`,
  },

  parkingSpots: {
    list: `${API_PREFIX}/parking-spots`,
    available: `${API_PREFIX}/parking-spots/available`,
    detail: (id: string) => `${API_PREFIX}/parking-spots/${id}`,
  },

  reservations: {
    list: `${API_PREFIX}/reservations`,
    listAll: `${API_PREFIX}/reservations/all`,
    detail: (id: string) => `${API_PREFIX}/reservations/${id}`,
  },

  checkin: {
    bySpotNumber: (spotNumber: string) => `${API_PREFIX}/checkin/${spotNumber}`,
    byReservationId: (reservationId: string) => `${API_PREFIX}/checkin/reservation/${reservationId}`,
  },

  history: {
    list: `${API_PREFIX}/history`,
    listAll: `${API_PREFIX}/history/all`,
  },

  dashboard: {
    metrics: `${API_PREFIX}/dashboard/metrics`,
    usageByDay: `${API_PREFIX}/dashboard/usage-by-day`,
    popularSpots: `${API_PREFIX}/dashboard/popular-spots`,
  },

  emailQueue: {
    list: `${API_PREFIX}/email-queue`,
    retry: (id: string) => `${API_PREFIX}/email-queue/retry/${id}`,
  },

  jobs: {
    expireReservations: `${API_PREFIX}/jobs/expire-reservations`,
  },
} as const;
