'use client';

import { PendingSubmissionsTable } from '@/components/pending-submissions-table';
import { SearchableListShell } from '@/components/searchable-list-shell';
import type { PendingSubmissionRow } from '@/types/pending-submission';

type PendingSubmissionsPanelProps = {
  rows: PendingSubmissionRow[];
};

export function PendingSubmissionsPanel({ rows }: PendingSubmissionsPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by customer, phone, or submission number"
      getSearchText={(row) => [row.submissionNumber, row.customerName, row.phoneNumber].join(' ')}
      render={(filteredRows) => <PendingSubmissionsTable rows={filteredRows} />}
    />
  );
}
