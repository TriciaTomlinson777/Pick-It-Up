import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const links = (source) => [...source.matchAll(/<Link\b[\s\S]*?<\/Link>/g)]
  .map(([block]) => ({ href: block.match(/href="([^"]+)"/)?.[1], label: block.match(/>\s*([^<>]+?)\s*<\/Link>$/)?.[1]?.trim(), attrs: block }));

test('desktop and mobile menu Join the Movement open Street Challenge', () => {
  const source = read('components/Header.jsx');
  const desktop = source.split('{/* Mobile menu */}')[0];
  const mobile = source.split('{/* Mobile menu */}')[1];
  for (const section of [desktop, mobile]) {
    const join = links(section).filter((link) => link.label === 'Join the Movement');
    assert.equal(join.length, 1);
    assert.equal(join[0].href, '/street-challenge');
  }
  assert.match(mobile, /onClick=\{\(\) => setIsOpen\(false\)\}/);
});

test('mobile home shortcut beside Kids Corner opens Street Challenge', () => {
  const source = read('app/page.jsx');
  const join = links(source).filter((link) => link.label === 'Join the Movement');
  assert.equal(join.length, 1);
  assert.equal(join[0].href, '/street-challenge');
  assert.match(join[0].attrs, /sm:hidden/);
  const start = source.indexOf('Join the Movement');
  assert.match(source.slice(start, start + 300), /href="\/kids-corner"/);
});

test('shared footer keeps volunteering separately accessible', () => {
  const volunteer = links(read('components/Footer.jsx')).find((link) => link.label === 'Make a Difference');
  assert.equal(volunteer?.href, '/volunteer');
});

test('Kids Corner invites children into the same Street Challenge game', () => {
  const source = read('app/kids-corner/page.jsx');
  assert.match(source, /Ready to Be a Litter Hero\?/);
  const play = links(source).filter((link) => link.label === 'Play Street Challenge!');
  assert.equal(play.length, 1);
  assert.equal(play[0].href, '/street-challenge');
});
