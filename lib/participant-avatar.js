const UUID_PATTERN = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

// Accept both original pilot paths and unique replacement-upload paths.
export function isOwnedParticipantAvatarPath(storagePath, userId) {
  if (!new RegExp(`^${UUID_PATTERN}$`, 'i').test(String(userId || ''))) return false;
  const parts = String(storagePath || '').split('/');
  if (parts.length !== 4 || parts[0] !== 'future-uploads' || parts[1] !== 'participant-avatars') return false;
  const owner = parts[2];
  const isOwned = owner === userId
    || new RegExp(`^${userId}-${UUID_PATTERN}$`, 'i').test(owner);
  return isOwned && /^[a-zA-Z0-9_-][a-zA-Z0-9._-]*\.jpg$/.test(parts[3]);
}
