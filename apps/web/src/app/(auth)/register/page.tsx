'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetcher } from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setSuccess(false);
      await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setSuccess(true);
      // 注册成功后延迟 1.5 秒跳转到登录页，让用户看清提示
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-xl border p-8 shadow-sm"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join OpenMusic Lab</p>
        </div>

        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-500">{error}</p>}
        {success && (
          <p className="rounded bg-green-50 p-2 text-sm text-green-600">
            Registration successful! Redirecting to login...
          </p>
        )}

        <div>
          <label className="block text-sm font-medium">Name (Optional)</label>
          <input
            {...register('name')}
            type="text"
            className="mt-1 w-full rounded-md border p-2 outline-none focus:border-blue-500"
            placeholder="Your display name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 w-full rounded-md border p-2 outline-none focus:border-blue-500"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register('password')}
            type="password"
            className="mt-1 w-full rounded-md border p-2 outline-none focus:border-blue-500"
            placeholder="At least 6 characters"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting || success}
          type="submit"
          className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
