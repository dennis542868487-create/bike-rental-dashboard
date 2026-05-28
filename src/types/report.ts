export type ReportMetricKey =
  | 'daily-completed-rentals'
  | 'daily-revenue'
  | 'monthly-completed-rentals'
  | 'monthly-revenue'
  | 'yearly-completed-rentals'
  | 'yearly-revenue'
  | 'paid-rentals'
  | 'unpaid-rentals'
  | 'waived-rentals'
  | 'refunded-rentals'
  | 'maintenance-needed-rentals'
  | 'incident-flag-rentals'
  | 'pending-submissions'
  | 'converted-submissions'
  | 'active-rentals-current'
  | 'completed-rentals-total';

export type ReportMetricGroupKey = 'rental-metrics' | 'revenue-metrics' | 'payment-metrics' | 'operations-metrics' | 'workflow-metrics';

export type ReportMetric = {
  key: ReportMetricKey;
  label: string;
  value: string;
  period: string;
};

export type ReportMetricGroup = {
  key: ReportMetricGroupKey;
  title: string;
  items: ReportMetric[];
};
