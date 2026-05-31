import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { getServerSessionProfile } from '@/lib/auth';

export default async function LoginPage() {
  const { session, profile } = await getServerSessionProfile();
  const sessionProfile = profile as { is_active?: boolean; role?: string } | null;

  if (session && sessionProfile && sessionProfile.is_active && ['owner', 'staff'].includes(sessionProfile.role ?? '')) {
    redirect('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ width: '100%', maxWidth: 420, border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Staff Login</h1>
        <p>Wander Bike internal dashboard access.</p>
        <LoginForm />
      </section>
    </main>
  );
}
