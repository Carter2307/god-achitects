import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type { QueryEmailQueueParams, EmailQueueResponse, MessageResponse } from '../types';

export function createEmailQueueApi(http: HttpClient) {
  return {
    list(params?: QueryEmailQueueParams): Promise<EmailQueueResponse> {
      return http.get(ENDPOINTS.emailQueue.list, { params: params as Record<string, unknown> });
    },

    retry(id: string): Promise<MessageResponse> {
      return http.post(ENDPOINTS.emailQueue.retry(id));
    },
  };
}

export type EmailQueueApi = ReturnType<typeof createEmailQueueApi>;
