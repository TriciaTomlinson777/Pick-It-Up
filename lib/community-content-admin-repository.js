import { supabaseServerFetch } from './supabase-server';

const CONTENT_TYPES = {
  communityAction: {
    key: 'communityAction',
    title: 'Community in Action',
    table: 'community_action_photos',
    select: 'id,image_url,image_path,caption,moderation_status,submitted_at,reviewed_at,reviewed_by,rejection_reason',
  },
  beforeAfter: {
    key: 'beforeAfter',
    title: 'Before / After',
    table: 'community_before_after_pairs',
    select: 'id,before_image_url,after_image_url,before_image_path,after_image_path,pair_caption,moderation_status,submitted_at,reviewed_at,reviewed_by,rejection_reason',
  },
  thankYous: {
    key: 'thankYous',
    title: 'Thank Yous',
    table: 'community_shares',
    select: 'id,note,image_url,image_path,moderation_status,submitted_at,reviewed_at,reviewed_by,rejection_reason',
  },
  scenicDiscoveries: {
    key: 'scenicDiscoveries',
    title: 'Scenic Discoveries',
    table: 'scenic_discoveries',
    select: 'id,caption,image_url,image_path,moderation_status,submitted_at,reviewed_at,reviewed_by,rejection_reason',
  },
};

const MODERATION_STATUSES = new Set(['approved', 'rejected', 'removed']);

function createQueryString(values) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

async function supabaseJson(path, options = {}) {
  const response = await supabaseServerFetch(path, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${message}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function normalizeRow(type, row) {
  return {
    type,
    id: String(row.id || ''),
    status: String(row.moderation_status || 'approved'),
    submittedAt: String(row.submitted_at || ''),
    reviewedAt: String(row.reviewed_at || ''),
    reviewedBy: String(row.reviewed_by || ''),
    rejectionReason: String(row.rejection_reason || ''),
    caption: String(row.caption || row.pair_caption || ''),
    note: String(row.note || ''),
    imageUrl: String(row.image_url || ''),
    imagePath: String(row.image_path || ''),
    beforeImageUrl: String(row.before_image_url || ''),
    afterImageUrl: String(row.after_image_url || ''),
    beforeImagePath: String(row.before_image_path || ''),
    afterImagePath: String(row.after_image_path || ''),
  };
}

function getContentConfig(type) {
  const config = CONTENT_TYPES[type];
  if (!config) {
    throw new Error('Unsupported content type.');
  }
  return config;
}

export function getCommunityContentSections() {
  return Object.values(CONTENT_TYPES).map(({ key, title }) => ({ key, title }));
}

export async function getAdminCommunityContent() {
  const sections = await Promise.all(
    Object.values(CONTENT_TYPES).map(async (config) => {
      const query = createQueryString({
        select: config.select,
        order: 'submitted_at.desc',
      });
      const rows = await supabaseJson(`/rest/v1/${config.table}?${query}`);

      return {
        key: config.key,
        title: config.title,
        items: Array.isArray(rows) ? rows.map((row) => normalizeRow(config.key, row)) : [],
      };
    })
  );

  return sections;
}

export async function updateAdminCommunityContentStatus(type, id, status) {
  const config = getContentConfig(type);
  if (!MODERATION_STATUSES.has(status)) {
    throw new Error('Invalid moderation status.');
  }

  const query = createQueryString({
    id: `eq.${id}`,
    select: config.select,
  });

  const rows = await supabaseJson(`/rest/v1/${config.table}?${query}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({
      moderation_status: status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'admin',
    }),
  });

  return Array.isArray(rows) && rows[0] ? normalizeRow(config.key, rows[0]) : null;
}

export async function deleteAdminCommunityContent(type, id) {
  const config = getContentConfig(type);
  const query = createQueryString({ id: `eq.${id}` });

  await supabaseJson(`/rest/v1/${config.table}?${query}`, { method: 'DELETE' });
}