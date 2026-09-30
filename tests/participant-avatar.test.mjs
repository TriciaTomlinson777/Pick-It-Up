import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import { isOwnedParticipantAvatarPath } from '../lib/participant-avatar.js';

const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const source = await readFile(new URL('../app/api/street-challenge/profile/avatar/route.js', import.meta.url), 'utf8');

async function endpoint(options = {}) {
  const calls = { writes: [], uploads: [] };
  const modules = {
    'node:crypto': { randomUUID },
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/participant-avatar': { isOwnedParticipantAvatarPath },
    '@/lib/supabase/participant-server': {
      createParticipantServerClient: async () => ({
        auth: { getUser: async () => ({ data: { user: options.unsigned ? null : { id: owner } } }) },
        from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({
          data: options.missingProfile ? null : { avatar_path: options.oldPath || null },
          error: options.readError || null,
        }) }) }) }),
      }),
    },
    '@/lib/future-photo-moderation': {
      storeAndModerateFutureImage: async (file, folder, submissionId) => {
        calls.uploads.push({ file, folder, submissionId });
        return {
          storagePath: options.foreignPath || `future-uploads/${folder}/${submissionId}/1-avatar.jpg`,
          moderation: { status: options.moderation || 'approved' },
        };
      },
    },
    '@/lib/supabase-server': {
      supabaseServerFetch: async (path, init) => {
        const body = JSON.parse(init.body);
        calls.writes.push({ path, init, body });
        if (options.writeError) return Response.json({}, { status: 500 });
        return Response.json(options.conflict ? [] : [{ id: owner, ...body }]);
      },
    },
  };
  const context = vm.createContext({ URL, URLSearchParams, console: { error() {} } });
  const module = new vm.SourceTextModule(source, { context });
  await module.link(async (specifier) => {
    const values = modules[specifier];
    assert.ok(values, `Unexpected route dependency: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return {
    calls,
    post: async (fields = {}, origin = 'https://example.test') => {
      const response = await module.namespace.POST({
        url: 'https://example.test/api/street-challenge/profile/avatar',
        headers: new Headers({ origin }),
        formData: async () => ({ get: (name) => fields[name] || null }),
      });
      return { status: response.status, body: await response.json() };
    },
  };
}

const image = { type: 'image/jpeg', size: 512, arrayBuffer() {} };

test('only the owner can sign pilot and replacement avatar paths', () => {
  const paths = [
    `future-uploads/participant-avatars/${owner}/1-avatar.jpg`,
    `future-uploads/participant-avatars/${owner}-${randomUUID()}/child-face-1-avatar.jpg`,
  ];
  for (const path of paths) {
    assert.equal(isOwnedParticipantAvatarPath(path, owner), true);
    assert.equal(isOwnedParticipantAvatarPath(path, other), false);
  }
  for (const path of [
    `future-uploads/community-action/${owner}/1-avatar.jpg`,
    `future-uploads/participant-avatars/${owner}-forged/1-avatar.jpg`,
    `future-uploads/participant-avatars/${owner}/../someone.jpg`,
    `future-uploads/participant-avatars/${owner}/%2e%2e.jpg`,
  ]) assert.equal(isOwnedParticipantAvatarPath(path, owner), false);
});

test('unsigned and cross-origin requests cannot write or upload', async () => {
  const unsigned = await endpoint({ unsigned: true });
  assert.equal((await unsigned.post({ kind: 'upload', file: image })).status, 401);
  const foreign = await endpoint();
  assert.equal((await foreign.post({ kind: 'preset', preset: 'mia' }, 'https://attacker.test')).status, 403);
  assert.equal(unsigned.calls.writes.length + foreign.calls.writes.length, 0);
  assert.equal(unsigned.calls.uploads.length + foreign.calls.uploads.length, 0);
});

test('forged owner/path/moderation fields are ignored for presets', async () => {
  const api = await endpoint();
  const result = await api.post({ kind: 'preset', preset: 'mia', id: other, avatar_path: 'forged', avatar_moderation_status: 'approved' });
  assert.equal(result.status, 200);
  assert.deepEqual(api.calls.writes[0].body, { avatar_kind: 'preset', avatar_preset: 'mia', avatar_path: null, avatar_moderation_status: 'approved' });
  const query = new URL(api.calls.writes[0].path, 'https://example.test').searchParams;
  assert.equal(query.get('id'), `eq.${owner}`);
});

test('repeated photo replacements receive distinct owned paths', async () => {
  const api = await endpoint();
  const a = await api.post({ kind: 'upload', file: image });
  const b = await api.post({ kind: 'upload', file: image });
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
  assert.notEqual(a.body.avatar.path, b.body.avatar.path);
  assert.equal(isOwnedParticipantAvatarPath(a.body.avatar.path, owner), true);
  assert.equal(isOwnedParticipantAvatarPath(b.body.avatar.path, owner), true);
});

test('pending moderation cannot be overridden by the participant', async () => {
  const api = await endpoint({ moderation: 'pending_review' });
  const result = await api.post({ kind: 'upload', file: image, avatar_moderation_status: 'approved' });
  assert.equal(result.status, 200);
  assert.equal(result.body.avatar.moderationStatus, 'pending_review');
});

test('rejected or foreign-path uploads cannot replace the saved avatar', async () => {
  const rejected = await endpoint({ moderation: 'rejected' });
  assert.equal((await rejected.post({ kind: 'upload', file: image })).status, 422);
  assert.equal(rejected.calls.writes.length, 0);
  const foreign = await endpoint({ foreignPath: `future-uploads/participant-avatars/${other}/1-avatar.jpg` });
  assert.equal((await foreign.post({ kind: 'upload', file: image })).status, 500);
  assert.equal(foreign.calls.writes.length, 0);
});

test('concurrent replacement reports a conflict and retains uploads', async () => {
  const oldPath = `future-uploads/participant-avatars/${owner}/1-original.jpg`;
  const api = await endpoint({ oldPath, conflict: true });
  const result = await api.post({ kind: 'upload', file: image });
  assert.equal(result.status, 409);
  const query = new URL(api.calls.writes[0].path, 'https://example.test').searchParams;
  assert.equal(query.get('avatar_path'), `eq.${oldPath}`);
});

test('invalid selections, oversized files, and missing profiles cannot write', async () => {
  const api = await endpoint();
  assert.equal((await api.post({ kind: 'preset', preset: 'unknown' })).status, 400);
  assert.equal((await api.post({ kind: 'upload', file: { ...image, size: 6 * 1024 * 1024 } })).status, 400);
  assert.equal(api.calls.writes.length, 0);
  const missing = await endpoint({ missingProfile: true });
  assert.equal((await missing.post({ kind: 'upload', file: image })).status, 409);
  assert.equal(missing.calls.uploads.length, 0);
});
