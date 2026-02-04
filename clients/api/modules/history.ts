import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type { QueryHistoryParams, QueryAllHistoryParams, HistoryResponse } from '../types';

export function createHistoryApi(http: HttpClient) {
  return {
    list(params?: QueryHistoryParams): Promise<HistoryResponse> {
      return http.get(ENDPOINTS.history.list, { params: params as Record<string, unknown> });
    },

    listAll(params?: QueryAllHistoryParams): Promise<HistoryResponse> {
      return http.get(ENDPOINTS.history.listAll, { params: params as Record<string, unknown> });
    },
  };
}

export type HistoryApi = ReturnType<typeof createHistoryApi>;
