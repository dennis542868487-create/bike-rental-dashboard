import type { UserProfileRow } from '@/types/user-profile';

type UserProfilesTableProps = {
  rows: UserProfileRow[];
};

export function UserProfilesTable({ rows }: UserProfilesTableProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>Name</th>
            <th style={{ padding: 12 }}>Email</th>
            <th style={{ padding: 12 }}>Role</th>
            <th style={{ padding: 12 }}>Active</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                No users found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{row.fullName || '—'}</td>
                <td style={{ padding: 12 }}>{row.email}</td>
                <td style={{ padding: 12 }}>{row.role}</td>
                <td style={{ padding: 12 }}>{row.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
