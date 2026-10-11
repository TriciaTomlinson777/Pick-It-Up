import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseServerConfig, supabaseServerFetch } from './supabase-server';
import { sendMailMessage } from './form-mailer';

export async function sendGameSigninEmail(email, request) {
  const { url, serviceRoleKey } = getSupabaseServerConfig();
  if (!url || !serviceRoleKey) throw new Error('Sign-in unavailable.');
  const digest = value => createHmac('sha256', serviceRoleKey).update(value).digest('hex');
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  for (const [key, limit, seconds] of [['email:' + email, 1, 60], ['ip:' + ip, 10, 3600]]) {
    const response = await supabaseServerFetch('/rest/v1/rpc/game_allow_signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ p_key: digest(key), p_limit: limit, p_seconds: seconds }) });
    if (!response.ok) throw new Error('Sign-in unavailable.');
    if (await response.json() !== true) { const error = new Error('Wait a minute, then try again.'); error.status = 429; throw error; }
  }
  const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  if (error || !data.properties?.hashed_token) throw new Error('Sign-in unavailable.');
  const link = new URL('/auth/game-callback', request.url);
  link.searchParams.set('token_hash', data.properties.hashed_token);
  await sendMailMessage({ to: email, subject: 'Your Street Challenge sign-in link ✨', text: `Your hero is waiting!\n\nClick this link to sign in and continue your game:\n${link.href}\n\nThis link can be used once. If you didn’t request it, you can ignore this email.\n\nOne person. One piece. One better place.\nStreet Challenge · Pick It Up Seattle` });
}
