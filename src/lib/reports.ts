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

  const dailyRevenue = (dailyRevenueRows ?? []).reduce((sum, row) => sum + Number(row.final_fee ?? 0), 0);
  const monthlyRevenue = (monthlyRevenueRows ?? []).reduce((sum, row) => sum + Number(row.final_fee ?? 0), 0);
  const yearlyRevenue = (yearlyRevenueRows ?? []).reduce((sum, row) => sum + Number(row.final_fee ?? 0), 0);

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
