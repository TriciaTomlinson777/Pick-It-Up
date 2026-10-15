// Only already-public storage objects may enter Next.js's shared image cache.
// Private photo routes, signed URLs and local upload previews keep their original path.
export function canOptimizePublicPhoto(src) {
  if (typeof src !== 'string' || !src) return false;
  try {
    const url = new URL(src);
    return url.protocol === 'https:'
      && url.hostname.endsWith('.supabase.co')
      && url.pathname.startsWith('/storage/v1/object/public/')
      && !url.search;
  } catch {
    return false;
  }
}
