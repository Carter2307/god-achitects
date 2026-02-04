import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type { ExpireReservationsResponse } from '../types';

export function createJobsApi(http: HttpClient) {
  return {
    expireReservations(): Promise<ExpireReservationsResponse> {
      return http.post(ENDPOINTS.jobs.expireReservations);
    },
  };
}

export type JobsApi = ReturnType<typeof createJobsApi>;
