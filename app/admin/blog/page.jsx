import { redirect } from 'next/navigation';
import BlogAdminClient from '@/components/admin/BlogAdminClient';
import { ensureFirstPostExists, getAdminPosts } from '@/lib/blog-repository';
import { getVerifiedAdminSession } from '@/lib/admin-request';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const session = await getVerifiedAdminSession();
  if (!session) {
    redirect('/admin/blog/login');
  }

  let initialPosts = [];

  try {
    await ensureFirstPostExists();
  } catch {
    // Keep loading the real queue if the optional first-post seed fails.
  }

  try {
    initialPosts = await getAdminPosts();
  } catch {
    // Keep rendering the Admin page if the queue query itself fails.
  }

  return <BlogAdminClient initialPosts={initialPosts} />;
}
