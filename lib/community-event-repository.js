import { supabaseServerFetch } from './supabase-server';

const TABLE = 'community_events';
const SELECT_FIELDS = '*';
const STATUSES = new Set(['pending_review', 'approved', 'rejected']);

async function supabaseJson(path, options = {}) {
  const response = await supabaseServerFetch(path, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${message}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function normalize(row) {
  return {
    id: String(row.id || ''),
    name: String(row.event_name || ''),
    organizationName: String(row.organization_name || ''),
    eventDate: String(row.event_date || ''),
    startTime: String(row.start_time || '').slice(0, 5),
    endTime: String(row.end_time || '').slice(0, 5),
    location: String(row.location || ''),
    description: String(row.description || ''),
    eventUrl: String(row.event_url || ''),
    contactName: String(row.contact_name || ''),
    contactEmail: String(row.contact_email || ''),
    contactPhone: String(row.contact_phone || ''),
    publicContactAllowed: Boolean(row.public_contact_allowed),
    imageUrl: String(row.image_url || ''),
    status: String(row.status || 'pending_review'),
    isPinned: Boolean(row.is_pinned),
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
  };
}

function clean(value) {
  return String(value || '').trim();
}

function validateInput(input, { includeContact = false } = {}) {
  const payload = {
    eventName: clean(input.eventName || input.name),
    organizationName: clean(input.organizationName),
    eventDate: clean(input.eventDate),
    startTime: clean(input.startTime),
    endTime: clean(input.endTime),
    location: clean(input.location),
    description: clean(input.description),
    eventUrl: clean(input.eventUrl),
    contactName: clean(input.contactName),
    contactEmail: clean(input.contactEmail),
    contactPhone: clean(input.contactPhone),
    publicContactAllowed: input.publicContactAllowed === true || String(input.publicContactAllowed).toLowerCase() === 'true',
    imageUrl: clean(input.imageUrl),
  };

  const required = ['eventName', 'organizationName', 'eventDate', 'startTime', 'endTime', 'location', 'description'];
  if (required.some((field) => !payload[field])) throw new Error('Please complete all required event fields.');

  if (payload.eventUrl) {
    try {
      const url = new URL(payload.eventUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      throw new Error('The public event URL must be a valid web address.');
    }
  }

  if (payload.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contactEmail)) {
    throw new Error('Please provide a valid contact email.');
  }

  return payload;
}

function toRow(payload) {
  return {
    event_name: payload.eventName,
    organization_name: payload.organizationName,
    event_date: payload.eventDate,
    start_time: payload.startTime,
    end_time: payload.endTime,
    location: payload.location,
    description: payload.description,
    event_url: payload.eventUrl,
    contact_name: payload.contactName || null,
    contact_email: payload.contactEmail || null,
    contact_phone: payload.contactPhone || null,
    public_contact_allowed: payload.publicContactAllowed,
    image_url: payload.imageUrl || null,
  };
}

export async function getPublicCommunityEvents() {
  const rows = await supabaseJson(
    `/rest/v1/${TABLE}?status=eq.approved&select=${SELECT_FIELDS}&order=is_pinned.desc,event_date.asc,start_time.asc`,
  );
  return Array.isArray(rows) ? rows.map(normalize).map((event) => {
    const { contactName, contactEmail, contactPhone, publicContactAllowed, ...publicEvent } = event;
    if (publicContactAllowed) {
      const publicContact = { name: contactName, email: contactEmail, phone: contactPhone };
      if (publicContact.name || publicContact.email || publicContact.phone) publicEvent.publicContact = publicContact;
    }
    return publicEvent;
  }) : [];
}

export async function createCommunityEvent(input) {
  const payload = validateInput(input, { includeContact: true });
  const rows = await supabaseJson(`/rest/v1/${TABLE}?select=${SELECT_FIELDS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(toRow(payload)),
  });
  return normalize(rows[0]);
}

export async function getAdminCommunityEvents() {
  const rows = await supabaseJson(`/rest/v1/${TABLE}?select=${SELECT_FIELDS}&order=status.asc,is_pinned.desc,event_date.asc,created_at.desc`);
  return Array.isArray(rows) ? rows.map(normalize) : [];
}

export async function getAdminCommunityEventById(id) {
  const rows = await supabaseJson(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&select=${SELECT_FIELDS}&limit=1`);
  return Array.isArray(rows) && rows[0] ? normalize(rows[0]) : null;
}

export async function updateCommunityEvent(id, input) {
  const payload = validateInput(input, { includeContact: true });
  const status = clean(input.status).toLowerCase() || 'pending_review';
  if (!STATUSES.has(status)) throw new Error('Invalid event status.');
  const row = { ...toRow(payload), status, is_pinned: input.isPinned === true || String(input.isPinned).toLowerCase() === 'true' };
  const rows = await supabaseJson(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&select=${SELECT_FIELDS}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  return Array.isArray(rows) && rows[0] ? normalize(rows[0]) : null;
}

export async function updateCommunityEventStatus(id, status, isPinned) {
  if (!STATUSES.has(status)) throw new Error('Invalid event status.');
  const rows = await supabaseJson(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&select=${SELECT_FIELDS}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ status, is_pinned: Boolean(isPinned) }),
  });
  return Array.isArray(rows) && rows[0] ? normalize(rows[0]) : null;
}

export async function deleteCommunityEvent(id) {
  await supabaseJson(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}
