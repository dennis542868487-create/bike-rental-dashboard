import { redirect } from 'next/navigation';
import { getServerSessionProfile } from '@/lib/auth';

export default async function HomePage() {
  const { session, profile } = await getServerSessionProfile();
  const sessionProfile = profile as { is_active?: boolean; role?: string } | null;

  if (session && sessionProfile?.is_active && ['owner', 'staff'].includes(sessionProfile.role ?? '')) {
    redirect('/dashboard');
  }

  redirect('/login');
}
