import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSignedPhotoUrl } from '@/lib/future-photo-moderation';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';
import ParticipantSignOutLink from '@/components/ParticipantSignOutLink';

const PRESET_AVATARS = {
  'purple-lady': { label: 'Purple Lady', src: '/Purple%20lady.png' },
  'blue-hat-boy': { label: 'Blue Hat Boy', src: '/Blue%20Hat.png' },
  'blonde-girl': { label: 'Blonde Girl', src: '/Blonde%20Girl.png' },
  'captain-can': { label: 'Captain Can', src: '/Captain%20Can%20(1).png' },
  'mess-monster': { label: 'Mess Monster', src: '/Mess%20Monster.png' },
  'blue-boy': { label: 'Blue Boy', src: '/Blue%20Boy.png' },
  dog: { label: 'Dog', src: '/Dog.png' },
  mia: { label: 'Mia', src: '/Mia.png' },
};

function SavedAvatar({ profile, avatarUrl }) {
  const preset = PRESET_AVATARS[profile?.avatar_preset];
  const imageSource = profile?.avatar_kind === 'upload' && profile?.avatar_moderation_status === 'approved'
    ? avatarUrl
    : preset?.src;

  if (imageSource) {
    return <img src={imageSource} alt="Saved profile avatar" className="h-32 w-32 rounded-full object-contain" />;
  }

  return (
    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[#dff3f1] shadow-[0_5px_0_rgba(0,34,68,0.12)]">
      <img src="/pick-it-up-seattle-logo.png" alt="Default Pick It Up Seattle avatar" className="h-full w-full object-contain p-2" />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Street Challenge | Pick It Up Seattle',
};

export default async function StreetChallengeHomePage() {
  const supabase = await createParticipantServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/street-challenge');

  const { data: profile } = await supabase
    .from('participant_profiles')
    .select('display_name, avatar_kind, avatar_preset, avatar_path, avatar_moderation_status')
    .eq('id', user.id)
    .maybeSingle();
  const avatarUrl = profile?.avatar_kind === 'upload'
    && profile?.avatar_path
    && profile?.avatar_moderation_status === 'approved'
    ? await createSignedPhotoUrl(profile.avatar_path)
    : '';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e7f6f4_0%,#f4efda_58%,#ffffff_100%)] px-4 py-12">
      <section className="mx-auto w-full max-w-md border-t-4 border-[#69be28] bg-white p-6 shadow-[0_18px_50px_rgba(0,43,73,0.14)] sm:p-8">
        <p className="text-sm font-bold uppercase text-[#0f9aa1]">Street Challenge</p>
        <div className="mt-5 flex flex-col items-center text-center">
          <SavedAvatar profile={profile} avatarUrl={avatarUrl} />
          <h1 className="mt-5 text-3xl font-bold text-[#002244]">Welcome, {profile?.display_name || 'Litter Hero'}!</h1>
          <p className="mt-3 leading-7 text-[#1f5f7a]">Ready to make Seattle a little cleaner?</p>
        </div>

        <Link href="/events?view=organize#organize-cleanup" className="mt-7 block w-full rounded-lg bg-[#69be28] px-5 py-3 text-center font-semibold text-[#002244] hover:bg-[#79ca38]">
          Start a Cleanup
        </Link>
        <div className="mt-5 flex items-center justify-center gap-4 border-t border-[#002244]/12 pt-5 text-sm font-semibold text-[#1f5f7a]">
          <Link href="/street-challenge/profile" className="underline underline-offset-4 hover:text-[#002244]">Edit Profile</Link>
          <ParticipantSignOutLink />
        </div>
      </section>
    </main>
  );
}