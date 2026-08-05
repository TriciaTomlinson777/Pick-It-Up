function getEnv(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : fallback;
}

export function getSupabaseServerConfig() {
  const url = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const publishableKey =
    getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return {
    url,
    serviceRoleKey,
    publishableKey,
    isConfigured: Boolean(url && serviceRoleKey),
    isReadConfigured: Boolean(url && (serviceRoleKey || publishableKey)),
  };
}

export function getBlogImagesBucketName() {
  return getEnv('SUPABASE_BLOG_IMAGES_BUCKET') || 'Community Photos';
}

export async function supabaseServerFetch(path, options = {}) {
  const { url, serviceRoleKey, publishableKey, isConfigured, isReadConfigured } =
    getSupabaseServerConfig();

  const requireServiceRole = options.requireServiceRole !== false;

  if (requireServiceRole && !isConfigured) {
    throw new Error(
      'Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  if (!requireServiceRole && !isReadConfigured) {
    throw new Error(
      'Supabase read configuration is missing. Set SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
  }

  const credential = serviceRoleKey || publishableKey;

  const requestUrl = `${url.replace(/\/$/, '')}${path}`;
  const headers = {
    apikey: credential,
    Authorization: `Bearer ${credential}`,
    ...options.headers,
  };

  const { requireServiceRole: _unused, ...forwardOptions } = options;

  return fetch(requestUrl, {
    ...forwardOptions,
    headers,
    cache: 'no-store',
  });
}
