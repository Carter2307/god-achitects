import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type {
  CreateReservationDto,
  UpdateReservationDto,
  QueryReservationParams,
  QueryAllReservationsParams,
  ReservationsResponse,
  ReservationsWithPaginationResponse,
  ReservationResponse,
  MessageResponse,
} from '../types';

export function createReservationsApi(http: HttpClient) {
  return {
    list(params?: QueryReservationParams): Promise<ReservationsResponse> {
      return http.get(ENDPOINTS.reservations.list, { params: params as Record<string, unknown> });
    },

    listAll(params?: QueryAllReservationsParams): Promise<ReservationsWithPaginationResponse> {
      return http.get(ENDPOINTS.reservations.listAll, {
        params: params as Record<string, unknown>,
      });
    },

    get(id: string): Promise<ReservationResponse> {
      return http.get(ENDPOINTS.reservations.detail(id));
    },

    create(data: CreateReservationDto): Promise<ReservationResponse> {
      return http.post(ENDPOINTS.reservations.list, { body: data });
    },

    update(id: string, data: UpdateReservationDto): Promise<ReservationResponse> {
      return http.put(ENDPOINTS.reservations.detail(id), { body: data });
    },

    cancel(id: string): Promise<MessageResponse> {
      return http.delete(ENDPOINTS.reservations.detail(id));
    },
  };
}

export type ReservationsApi = ReturnType<typeof createReservationsApi>;
