import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type {
  QueryDashboardParams,
  QueryPopularSpotsParams,
  DashboardMetrics,
  DailyUsageResponse,
  PopularSpotsResponse,
} from '../types';

export function createDashboardApi(http: HttpClient) {
  return {
    getMetrics(params?: QueryDashboardParams): Promise<DashboardMetrics> {
      return http.get(ENDPOINTS.dashboard.metrics, {
        params: params as Record<string, unknown>,
      });
    },

    getUsageByDay(params?: QueryDashboardParams): Promise<DailyUsageResponse> {
      return http.get(ENDPOINTS.dashboard.usageByDay, {
        params: params as Record<string, unknown>,
      });
    },

    getPopularSpots(params?: QueryPopularSpotsParams): Promise<PopularSpotsResponse> {
      return http.get(ENDPOINTS.dashboard.popularSpots, {
        params: params as Record<string, unknown>,
      });
    },
  };
}

export type DashboardApi = ReturnType<typeof createDashboardApi>;
