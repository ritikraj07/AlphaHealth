// shared/types/analytics.types.ts
export type GroupBy = "day" | "week" | "month" | "quarter";

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export interface AnalyticsData {
  summary: Summary;
  trend: TrendItem[];
  comparison: any | null;
  advanced: AdvancedAnalytics;
}

export interface Summary {
  totalSales: number;
  totalVisits: number;
  totalOrders: number;
  conversionRate: number;
  revenuePerVisit: number;
  averageOrderValue: number;
  growthRate: number | null;
}

export interface TrendItem {
  _id: string; // ISO date string
  totalSales: number;
  totalOrders: number;
}

export interface AdvancedAnalytics {
  topProducts: ProductSummary[];
  topEmployees: TopEmployee[];
  retentionRate: number;
  territoryRanking: TerritoryItem[];
  incentiveLeaderboard: IncentiveItem[];
}

export interface ProductSummary {
  _id?: string;
  name?: string;
  totalRevenue?: number;
  totalQuantity?: number;
  [k: string]: any;
}

export interface TopEmployee {
  _id: string;
  totalSales: number;
  totalOrders: number;
  employee: Employee;
}

export interface TerritoryItem {
  _id?: string;
  totalSales?: number;
  hq?: any;
  [k: string]: any;
}

export interface IncentiveItem {
  employee: string;
  totalSales: number;
  visitCount: number;
  conversion: number;
  score: number;
}

export interface Employee {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  hq?: string;
  phone?: string;
  designation?: string;
  employmentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
}

export interface Performance {
  daysWorked: number;
  workingPercent: string;
  callsCompleted: number;
  avgCallsPerDay: string;
  pobValue: number;
  coverage: string;
}

export interface CallPerformance {
  coverageRate: string;
  completedCalls: number;
  plannedCalls: number;
  missedCalls: number;
  executionRate: string;
  highPotentialFrequency: string;
}

export interface DoctorCoverage {
  doctorName: string;
  targetFrequency: number;
  plannedVisits: number;
  actualVisits: number;
}

export interface Sales {
  pobValue: number;
  orders: number;
  conversionRate: string;
}

export interface ActivityBreakdown {
  doctorVisits: number;
  chemistVisits: number;
  totalVisits: number;
}

export interface TopDoctor {
  _id: string;
  visits: number;
  name: string;
}

export interface TodayStatus {
  attendance: string | null;
  plansToday: number;
}

export interface EmployeeDashboardResponse {
  success: boolean;
  performance: Performance;
  callPerformance: CallPerformance;
  doctorCoverageAnalysis: DoctorCoverage[];
  sales: Sales;
  activityBreakdown: ActivityBreakdown;
  topDoctors: TopDoctor[];
  todayStatus: TodayStatus;
}


// 12345678888888888888

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export interface AnalyticsData {
  summary: Summary;
  trend: TrendItem[];
  comparison: any | null;
  advanced: AdvancedAnalytics;
}

export interface Summary {
  totalSales: number;
  totalVisits: number;
  totalOrders: number;
  conversionRate: number;
  revenuePerVisit: number;
  averageOrderValue: number;
  growthRate: number | null;
}

export interface TrendItem {
  _id: string;
  totalSales: number;
  totalOrders: number;
}

export interface AdvancedAnalytics {
  topProducts: any[];
  topEmployees: TopEmployee[];
  retentionRate: number;
  territoryRanking: any[];
  incentiveLeaderboard: IncentiveItem[];
}

export interface TopEmployee {
  _id: string;
  totalSales: number;
  totalOrders: number;
  employee: Employee;
}

export interface IncentiveItem {
  employee: string;
  totalSales: number;
  visitCount: number;
  conversion: number;
  score: number;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  hq: string;
  phone: string;
  designation: string;
  employmentStatus: string;
  createdAt: string;
  updatedAt: string;
}
