'use client';

import { BikesTable } from '@/components/bikes-table';
import { SearchableListShell } from '@/components/searchable-list-shell';
import type { BikeRow } from '@/types/bike';

type BikesPanelProps = {
  rows: BikeRow[];
};

export function BikesPanel({ rows }: BikesPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by bike number, type, size, status, or area"
      getSearchText={(row) => [row.bikeNumber, row.bikeType, row.size, row.status, row.area].join(' ')}
      render={(filteredRows) => <BikesTable rows={filteredRows} />}
    />
  );
}
