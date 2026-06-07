'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginAction } from '@/actions/login';
import { InlineNotice } from '@/components/inline-notice';
import { loginSchema, type LoginFormValues } from '@/types/auth';

export function LoginForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('password', values.password);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.message) {
        setMessage(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12 }}>
      <label>
        <div>Email</div>
        <input type="email" {...register('email')} placeholder="staff@wanderbike.com" style={{ width: '100%', padding: 10, marginTop: 4 }} />
        {errors.email ? <p style={{ color: '#dc2626' }}>{errors.email.message}</p> : null}
      </label>
      <label>
        <div>Password</div>
        <input type="password" {...register('password')} placeholder="••••••••" style={{ width: '100%', padding: 10, marginTop: 4 }} />
        {errors.password ? <p style={{ color: '#dc2626' }}>{errors.password.message}</p> : null}
      </label>
      {message ? <InlineNotice type="error">{message}</InlineNotice> : null}
      <button type="submit" disabled={isSubmitting || isPending} style={{ padding: 12, marginTop: 8 }}>
        {isSubmitting || isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
