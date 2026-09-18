import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Join a Street Challenge | Pick It Up Seattle',
};

export default async function StreetChallengeJoinPage() {
  const supabase = await createParticipantServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/street-challenge');

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e7f6f4_0%,#f4efda_58%,#ffffff_100%)] px-4 py-12">
      <section className="mx-auto w-full max-w-md border-t-4 border-[#69be28] bg-white p-6 shadow-[0_18px_50px_rgba(0,43,73,0.14)] sm:p-8">
        <p className="text-sm font-bold uppercase text-[#0f9aa1]">Street Challenge</p>
        <h1 className="mt-2 text-3xl font-bold text-[#002244]">Join a Street Challenge</h1>
        <Link href="/street-challenge/home" className="mt-7 block w-full rounded-lg bg-[#69be28] px-5 py-3 text-center font-semibold text-[#002244] hover:bg-[#79ca38]">
          Back to Street Challenge Home
        </Link>
      </section>
    </main>
  );
}