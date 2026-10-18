import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';

const source = readFileSync(new URL('../app/auth/game-callback/route.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '').replace(/export /g, '');

async function callback(query, failure = false, origin = 'https://preview.vercel.app', existingSession = false) {
  const jar = new Map();
  const context = vm.createContext({
    URL, URLSearchParams, randomUUID, process: { env: { NODE_ENV: 'production' } },
    getParticipantSupabaseConfig: () => ({ url: 'https://test.supabase.co', publishableKey: 'public-test-key' }),
    readGameSigninDraft: () => null,
    getGameOrigin: () => 'https://preview.vercel.app',
    NextResponse: { redirect(url) { return {
      headers: new Map([['Location', url.href]]),
      cookies: { set(name, value, options) { jar.set(name, { value, options }); } },
    }; } },
    createServerClient(url, key, { cookies }) {
      const verify = async () => {
        if (failure) return { error: new Error('expired') };
        cookies.setAll([
          { name: 'sb-session.0', value: 'chunk0', options: {} },
          { name: 'sb-session.1', value: 'chunk1', options: {} },
          { name: 'old-cookie', value: '', options: { maxAge: 0 } },
        ]);
        return { error: null };
      };
      return { auth: { verifyOtp: verify, exchangeCodeForSession: verify, getUser: async () => ({ data: { user: existingSession ? { id: 'saved-player' } : null }, error: null }) } };
    },
  });
  vm.runInContext(source, context);
  const response = await context.GET({
    url: origin + '/auth/game-callback' + query,
    cookies: { getAll: () => [] },
  });
  return { response, jar };
}

test('email and code callbacks persist secure cookie chunks on the returned redirect', async () => {
  for (const query of ['?token_hash=test', '?code=test']) {
    const { response, jar } = await callback(query);
    const target = new URL(response.headers.get('Location'));
    assert.equal(target.host, 'preview.vercel.app');
    assert.equal(target.searchParams.get('signin'), 'success');
    assert.equal(target.pathname, '/auth/game-session-check');
    assert.equal(target.searchParams.get('check'), jar.get('game_cookie_delivery_check').value);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    for (const name of ['sb-session.0', 'sb-session.1']) {
      const { options } = jar.get(name);
      assert.equal(options.path, '/');
      assert.equal(options.maxAge, 2592000);
      assert.equal(options.httpOnly, true);
      assert.equal(options.secure, true);
      assert.equal(options.sameSite, 'lax');
      assert.equal(options.domain, undefined);
    }
    assert.equal(jar.get('old-cookie').options.maxAge, 0);
  }
});

test('missing or rejected credentials never produce a saved sign-in', async () => {
  for (const [query, failure] of [['', false], ['?token_hash=invalid', true]]) {
    const { response, jar } = await callback(query, failure);
    assert.equal(new URL(response.headers.get('Location')).searchParams.get('signin'), 'expired');
    assert.equal(jar.size, 0);
  }
});

test('a token link on a different deployment moves to the saved game host before verification', async () => {
  const { response, jar } = await callback('?token_hash=test&draft=test-draft', false, 'https://older.vercel.app');
  const target = new URL(response.headers.get('Location'));
  assert.equal(target.origin, 'https://preview.vercel.app');
  assert.equal(target.pathname, '/auth/game-callback');
  assert.equal(target.searchParams.get('token_hash'), 'test');
  assert.equal(target.searchParams.get('draft'), 'test-draft');
  assert.equal(jar.size, 0);
});
test('production and local sign-ins stay on their requested host', () => {
  const emailSource = readFileSync(new URL('../lib/game-signin-email.js', import.meta.url), 'utf8');
  const context = vm.createContext({ URL, process: { env: {} } });
  vm.runInContext(emailSource.slice(emailSource.indexOf('export function getGameOrigin')).replace('export ', ''), context);
  const request = { url: 'https://pickitupseattle.org/auth/game-callback' };
  assert.equal(context.getGameOrigin(request, { VERCEL_ENV: 'production', VERCEL_BRANCH_URL: 'pick-it-up-ijjl-git-test.vercel.app' }), 'https://pickitupseattle.org');
  assert.equal(context.getGameOrigin(request, { VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'pick-it-up-ijjl-git-test.vercel.app' }), 'https://pick-it-up-ijjl-git-test.vercel.app');
  assert.equal(context.getGameOrigin(request, { VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'attacker.example' }), 'https://pickitupseattle.org');
});


test('reopening a used email link keeps an independently validated existing session', async () => {
  const { response, jar } = await callback('?token_hash=used&draft=old-draft', true, 'https://preview.vercel.app', true);
  const target = new URL(response.headers.get('Location'));
  assert.equal(target.searchParams.get('signin'), 'success');
  assert.equal(target.hash, '');
  assert.equal(jar.size, 0);
});
