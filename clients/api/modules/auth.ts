import type { HttpClient } from '../lib/http';
import { ENDPOINTS } from '../lib/endpoints';
import type {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  AuthResponse,
  UserResponse,
  MessageResponse,
} from '../types';

export function createAuthApi(http: HttpClient) {
  return {
    register(data: RegisterDto): Promise<AuthResponse> {
      return http.post(ENDPOINTS.auth.register, { body: data, requireAuth: false });
    },

    login(data: LoginDto): Promise<AuthResponse> {
      return http.post(ENDPOINTS.auth.login, { body: data, requireAuth: false });
    },

    refresh(data: RefreshTokenDto): Promise<AuthResponse> {
      return http.post(ENDPOINTS.auth.refresh, { body: data, requireAuth: false });
    },

    logout(data?: RefreshTokenDto): Promise<MessageResponse> {
      return http.post(ENDPOINTS.auth.logout, { body: data });
    },

    me(): Promise<UserResponse> {
      return http.get(ENDPOINTS.auth.me);
    },
  };
}

export type AuthApi = ReturnType<typeof createAuthApi>;
