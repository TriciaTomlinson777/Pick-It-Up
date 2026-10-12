import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../public/street-challenge-preview/index.html', import.meta.url), 'utf8');
const source = html.slice(html.indexOf('async function restoreAccount()'), html.indexOf('\n', html.indexOf('async function restoreAccount()')));
async function restore(state) {
  const calls = [];
  const hero = { id: 'saved-hero', name: 'Return Test', avatar: 3 };
  const context = vm.createContext({
    URLSearchParams, location: { search: '?signin=expired', hash: '', pathname: '/street-challenge-preview/index.html' },
    history: { replaceState() {} },
    account: async () => ({ heroes: [hero], hero, ...state }),
    $: () => ({}), loadProgress: () => ({ heroId: hero.id }), loadDraft: () => null,
    validHero: h => Boolean(h?.id), showHub: h => calls.push(['hub', h.id]),
    showPlayers: () => calls.push(['players']), showSignin: () => calls.push(['signin']),
    message: text => calls.push(['message', text]), showAccountRetry: text => calls.push(['retry', text]),
    signedIn: false, savedHero: null, savedHeroes: [],
  });
  vm.runInContext(source, context);
  await context.restoreAccount();
  return calls;
}
test('an expired return URL restores a verified saved hero', async () => {
  assert.deepEqual(await restore({ signedIn: true }), [['hub', 'saved-hero']]);
});
test('an expired return URL still requests a new link without a valid session', async () => {
  assert.deepEqual(await restore({ signedIn: false, heroes: [], hero: null }), [['signin'], ['message', 'That link expired. Send a fresh one.']]);
});
