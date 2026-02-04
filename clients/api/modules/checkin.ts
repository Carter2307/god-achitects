import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type { CheckInResponse } from '../types';

export function createCheckinApi(http: HttpClient) {
  return {
    bySpotNumber(spotNumber: string): Promise<CheckInResponse> {
      return http.post(ENDPOINTS.checkin.bySpotNumber(spotNumber));
    },

    byReservationId(reservationId: string): Promise<CheckInResponse> {
      return http.post(ENDPOINTS.checkin.byReservationId(reservationId));
    },
  };
}

export type CheckinApi = ReturnType<typeof createCheckinApi>;
