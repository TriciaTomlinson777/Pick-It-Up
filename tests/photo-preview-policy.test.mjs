import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../lib/photo-preview-policy.js', import.meta.url), 'utf8');
const { canOptimizePublicPhoto } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('only public Supabase storage images use shared optimization', () => {
  assert.equal(canOptimizePublicPhoto('https://example.supabase.co/storage/v1/object/public/Community%20Photos/photo.jpg'), true);
  for (const src of [
    '/api/community-before-after/id/image?side=before',
    'https://www.pickitupseattle.org/api/community-before-after/id/image?side=after',
    'https://example.supabase.co/storage/v1/object/sign/private/photo.jpg?token=secret',
    'https://example.supabase.co/storage/v1/object/authenticated/private/photo.jpg',
    'https://example.supabase.co/storage/v1/object/public/photos/a.jpg?token=secret',
    'https://example.supabase.co.attacker.test/storage/v1/object/public/photos/a.jpg',
    'http://example.supabase.co/storage/v1/object/public/photos/a.jpg',
    'blob:https://www.pickitupseattle.org/preview',
    'data:image/jpeg;base64,abc',
    '',
    null,
  ]) assert.equal(canOptimizePublicPhoto(src), false, String(src));
});
