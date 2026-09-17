import { redirect } from 'next/navigation';
import StreetChallengeProfileForm from '@/components/StreetChallengeProfileForm';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Street Challenge Profile | Pick It Up Seattle',
};

export default async function StreetChallengeProfilePage() {
  const supabase = await createParticipantServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/street-challenge');

  const { data: profile } = await supabase
    .from('participant_profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e7f6f4_0%,#f4efda_58%,#ffffff_100%)] px-4 py-12">
      <section className="mx-auto w-full max-w-md border-t-4 border-[#69be28] bg-white p-6 shadow-[0_18px_50px_rgba(0,43,73,0.14)] sm:p-8">
        <p className="text-sm font-bold uppercase text-[#0f9aa1]">Private pilot</p>
        <h1 className="mt-2 text-3xl font-bold text-[#002244]">Participant profile</h1>
        <p className="mt-3 leading-7 text-[#1f5f7a]">
          Choose the display name you will use during the Street Challenge.
        </p>
        <StreetChallengeProfileForm
          userId={user.id}
          email={user.email || ''}
          initialDisplayName={profile?.display_name || ''}
        />
      </section>
    </main>
  );
}