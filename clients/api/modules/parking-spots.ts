import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type {
  CreateParkingSpotDto,
  UpdateParkingSpotDto,
  QueryParkingSpotParams,
  QueryAvailableSpotsParams,
  ParkingSpotsResponse,
  ParkingSpotResponse,
  MessageResponse,
} from '../types';

export function createParkingSpotsApi(http: HttpClient) {
  return {
    list(params?: QueryParkingSpotParams): Promise<ParkingSpotsResponse> {
      return http.get(ENDPOINTS.parkingSpots.list, { params: params as Record<string, unknown> });
    },

    get(id: string): Promise<ParkingSpotResponse> {
      return http.get(ENDPOINTS.parkingSpots.detail(id));
    },

    getAvailable(params?: QueryAvailableSpotsParams): Promise<ParkingSpotsResponse> {
      return http.get(ENDPOINTS.parkingSpots.available, {
        params: params as Record<string, unknown>,
      });
    },

    create(data: CreateParkingSpotDto): Promise<ParkingSpotResponse> {
      return http.post(ENDPOINTS.parkingSpots.list, { body: data });
    },

    update(id: string, data: UpdateParkingSpotDto): Promise<ParkingSpotResponse> {
      return http.put(ENDPOINTS.parkingSpots.detail(id), { body: data });
    },

    delete(id: string): Promise<MessageResponse> {
      return http.delete(ENDPOINTS.parkingSpots.detail(id));
    },
  };
}

export type ParkingSpotsApi = ReturnType<typeof createParkingSpotsApi>;
