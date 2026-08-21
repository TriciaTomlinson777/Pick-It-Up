import { redirect } from 'next/navigation';
import { getVerifiedAdminSession } from '@/lib/admin-request';
import BlogAdminLoginForm from '@/components/admin/BlogAdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function BlogAdminLoginPage() {
  const session = await getVerifiedAdminSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-[#f7fcfb] px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#0f9aa1]/20 bg-white p-6 shadow-sm sm:p-7">
        <h1 className="text-3xl font-bold text-[#002244]">Admin Login</h1>
        <p className="mt-2 text-sm text-[#1f5f7a]">Sign in to manage Pick It Up Seattle content.</p>

        <BlogAdminLoginForm />
      </div>
    </div>
  );
}
