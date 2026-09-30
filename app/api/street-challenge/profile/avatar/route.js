import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { storeAndModerateFutureImage } from '@/lib/future-photo-moderation';
import { isOwnedParticipantAvatarPath } from '@/lib/participant-avatar';
import { supabaseServerFetch } from '@/lib/supabase-server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

const PRESET_IDS = new Set(['purple-lady', 'blue-hat-boy', 'blonde-girl', 'captain-can', 'mess-monster', 'blue-boy', 'dog', 'mia']);

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const supabase = await createParticipantServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: 'Invalid avatar request.' }, { status: 400 });
    }
    const kind = String(formData.get('kind') || '');
    const preset = String(formData.get('preset') || '');
    const file = formData.get('file');

    if (kind === 'preset' && !PRESET_IDS.has(preset)) {
      return NextResponse.json({ error: 'Choose a valid preset avatar.' }, { status: 400 });
    }
    if (!['default', 'preset', 'upload'].includes(kind)) {
      return NextResponse.json({ error: 'Choose an avatar option.' }, { status: 400 });
    }
    if (kind === 'upload' && (!file || typeof file.arrayBuffer !== 'function')) {
      return NextResponse.json({ error: 'Choose a picture to upload.' }, { status: 400 });
    }
    if (kind === 'upload' && (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)) {
      return NextResponse.json({ error: 'Choose an image of 5 MB or less.' }, { status: 400 });
    }

    const { data: previous, error: profileError } = await supabase
      .from('participant_profiles')
      .select('avatar_path')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!previous) {
      return NextResponse.json({ error: 'Your participant profile is not ready. Please sign in again.' }, { status: 409 });
    }

    let avatarPath = null;
    let moderationStatus = 'approved';
    if (kind === 'upload') {
      // Each replacement has a new private path, retaining all prior uploads.
      const uploaded = await storeAndModerateFutureImage(file, 'participant-avatars', `${user.id}-${randomUUID()}`);
      avatarPath = uploaded.storagePath;
      moderationStatus = uploaded.moderation.status;
      if (!isOwnedParticipantAvatarPath(avatarPath, user.id)) throw new Error('Invalid avatar storage path.');
      if (!['approved', 'pending_review', 'rejected'].includes(moderationStatus)) throw new Error('Invalid moderation result.');
      if (moderationStatus === 'rejected') {
        return NextResponse.json({ error: 'That picture could not be accepted. Please choose another picture or a preset avatar.' }, { status: 422 });
      }
    }

    const expected = {
      avatar_kind: kind,
      avatar_preset: kind === 'preset' ? preset : null,
      avatar_path: avatarPath,
      avatar_moderation_status: moderationStatus,
    };
    const query = new URLSearchParams({
      id: `eq.${user.id}`,
      // Prevent two uploads from replacing a profile based on the same old photo.
      avatar_path: previous.avatar_path ? `eq.${previous.avatar_path}` : 'is.null',
      select: 'id,avatar_kind,avatar_preset,avatar_path,avatar_moderation_status',
    });
    // Only the authenticated user's row can be written. Neither owner, path nor
    // moderation status comes from client-supplied profile fields.
    const response = await supabaseServerFetch(`/rest/v1/participant_profiles?${query}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(expected),
    });
    if (!response.ok) throw new Error(`Avatar update failed (${response.status}).`);
    const rows = await response.json();
    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ error: 'Your profile picture changed in another window. Reload and try again.' }, { status: 409 });
    }
    const savedProfile = Array.isArray(rows) && rows.length === 1 ? rows[0] : null;
    if (!savedProfile || savedProfile.id !== user.id
      || Object.entries(expected).some(([key, value]) => savedProfile[key] !== value)) {
      throw new Error('Participant avatar did not match the saved request.');
    }

    return NextResponse.json({
      ok: true,
      avatar: {
        kind: savedProfile.avatar_kind,
        preset: savedProfile.avatar_preset || '',
        path: savedProfile.avatar_path || '',
        moderationStatus: savedProfile.avatar_moderation_status,
      },
    });
  } catch (error) {
    console.error('Participant avatar save failed.', error);
    // Preserve uploads even if a network failure makes the save outcome uncertain.
    return NextResponse.json({ error: 'Unable to save your profile picture right now.' }, { status: 500 });
  }
}
