'use client';

import { MorningCheckAreasTable } from '@/components/morning-check-areas-table';
import { SearchableListShell } from '@/components/searchable-list-shell';
import type { MorningCheckAreaRow } from '@/types/morning-check-area';

type MorningCheckAreasPanelProps = {
  rows: MorningCheckAreaRow[];
};

export function MorningCheckAreasPanel({ rows }: MorningCheckAreasPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by area, order, notes, or status"
      getSearchText={(row) => [row.name, String(row.displayOrder), row.notes, row.isActive ? 'active' : 'inactive'].join(' ')}
      render={(filteredRows) => <MorningCheckAreasTable rows={filteredRows} />}
    />
  );
}
