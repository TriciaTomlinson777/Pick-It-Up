export function getParticipantSupabaseConfig() {
  const url = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const publishableKey = String(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      || ''
  ).trim();

  if (!url || !publishableKey) {
    throw new Error('Participant authentication is not configured.');
  }

  return { url, publishableKey };
}