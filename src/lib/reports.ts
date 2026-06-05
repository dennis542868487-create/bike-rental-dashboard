import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { ReportMetric, ReportMetricGroup, ReportMetricKey } from '@/types/report';

const RENTAL_METRIC_KEYS: ReportMetricKey[] = [
  'daily-completed-rentals',
  'monthly-completed-rentals',
  'yearly-completed-rentals',
  'completed-rentals-total',
];

const REVENUE_METRIC_KEYS: ReportMetricKey[] = [
  'daily-revenue',
  'monthly-revenue',
  'yearly-revenue',
];

const PAYMENT_METRIC_KEYS: ReportMetricKey[] = [
  'paid-rentals',
  'unpaid-rentals',
  'waived-rentals',
  'refunded-rentals',
];

const OPERATIONS_METRIC_KEYS: ReportMetricKey[] = [
  'maintenance-needed-rentals',
  'incident-flag-rentals',
];

const WORKFLOW_METRIC_KEYS: ReportMetricKey[] = [
  'pending-submissions',
  'converted-submissions',
  'active-rentals-current',
];

function createMetric(metric: ReportMetric): ReportMetric {
  return metric;
}

function getUtcRangeStarts() {
  const now = new Date();

  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  return {
    startOfDay: startOfDay.toISOString(),
    startOfMonth: startOfMonth.toISOString(),
    startOfYear: startOfYear.toISOString(),
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(value);
}

export async function getReportMetrics(): Promise<ReportMetric[]> {
  const supabase = await createServerSupabaseClient();
  const { startOfDay, startOfMonth, startOfYear } = getUtcRangeStarts();

  const [
    { count: dailyCount },
    { count: monthlyCount },
    { count: yearlyCount },
    { data: dailyRevenueRows },
    { data: monthlyRevenueRows },
    { data: yearlyRevenueRows },
    { count: paidCount },
    { count: unpaidCount },
    { count: waivedCount },
    { count: refundedCount },
    { count: maintenanceNeededCount },
    { count: incidentFlagCount },
    { count: pendingSubmissionCount },
    { count: convertedSubmissionCount },
    { count: activeRentalCurrentCount },
    { count: completedRentalTotalCount },
  ] = await Promise.all([
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', startOfDay),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', startOfMonth),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', startOfYear),
    supabase.from('rentals').select('final_fee').eq('status', 'completed').gte('completed_at', startOfDay),
    supabase.from('rentals').select('final_fee').eq('status', 'completed').gte('completed_at', startOfMonth),
    supabase.from('rentals').select('final_fee').eq('status', 'completed').gte('completed_at', startOfYear),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'paid'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'unpaid'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'waived'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'refunded'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('maintenance_needed', true),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('incident_flag', true),
    supabase.from('customer_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('customer_submissions').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
  ]);

  const dailyRevenueData = (dailyRevenueRows ?? []) as Array<{ final_fee?: number | null }>;
  const monthlyRevenueData = (monthlyRevenueRows ?? []) as Array<{ final_fee?: number | null }>;
  const yearlyRevenueData = (yearlyRevenueRows ?? []) as Array<{ final_fee?: number | null }>;

  const dailyRevenue = dailyRevenueData.reduce((sum, row) => sum + Number(row.final_fee ?? 0), 0);
  const monthlyRevenue = monthlyRevenueData.reduce((sum, row) => sum + Number(row.final_fee ?? 0), 0);
  const yearlyRevenue = yearlyRevenueData.reduce((sum, row) => sum + Number(row.final_fee ?? 0), 0);

  return [
    createMetric({
      key: 'daily-completed-rentals',
      label: 'Daily Completed Rentals',
      value: String(dailyCount ?? 0),
      period: 'Today',
    }),
    createMetric({
      key: 'daily-revenue',
      label: 'Daily Revenue',
      value: formatCurrency(dailyRevenue),
      period: 'Today',
    }),
    createMetric({
      key: 'monthly-completed-rentals',
      label: 'Monthly Completed Rentals',
      value: String(monthlyCount ?? 0),
      period: 'This month',
    }),
    createMetric({
      key: 'monthly-revenue',
      label: 'Monthly Revenue',
      value: formatCurrency(monthlyRevenue),
      period: 'This month',
    }),
    createMetric({
      key: 'yearly-completed-rentals',
      label: 'Yearly Completed Rentals',
      value: String(yearlyCount ?? 0),
      period: 'This year',
    }),
    createMetric({
      key: 'yearly-revenue',
      label: 'Yearly Revenue',
      value: formatCurrency(yearlyRevenue),
      period: 'This year',
    }),
    createMetric({
      key: 'paid-rentals',
      label: 'Paid Rentals',
      value: String(paidCount ?? 0),
      period: 'Completed rentals',
    }),
    createMetric({
      key: 'unpaid-rentals',
      label: 'Unpaid Rentals',
      value: String(unpaidCount ?? 0),
      period: 'Completed rentals',
    }),
    createMetric({
      key: 'waived-rentals',
      label: 'Waived Rentals',
      value: String(waivedCount ?? 0),
      period: 'Completed rentals',
    }),
    createMetric({
      key: 'refunded-rentals',
      label: 'Refunded Rentals',
      value: String(refundedCount ?? 0),
      period: 'Completed rentals',
    }),
    createMetric({
      key: 'maintenance-needed-rentals',
      label: 'Maintenance Needed Rentals',
      value: String(maintenanceNeededCount ?? 0),
      period: 'Completed rentals',
    }),
    createMetric({
      key: 'incident-flag-rentals',
      label: 'Incident Flag Rentals',
      value: String(incidentFlagCount ?? 0),
      period: 'Completed rentals',
    }),
    createMetric({
      key: 'pending-submissions',
      label: 'Pending Submissions',
      value: String(pendingSubmissionCount ?? 0),
      period: 'Current workflow',
    }),
    createMetric({
      key: 'converted-submissions',
      label: 'Converted Submissions',
      value: String(convertedSubmissionCount ?? 0),
      period: 'Current workflow',
    }),
    createMetric({
      key: 'active-rentals-current',
      label: 'Active Rentals',
      value: String(activeRentalCurrentCount ?? 0),
      period: 'Current workflow',
    }),
    createMetric({
      key: 'completed-rentals-total',
      label: 'Completed Rentals Total',
      value: String(completedRentalTotalCount ?? 0),
      period: 'All time',
    }),
  ];
}

// ─── Structured summary for the redesigned Reports page ───────────────────

export type ReportRecentRental = {
  id: string;
  rentalNumber: string;
  customerName: string;
  bikeNumbers: string;
  completedAt: string;
  fee: string;
  paymentStatus: string;
};

export type ReportSummary = {
  periods: {
    today: { revenue: string; completedRentals: number };
    thisMonth: { revenue: string; completedRentals: number };
    thisYear: { revenue: string; completedRentals: number };
  };
  current: {
    activeRentals: number;
    pendingSubmissions: number;
    bikesInMaintenance: number;
  };
  allTime: {
    completedRentals: number;
  };
  payments: {
    paid: number;
    unpaid: number;
    waived: number;
    refunded: number;
  };
  operations: {
    maintenanceNeeded: number;
    incidentFlags: number;
  };
  recentRentals: ReportRecentRental[];
};

export async function getReportSummary(): Promise<ReportSummary> {
  const supabase = await createServerSupabaseClient();
  const { startOfDay, startOfMonth, startOfYear } = getUtcRangeStarts();

  const [
    { count: dailyCount },
    { count: monthlyCount },
    { count: yearlyCount },
    { data: dailyRevenueRows },
    { data: monthlyRevenueRows },
    { data: yearlyRevenueRows },
    { count: paidCount },
    { count: unpaidCount },
    { count: waivedCount },
    { count: refundedCount },
    { count: maintenanceNeededCount },
    { count: incidentFlagCount },
    { count: pendingSubmissionCount },
    { count: activeRentalCount },
    { count: completedTotalCount },
    { count: bikesInMaintenanceCount },
    { data: recentRentalsData },
  ] = await Promise.all([
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', startOfDay),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', startOfMonth),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', startOfYear),
    supabase.from('rentals').select('final_fee').eq('status', 'completed').gte('completed_at', startOfDay),
    supabase.from('rentals').select('final_fee').eq('status', 'completed').gte('completed_at', startOfMonth),
    supabase.from('rentals').select('final_fee').eq('status', 'completed').gte('completed_at', startOfYear),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'paid'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'unpaid'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'waived'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('payment_status', 'refunded'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('maintenance_needed', true),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed').eq('incident_flag', true),
    supabase.from('customer_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('bikes').select('*', { count: 'exact', head: true }).eq('status', 'maintenance').eq('is_archived', false),
    supabase
      .from('rentals')
      .select('id, rental_number, completed_at, final_fee, payment_status, customer:customers(first_name, last_name), rental_bikes(bike:bikes(bike_number))')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(8),
  ]);

  const sum = (rows: Array<{ final_fee?: number | null }>) =>
    rows.reduce((acc, r) => acc + Number(r.final_fee ?? 0), 0);

  const daily = (dailyRevenueRows ?? []) as Array<{ final_fee?: number | null }>;
  const monthly = (monthlyRevenueRows ?? []) as Array<{ final_fee?: number | null }>;
  const yearly = (yearlyRevenueRows ?? []) as Array<{ final_fee?: number | null }>;

  const recentRows = (recentRentalsData ?? []) as Array<{
    id: string;
    rental_number: string;
    completed_at: string;
    final_fee?: number | null;
    payment_status?: string | null;
    customer?: { first_name?: string | null; last_name?: string | null } | null;
    rental_bikes?: Array<{ bike?: { bike_number?: string | null } | null }> | null;
  }>;

  return {
    periods: {
      today: { revenue: formatCurrency(sum(daily)), completedRentals: dailyCount ?? 0 },
      thisMonth: { revenue: formatCurrency(sum(monthly)), completedRentals: monthlyCount ?? 0 },
      thisYear: { revenue: formatCurrency(sum(yearly)), completedRentals: yearlyCount ?? 0 },
    },
    current: {
      activeRentals: activeRentalCount ?? 0,
      pendingSubmissions: pendingSubmissionCount ?? 0,
      bikesInMaintenance: bikesInMaintenanceCount ?? 0,
    },
    allTime: { completedRentals: completedTotalCount ?? 0 },
    payments: {
      paid: paidCount ?? 0,
      unpaid: unpaidCount ?? 0,
      waived: waivedCount ?? 0,
      refunded: refundedCount ?? 0,
    },
    operations: {
      maintenanceNeeded: maintenanceNeededCount ?? 0,
      incidentFlags: incidentFlagCount ?? 0,
    },
    recentRentals: recentRows.map((row) => ({
      id: row.id,
      rentalNumber: row.rental_number,
      customerName: `${row.customer?.first_name ?? ''} ${row.customer?.last_name ?? ''}`.trim() || '—',
      bikeNumbers: row.rental_bikes?.map((rb) => rb.bike?.bike_number ?? '').filter(Boolean).join(', ') ?? '—',
      completedAt: row.completed_at,
      fee: row.final_fee != null ? formatCurrency(Number(row.final_fee)) : '$0.00',
      paymentStatus: row.payment_status ?? 'unpaid',
    })),
  };
}

export async function getReportMetricGroups(): Promise<ReportMetricGroup[]> {
  const items = await getReportMetrics();

  return [
    {
      key: 'rental-metrics',
      title: 'Rental Metrics',
      items: items.filter((item) => RENTAL_METRIC_KEYS.includes(item.key)),
    },
    {
      key: 'revenue-metrics',
      title: 'Revenue Metrics',
      items: items.filter((item) => REVENUE_METRIC_KEYS.includes(item.key)),
    },
    {
      key: 'payment-metrics',
      title: 'Payment Metrics',
      items: items.filter((item) => PAYMENT_METRIC_KEYS.includes(item.key)),
    },
    {
      key: 'operations-metrics',
      title: 'Operations Metrics',
      items: items.filter((item) => OPERATIONS_METRIC_KEYS.includes(item.key)),
    },
    {
      key: 'workflow-metrics',
      title: 'Workflow Metrics',
      items: items.filter((item) => WORKFLOW_METRIC_KEYS.includes(item.key)),
    },
  ];
}
