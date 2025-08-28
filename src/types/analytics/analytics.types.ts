export interface DashboardStatistics {
  students_count: number;
  verified_users_count: number;
  total_users_count: number;
  unverified_users_count: number;
  admin_users_count: number;
  regular_users_count: number;
}

export interface DashboardDateTime {
  current_date: string;
  current_time: string;
  formatted_datetime: string;
  human_readable: string;
  timezone: string;
}

export interface ChartDataItem {
  year?: number;
  campus?: string;
  school?: string;
  semester?: string;
  count: number;
}

export interface PercentageChartItem {
  label: string;
  value: number;
  percentage: number;
}

export interface DashboardCharts {
  students_by_year: ChartDataItem[];
  students_by_campus: ChartDataItem[];
  students_by_school: ChartDataItem[];
  users_verification: PercentageChartItem[];
  users_role: PercentageChartItem[];
}

export interface DashboardSummaryData {
  statistics: DashboardStatistics;
  datetime: DashboardDateTime;
  charts: DashboardCharts;
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummaryData;
  message: string;
}

export interface RecentActivity {
  users_last_week: number;
  users_last_month: number;
}

export interface AdditionalCharts {
  students_by_semester: ChartDataItem[];
}

export interface DashboardStatsData {
  recent_activity: RecentActivity;
  additional_charts: AdditionalCharts;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStatsData;
  message: string;
}

export interface AnalyticsError {
  message: string;
  code?: string;
}