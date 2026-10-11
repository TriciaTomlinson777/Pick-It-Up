import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app/auth/game-callback/route.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '').replace(/export /g, '');

async function callback(query, failure = false) {
  const jar = new Map();
  const context = vm.createContext({
    URL, URLSearchParams, process: { env: { NODE_ENV: 'production' } },
    getParticipantSupabaseConfig: () => ({ url: 'https://test.supabase.co', publishableKey: 'public-test-key' }),
    readGameSigninDraft: () => null,
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
      return { auth: { verifyOtp: verify, exchangeCodeForSession: verify } };
    },
  });
  vm.runInContext(source, context);
  const response = await context.GET({
    url: 'https://preview.vercel.app/auth/game-callback' + query,
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
