import { APIinstance } from '@/api/baseAPI';
import type { 
  DashboardSummaryResponse, 
  DashboardStatsResponse 
} from '@/types/analytics/analytics.types';

export const analyticsService = {
  /**
   * Get dashboard summary data including statistics, datetime, and charts
   */
  getDashboardSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await APIinstance.get<DashboardSummaryResponse>('/dashboard/summary');
    return response.data;
  },

  /**
   * Get detailed dashboard statistics including recent activity and additional charts
   */
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await APIinstance.get<DashboardStatsResponse>('/dashboard/stats');
    return response.data;
  },
};