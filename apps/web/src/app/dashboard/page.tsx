import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/login');
  }

  // 在服务端请求用户信息（体现 Next.js RSC 优势）
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Cookie: `token=${token.value}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/login');
  }

  const user = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome, {user.name || user.email}!</p>
      <p className="text-sm text-gray-500">Role: {user.role}</p>
    </div>
  );
}
