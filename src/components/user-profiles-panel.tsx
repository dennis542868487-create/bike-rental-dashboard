'use client';

import { SearchableListShell } from '@/components/searchable-list-shell';
import { UserProfilesTable } from '@/components/user-profiles-table';
import type { UserProfileRow } from '@/types/user-profile';

type UserProfilesPanelProps = {
  rows: UserProfileRow[];
};

export function UserProfilesPanel({ rows }: UserProfilesPanelProps) {
  return (
    <SearchableListShell
      rows={rows}
      placeholder="Search by name, email, role, or status"
      getSearchText={(row) => [row.fullName, row.email, row.role, row.isActive ? 'active' : 'inactive'].join(' ')}
      render={(filteredRows) => <UserProfilesTable rows={filteredRows} />}
    />
  );
}
