'use client';

import { ActiveRentalsTable } from '@/components/active-rentals-table';
import { SearchableListShell } from '@/components/searchable-list-shell';
import type { ActiveRentalRow } from '@/types/active-rental';

type ActiveRentalsPanelProps = {
  rows: ActiveRentalRow[];
};

export function ActiveRentalsPanel({ rows }: ActiveRentalsPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by rental number, customer, phone, or bike"
      getSearchText={(row) => [row.rentalNumber, row.customerName, row.phoneNumber, row.bikes].join(' ')}
      render={(filteredRows) => <ActiveRentalsTable rows={filteredRows} />}
    />
  );
}
