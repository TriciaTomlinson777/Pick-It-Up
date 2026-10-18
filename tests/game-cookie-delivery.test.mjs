import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import vm from 'node:vm';
import { NextResponse } from 'next/server.js';

const source = readFileSync(new URL('../app/auth/game-session-check/route.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '').replace(/export /g, '');
const check = randomUUID();
async function run({ probe = true, cookie = true, user = false, unavailable = false } = {}) {
  const logs = [];
  const context = vm.createContext({ URL, randomUUID, NextResponse, console: { info: (...args) => logs.push(args) },
    createParticipantServerClient: async () => ({ auth: { getUser: async () => ({
      data: { user: user ? { id: 'private-id', email: 'private@example.invalid' } : null },
      error: user ? null : unavailable ? { status: 503, name: 'AuthRetryableFetchError' } : { status: 400, name: 'AuthSessionMissingError' },
    }) } }),
  });
  vm.runInContext(source, context);
  const response = await context.GET({ url: 'https://game.example/auth/game-session-check?check=' + check,
    cookies: { get: () => probe ? { value: check } : undefined, getAll: () => cookie ? [{ name: 'sb-fixture-auth-token', value: 'secret-auth-token' }] : [] },
  });
  return { response, text: await response.text(), logs };
}
test('verified user continues with the original hero fragment and uncached response', async () => {
  const r = await run({ user: true });
  assert.match(r.text, /location\.hash/);
  assert.match(r.text, /location\.replace\(next\)/);
  assert.equal(r.response.headers.get('Cache-Control'), 'private, no-store');
  assert.match(r.response.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
});
test('returned probe cannot authenticate a browser with a missing session', async () => {
  const r = await run({ cookie: false });
  assert.match(r.text, /Sign-in cookie: MISSING; browser check cookie: RETURNED/);
  assert.doesNotMatch(r.text, /location\.replace/);
  assert.equal(r.logs[0][1].signedIn, false);
});
test('failure shows whether neither cookie returned or only authentication failed', async () => {
  const neither = await run({ probe: false, cookie: false });
  assert.match(neither.text, /browser check cookie: NOT RETURNED/);
  const rejected = await run();
  assert.match(rejected.text, /sign-in: session_rejected/);
});
test('temporary auth failure offers retry without requesting another email', async () => {
  const r = await run({ unavailable: true });
  assert.match(r.text, /sign-in: unavailable/);
  assert.match(r.text, /location\.reload/);
});
test('logs and page never expose session values or private account information', async () => {
  const r = await run({ user: true });
  assert.doesNotMatch(JSON.stringify(r.logs) + r.text, /secret-auth-token|private-id|private@example/);
});
