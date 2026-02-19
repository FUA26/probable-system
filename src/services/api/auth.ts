import apiClient from './base';
import { LoginRequest, LoginResponse, TokenCheckResponse, UserProfile } from '../../types/auth';

export const authAPI = {
  /**
   * Login with NIP and device ID
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ profile: UserProfile }> {
    const response = await apiClient.get<{ profile: UserProfile }>('/auth/me');
    return response.data;
  },

  /**
   * Check token validity
   */
  async checkToken(): Promise<TokenCheckResponse> {
    const response = await apiClient.get<TokenCheckResponse>('/auth/check');
    return response.data;
  },

  /**
   * Logout (stateless, client-side only)
   */
  async logout(): Promise<{ ok: boolean }> {
    const response = await apiClient.post<{ ok: boolean }>('/auth/logout');
    return response.data;
  },
};