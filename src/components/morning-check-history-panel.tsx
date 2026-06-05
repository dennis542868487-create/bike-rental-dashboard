import { MorningCheckHistoryTable } from '@/components/morning-check-history-table';
import type { MorningCheckHistoryRow } from '@/types/morning-check-history';

type MorningCheckHistoryPanelProps = {
  rows: MorningCheckHistoryRow[];
};

export function MorningCheckHistoryPanel({ rows }: MorningCheckHistoryPanelProps) {
  return <MorningCheckHistoryTable rows={rows} />;
}
