import { CreateUserProfileForm } from '@/components/create-user-profile-form';
import { DashboardBackLink } from '@/components/dashboard-back-link';
import { PageHeader } from '@/components/page-header';
import { SaveUserProfileForm } from '@/components/save-user-profile-form';
import { UserProfilesPanel } from '@/components/user-profiles-panel';
import { getUserProfiles } from '@/lib/user-profiles';

export default async function UsersSettingsPage() {
  const rows = await getUserProfiles();
  const firstProfile = rows[0] ?? null;

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <DashboardBackLink href="/dashboard/settings" label="Back to Settings" />
      <PageHeader title="Users & Roles" description="Manage staff and owner access for the dashboard." />
      <CreateUserProfileForm />
      {firstProfile ? (
        <SaveUserProfileForm
          profileId={firstProfile.id}
          defaultValues={{
            email: firstProfile.email,
            fullName: firstProfile.fullName,
            role: firstProfile.role,
            isActive: firstProfile.isActive,
          }}
        />
      ) : null}
      <UserProfilesPanel rows={rows} />
    </main>
  );
}
