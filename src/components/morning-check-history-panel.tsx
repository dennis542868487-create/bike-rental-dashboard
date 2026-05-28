'use client';

import { MorningCheckHistoryTable } from '@/components/morning-check-history-table';
import { SearchableListShell } from '@/components/searchable-list-shell';
import type { MorningCheckHistoryRow } from '@/types/morning-check-history';

type MorningCheckHistoryPanelProps = {
  rows: MorningCheckHistoryRow[];
};

export function MorningCheckHistoryPanel({ rows }: MorningCheckHistoryPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by date, bike, area, status, or submitted time"
      getSearchText={(row) => [row.checkDate, row.bikeNumber, row.areaName, row.checkStatus, row.submittedAt].join(' ')}
      render={(filteredRows) => <MorningCheckHistoryTable rows={filteredRows} />}
    />
  );
}
