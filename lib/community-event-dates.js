// Event dates are calendar dates in Seattle, independent of the visitor's time zone.
export function getSeattleEventDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const value = (type) => parts.find((part) => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function isCurrentCommunityEvent(event, now = new Date()) {
  return /^\d{4}-\d{2}-\d{2}$/.test(event.eventDate || '') &&
    event.eventDate >= getSeattleEventDate(now);
}
