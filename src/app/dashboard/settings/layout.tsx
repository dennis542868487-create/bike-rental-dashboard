import { redirect } from 'next/navigation';
import { getServerSessionProfile } from '@/lib/auth';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { session, profile } = await getServerSessionProfile();

  if (!session || !profile || !profile.is_active || profile.role !== 'owner') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
