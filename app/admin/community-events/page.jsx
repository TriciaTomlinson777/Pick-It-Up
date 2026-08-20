import { redirect } from 'next/navigation';
import CommunityEventsAdminClient from '@/components/admin/CommunityEventsAdminClient';
import { getVerifiedAdminSession } from '@/lib/admin-request';
import { getAdminCommunityEvents } from '@/lib/community-event-repository';

export const dynamic = 'force-dynamic';

export default async function CommunityEventsAdminPage() {
  const session = await getVerifiedAdminSession();
  if (!session) redirect('/admin/blog/login');

  let events = [];
  try {
    events = await getAdminCommunityEvents();
  } catch {
    // Keep the admin shell available if the migration has not been run yet.
  }

  return <CommunityEventsAdminClient initialEvents={events} />;
}
