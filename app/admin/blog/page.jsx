import { redirect } from 'next/navigation';
import BlogAdminClient from '@/components/admin/BlogAdminClient';
import { ensureFirstPostExists } from '@/lib/blog-repository';
import { getVerifiedAdminSession } from '@/lib/admin-request';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const session = await getVerifiedAdminSession();
  if (!session) {
    redirect('/admin/blog/login');
  }

  try {
    await ensureFirstPostExists();
  } catch {
    // Keep rendering admin page even if initial seed fails.
  }

  return <BlogAdminClient />;
}
