// Shared expiration rules so every public cleanup list hides past events identically.

const SEATTLE_TIME_ZONE = 'America/Los_Angeles';

const seattleDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SEATTLE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function getSeattleTodayIsoDate(now = new Date()) {
  return seattleDateFormatter.format(now);
}

function normalizeIsoDate(value) {
  const text = String(value || '').trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : '';
}

// Falls back to the single event date when no end date is stored.
export function getEventVisibilityEndDate(event) {
  return (
    normalizeIsoDate(event?.endDate ?? event?.event_end_date) ||
    normalizeIsoDate(event?.date ?? event?.event_date)
  );
}

export function isEventVisibleToPublic(event, todayIsoDate = getSeattleTodayIsoDate()) {
  const visibilityEndDate = getEventVisibilityEndDate(event);
  if (!visibilityEndDate) {
    return true;
  }

  return visibilityEndDate >= todayIsoDate;
}

export function filterVisiblePublicEvents(events, todayIsoDate = getSeattleTodayIsoDate()) {
  if (!Array.isArray(events)) {
    return [];
  }

  return events.filter((event) => isEventVisibleToPublic(event, todayIsoDate));
}
