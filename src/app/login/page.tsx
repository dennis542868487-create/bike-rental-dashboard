import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { getServerSessionProfile } from '@/lib/auth';

export default async function LoginPage() {
  const { session, profile } = await getServerSessionProfile();

  if (session && profile && profile.is_active && ['owner', 'staff'].includes(profile.role)) {
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
