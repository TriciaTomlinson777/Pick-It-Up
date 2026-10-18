import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
function runProxy(address, env) {
  const context = vm.createContext({ process: { env }, NextResponse: {
    next: () => ({ kind: 'next' }),
    redirect: (url, status) => ({ kind: 'redirect', url: url.href, status, headers: new Map() }),
    rewrite: url => ({ kind: 'rewrite', url: url.href }),
  } });
  vm.runInContext(read('proxy.js').replace(/^import .*;\n/gm, '').replace(/export /g, ''), context);
  const url = new URL(address); url.clone = () => new URL(address);
  return context.proxy({ nextUrl: url });
}
const host = 'pick-it-up-ijjl-git-street-challenge-9586ff-pick-it-up-seattle.vercel.app';
test('deployment game links move to the email cookie host and preserve path/query', () => {
  const r = runProxy('https://older.vercel.app/street-challenge-preview/index.html?signin=success', { VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: host });
  assert.equal(r.url, 'https://' + host + '/street-challenge-preview/index.html?signin=success');
  assert.equal(r.status, 307);
  assert.equal(r.headers.get('Cache-Control'), 'private, no-store');
});
test('canonical previews, production and non-game pages do not redirect', () => {
  for (const [url, env] of [
    ['https://' + host + '/street-challenge-preview/index.html', { VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: host }],
    ['https://pickitupseattle.org/street-challenge-preview/index.html', { VERCEL_ENV: 'production', VERCEL_BRANCH_URL: host }],
    ['https://older.vercel.app/track-it', { VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: host }],
    ['https://older.vercel.app/street-challenge-preview/index.html', { VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'attacker.example' }],
  ]) assert.equal(runProxy(url, env).kind, 'next');
});
test('signing out one player browser leaves other email-sharing sessions intact', async () => {
  let scope;
  const context = vm.createContext({ URL, randomUUID: () => 'unused', sendGameSigninEmail() {}, getGameOrigin() {},
    NextResponse: { json: (body, options) => ({ body, ...options }) },
    createParticipantServerClient: async () => ({ auth: {
      getUser: async () => ({ data: { user: { id: 'test-user' } }, error: null }),
      signOut: async options => { scope = options.scope; return { error: null }; },
    } }),
  });
  vm.runInContext(read('app/api/street-challenge/account/route.js').replace(/^import .*;\n/gm, '').replace(/export /g, ''), context);
  const r = await context.POST({ url: 'https://game.example/api/street-challenge/account', headers: new Map([['origin', 'https://game.example']]), json: async () => ({ action: 'logout' }) });
  assert.equal(scope, 'local');
  assert.equal(r.body.ok, true);
});
