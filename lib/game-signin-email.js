import { createHmac, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseServerConfig, supabaseServerFetch } from './supabase-server';
import { sendMailMessage } from './form-mailer';

export async function sendGameSigninEmail(email, request, hero) {
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
  const link = new URL('/auth/game-callback', getGameOrigin(request));
  link.searchParams.set('token_hash', data.properties.hashed_token);
  if (validDraft(hero)) {
    const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', draftKey(serviceRoleKey), iv);
    cipher.setAAD(Buffer.from(data.properties.hashed_token));
    const encrypted = Buffer.concat([cipher.update(JSON.stringify({ name: hero.name.trim(), avatar: hero.avatar, expires: Date.now() + 3600000 })), cipher.final()]);
    link.searchParams.set('draft', Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url'));
  }
  const returnLink = new URL('/street-challenge-preview/index.html', getGameOrigin(request));
  await sendMailMessage({ to: email, subject: 'Your Street Challenge sign-in link ✨', text: `Your hero is waiting!\n\nTap this confirmation link to sign in:\n${link.href}\n\nKeep playing in the game page that opens.\n\nSAVE THIS GAME LINK\nUse this link whenever you return to your game:\n${returnLink.href}\n\nYour confirmation link can be used once. Your saved game link can be used again and again. If you didn’t request it, you can ignore this email.\n\nOne person. One piece. One better place.\nStreet Challenge · Pick It Up Seattle` });
}

function validDraft(hero) { return hero && typeof hero.name === 'string' && hero.name.trim() && hero.name.length <= 30 && Number.isInteger(hero.avatar) && hero.avatar >= 0 && hero.avatar <= 8; }
function draftKey(secret) { return createHmac('sha256', secret).update('street-challenge-signin-draft-v1').digest(); }
export function readGameSigninDraft(value, tokenHash) {
  try {
    if (!value || value.length > 1024 || !tokenHash) return null;
    const { serviceRoleKey } = getSupabaseServerConfig();
    const bytes = Buffer.from(value, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', draftKey(serviceRoleKey), bytes.subarray(0, 12));
    decipher.setAuthTag(bytes.subarray(12, 28));
    decipher.setAAD(Buffer.from(tokenHash));
    const hero = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString());
    return validDraft(hero) && hero.expires > Date.now() ? { name: hero.name.trim(), avatar: hero.avatar } : null;
  } catch { return null; }
}

export function getGameOrigin(request, env = process.env) {
  const branchHost = String(env.VERCEL_BRANCH_URL || '').trim();
  // A deployment URL is immutable; the branch URL follows the tested game.
  // Use only a trusted Vercel-provided host, never a return URL from the browser.
  if (env.VERCEL_ENV === 'preview' && /^pick-it-up-ijjl-git-[a-z0-9-]+\.vercel\.app$/.test(branchHost)) {
    return 'https://' + branchHost;
  }
  // Some immutable Vercel preview deployments do not expose VERCEL_BRANCH_URL.
  // Keep this game's email links on the same stable branch hostname even then.
  // Only use the fallback for this project's preview deployments.
  const requestHost = new URL(request.url).hostname;
  if (env.VERCEL_ENV === 'preview' && /^pick-it-up-ijjl-[a-z0-9-]+-pick-it-up-seattle\\.vercel\\.app$/.test(requestHost)) {
    return 'https://pick-it-up-ijjl-git-street-challenge-9586ff-pick-it-up-seattle.vercel.app';
  }
  return new URL(request.url).origin;
}
