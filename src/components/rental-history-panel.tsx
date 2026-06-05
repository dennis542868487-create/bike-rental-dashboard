'use client';

import { RentalHistoryTable } from '@/components/rental-history-table';
import { SearchableListShell } from '@/components/searchable-list-shell';
import type { RentalHistoryRow } from '@/types/rental-history';

type RentalHistoryPanelProps = {
  rows: RentalHistoryRow[];
};

export function RentalHistoryPanel({ rows }: RentalHistoryPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by rental number, customer, bike, date, or fee"
      getSearchText={(row) => [row.rentalNumber, row.customerName, row.bikeNumbers, row.completedAt, row.fee].join(' ')}
      render={(filteredRows) => <RentalHistoryTable rows={filteredRows} />}
    />
  );
}
