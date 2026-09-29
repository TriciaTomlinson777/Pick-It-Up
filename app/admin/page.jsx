import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import { getVerifiedAdminSession } from '@/lib/admin-request';
import { getAdminCommunityEvents } from '@/lib/community-event-repository';
import { getAdminCommunityActionPhotos, getAdminCommunityContent } from '@/lib/community-content-admin-repository';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getVerifiedAdminSession();
  if (!session) redirect('/admin/blog/login');

  let events = [];
  let contentSections = [];
  let communityActionPhotos = [];

  try {
    events = await getAdminCommunityEvents();
  } catch {
    events = [];
  }

  try {
    contentSections = await getAdminCommunityContent();
  } catch {
    contentSections = [];
  }

  try {
    communityActionPhotos = await getAdminCommunityActionPhotos();
  } catch {
    communityActionPhotos = [];
  }

  return (
    <AdminDashboardClient
      initialPendingEvents={events.filter((event) => event.status === 'pending_review')}
      initialContentSections={contentSections}
      initialCommunityActionPhotos={communityActionPhotos}
    />
  );
}