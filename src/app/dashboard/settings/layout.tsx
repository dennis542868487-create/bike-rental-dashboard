import { redirect } from 'next/navigation';
import { getServerSessionProfile } from '@/lib/auth';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { session, profile } = await getServerSessionProfile();
  const sessionProfile = profile as { is_active?: boolean; role?: string } | null;

  if (!session || !sessionProfile || !sessionProfile.is_active || sessionProfile.role !== 'owner') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
