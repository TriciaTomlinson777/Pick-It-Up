import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('game login and token refresh both issue persistent host-only cookies', () => {
  const callback = read('app/auth/game-callback/route.js');
  const refresh = read('lib/supabase/participant-server.js');
  for (const source of [callback, refresh]) {
    assert.match(source, /httpOnly:\s*true/);
    assert.match(source, /sameSite:\s*'lax'/);
    assert.match(source, /path:\s*'\/'/);
    assert.match(source, /maxAge:\s*options\?\.maxAge\s*===\s*0\s*\?\s*0\s*:\s*60\s*\*\s*60\s*\*\s*24\s*\*\s*30/);
  }
});

test('confirmation is verified on the canonical preview host before writing cookies', () => {
  const callback = read('app/auth/game-callback/route.js');
  const proxy = read('proxy.js');
  assert.match(callback, /url\.origin\s*!==\s*gameOrigin/);
  assert.match(callback, /NextResponse\.redirect\(canonical\)/);
  assert.match(proxy, /pathname\.startsWith\('\/street-challenge-preview\/'\)/);
  assert.match(proxy, /response = NextResponse\.redirect\(url, 307\)/);
});

test('temporary account errors do not erase saved game authentication', () => {
  const account = read('app/api/street-challenge/account/route.js');
  const game = read('public/street-challenge-preview/index.html');
  assert.match(account, /!invalidSession/);
  assert.match(account, /unavailable:\s*true/);
  assert.match(game, /function showAccountRetry\(/);
  assert.match(game, /showAccountRetry\(e\.message\)/);
});
