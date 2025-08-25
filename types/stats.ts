// Dashboard stats types
export type DashboardPeriod =
  | "today"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "last30Days"
  | "last365Days"
  | "oldestDate";

export interface StatItem {
  all: number;
  current: number;
  previous: number;
}

export interface DashboardStatsData {
  properties: StatItem;
  tenants: StatItem;
  payments: StatItem;
  dueProperties: number;
}

export interface SuperDashboardStatsData {
  properties: StatItem;
  tenants: StatItem;
  admins: StatItem;
  payments: StatItem;
}

export interface SuperDashboardStatsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: SuperDashboardStatsData;
}

export interface DashboardStatsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: DashboardStatsData;
}

export interface DashboardStatsParams {
  period?: DashboardPeriod;
}
