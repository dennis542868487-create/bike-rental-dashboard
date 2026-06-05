import { CreateUserProfileForm } from '@/components/create-user-profile-form';
import { DashboardBackLink } from '@/components/dashboard-back-link';
import { PageHeader } from '@/components/page-header';
import { UserRoleEditList } from '@/components/user-role-edit-list';
import { getUserProfiles } from '@/lib/user-profiles';

export default async function UsersSettingsPage() {
  const users = await getUserProfiles();

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader title="Users & Roles" description="Manage staff and owner access for the dashboard." />
      <UserRoleEditList users={users} />
      <CreateUserProfileForm />
    </main>
  );
}
