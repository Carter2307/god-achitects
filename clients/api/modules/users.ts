import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type {
  CreateUserDto,
  UpdateUserDto,
  QueryUserParams,
  UsersResponse,
  UserResponse,
  MessageResponse,
} from '../types';

export function createUsersApi(http: HttpClient) {
  return {
    list(params?: QueryUserParams): Promise<UsersResponse> {
      return http.get(ENDPOINTS.users.list, { params: params as Record<string, unknown> });
    },

    get(id: string): Promise<UserResponse> {
      return http.get(ENDPOINTS.users.detail(id));
    },

    create(data: CreateUserDto): Promise<UserResponse> {
      return http.post(ENDPOINTS.users.list, { body: data });
    },

    update(id: string, data: UpdateUserDto): Promise<UserResponse> {
      return http.put(ENDPOINTS.users.detail(id), { body: data });
    },

    delete(id: string): Promise<MessageResponse> {
      return http.delete(ENDPOINTS.users.detail(id));
    },
  };
}

export type UsersApi = ReturnType<typeof createUsersApi>;
