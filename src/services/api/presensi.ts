import apiClient from './base';
import { AttendanceSubmitData, AttendanceSubmitResponse, AttendanceHistoryResponse } from '../../types/presensi';

export const presensiAPI = {
  /**
   * Submit attendance (check-in/check-out)
   */
  async submit(data: FormData): Promise<AttendanceSubmitResponse> {
    const response = await apiClient.post<AttendanceSubmitResponse>('/presensi/submit', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get attendance history (last 30 days)
   */
  async getHistory(): Promise<AttendanceHistoryResponse> {
    const response = await apiClient.get<AttendanceHistoryResponse>('/presensi/history');
    return response.data;
  },
};
