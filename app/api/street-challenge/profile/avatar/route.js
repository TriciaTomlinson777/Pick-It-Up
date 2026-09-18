import { NextResponse } from 'next/server';
import { deleteFuturePhoto, storeAndModerateFutureImage } from '@/lib/future-photo-moderation';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

const PRESET_IDS = new Set(['sunshine', 'sprout', 'sky', 'coral']);

export async function POST(request) {
  const supabase = await createParticipantServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  const formData = await request.formData();
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

  let avatarPath = null;
  let moderationStatus = 'approved';
  try {
    if (kind === 'upload') {
      const uploaded = await storeAndModerateFutureImage(file, 'participant-avatars', user.id);
      avatarPath = uploaded.storagePath;
      moderationStatus = uploaded.moderation.status;
    }

    const { data: previous } = await supabase
      .from('participant_profiles')
      .select('avatar_path')
      .eq('id', user.id)
      .maybeSingle();
    const { error } = await supabase
      .from('participant_profiles')
      .update({
        avatar_kind: kind,
        avatar_preset: kind === 'preset' ? preset : null,
        avatar_path: avatarPath,
        avatar_moderation_status: moderationStatus,
      })
      .eq('id', user.id);
    if (error) throw error;
    if (previous?.avatar_path && previous.avatar_path !== avatarPath) await deleteFuturePhoto(previous.avatar_path);
    return NextResponse.json({ ok: true, path: avatarPath, moderationStatus });
  } catch (error) {
    if (avatarPath) await deleteFuturePhoto(avatarPath).catch(() => {});
    console.error('Participant avatar save failed.', error);
    return NextResponse.json({ error: 'Unable to save your profile picture right now.' }, { status: 500 });
  }
}