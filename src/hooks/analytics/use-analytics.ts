import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { analyticsService } from '@/services/analytics/analytics.service';
import type { 
  DashboardSummaryData, 
  DashboardStatsData,
  AnalyticsError 
} from '@/types/analytics/analytics.types';

interface UseAnalyticsState {
  summary: DashboardSummaryData | null;
  stats: DashboardStatsData | null;
  summaryLoading: boolean;
  statsLoading: boolean;
  summaryError: AnalyticsError | null;
  statsError: AnalyticsError | null;
}

export const useAnalytics = () => {
  const [state, setState] = useState<UseAnalyticsState>({
    summary: null,
    stats: null,
    summaryLoading: true,
    statsLoading: true,
    summaryError: null,
    statsError: null,
  });

  const fetchSummary = useCallback(async (showToast = false) => {
    try {
      setState(prev => ({ ...prev, summaryLoading: true, summaryError: null }));
      const response = await analyticsService.getDashboardSummary();
      setState(prev => ({ 
        ...prev, 
        summary: response.data, 
        summaryLoading: false 
      }));
      if (showToast) {
        toast.success('Dashboard data refreshed successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard summary';
      setState(prev => ({ 
        ...prev, 
        summaryError: { message: errorMessage }, 
        summaryLoading: false 
      }));
      if (showToast) {
        toast.error(`Failed to refresh dashboard: ${errorMessage}`);
      }
    }
  }, []);

  const fetchStats = useCallback(async (showToast = false) => {
    try {
      setState(prev => ({ ...prev, statsLoading: true, statsError: null }));
      const response = await analyticsService.getDashboardStats();
      setState(prev => ({ 
        ...prev, 
        stats: response.data, 
        statsLoading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
      setState(prev => ({ 
        ...prev, 
        statsError: { message: errorMessage }, 
        statsLoading: false 
      }));
      if (showToast) {
        toast.error(`Failed to refresh stats: ${errorMessage}`);
      }
    }
  }, []);

  const refetchSummary = useCallback(() => {
    fetchSummary(true);
  }, [fetchSummary]);

  const refetchStats = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  const refetchAll = useCallback(() => {
    fetchSummary(true);
    fetchStats(true);
  }, [fetchSummary, fetchStats]);

  useEffect(() => {
    fetchSummary(false);
    fetchStats(false);
  }, [fetchSummary, fetchStats]);

  return {
    // Summary data
    summary: state.summary,
    summaryLoading: state.summaryLoading,
    summaryError: state.summaryError,
    refetchSummary,
    
    // Stats data
    stats: state.stats,
    statsLoading: state.statsLoading,
    statsError: state.statsError,
    refetchStats,
    
    // Combined states
    isLoading: state.summaryLoading || state.statsLoading,
    hasError: !!state.summaryError || !!state.statsError,
    error: state.summaryError || state.statsError,
    refetchAll,
  };
};