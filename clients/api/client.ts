import { createHttpClient, type HttpClientConfig } from './lib/http';
import { createAuthApi, type AuthApi } from './modules';
import { createUsersApi, type UsersApi } from './modules';
import { createParkingSpotsApi, type ParkingSpotsApi } from './modules';
import { createReservationsApi, type ReservationsApi } from './modules';
import { createCheckinApi, type CheckinApi } from './modules';
import { createHistoryApi, type HistoryApi } from './modules';
import { createDashboardApi, type DashboardApi } from './modules';
import { createEmailQueueApi, type EmailQueueApi } from './modules';
import { createJobsApi, type JobsApi } from './modules';

export type { HttpClientConfig as ApiClientConfig } from './lib/http';
export { ApiError } from './lib/http';

export interface ApiClient {
  auth: AuthApi;
  users: UsersApi;
  parkingSpots: ParkingSpotsApi;
  reservations: ReservationsApi;
  checkin: CheckinApi;
  history: HistoryApi;
  dashboard: DashboardApi;
  emailQueue: EmailQueueApi;
  jobs: JobsApi;
}

export function createApiClient(config: HttpClientConfig): ApiClient {
  const http = createHttpClient(config);

  return {
    auth: createAuthApi(http),
    users: createUsersApi(http),
    parkingSpots: createParkingSpotsApi(http),
    reservations: createReservationsApi(http),
    checkin: createCheckinApi(http),
    history: createHistoryApi(http),
    dashboard: createDashboardApi(http),
    emailQueue: createEmailQueueApi(http),
    jobs: createJobsApi(http),
  };
}
