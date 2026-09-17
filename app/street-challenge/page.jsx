import { redirect } from 'next/navigation';
import StreetChallengeSignInForm from '@/components/StreetChallengeSignInForm';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Street Challenge Sign In | Pick It Up Seattle',
};

export default async function StreetChallengeSignInPage() {
  const supabase = await createParticipantServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/street-challenge/profile');

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e7f6f4_0%,#f4efda_58%,#ffffff_100%)] px-4 py-12">
      <section className="mx-auto w-full max-w-md border-t-4 border-[#69be28] bg-white p-6 shadow-[0_18px_50px_rgba(0,43,73,0.14)] sm:p-8">
        <p className="text-sm font-bold uppercase text-[#0f9aa1]">Private pilot</p>
        <h1 className="mt-2 text-3xl font-bold text-[#002244]">Street Challenge</h1>
        <p className="mt-3 leading-7 text-[#1f5f7a]">
          Sign in with your email to create or return to your participant profile.
        </p>
        <StreetChallengeSignInForm />
      </section>
    </main>
  );
}