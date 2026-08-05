export const STORY_CATEGORIES = [
  {
    key: 'volunteer-stories',
    icon: '🌱',
    title: 'Volunteer Stories',
    description: 'Experiences and lessons learned while helping clean our community.',
  },
  {
    key: 'families-in-action',
    icon: '👨‍👩‍👧',
    title: 'Families in Action',
    description: 'Families making cleanup part of spending time together.',
  },
  {
    key: 'businesses-making-a-difference',
    icon: '🏢',
    title: 'Businesses Making a Difference',
    description: 'Companies serving their communities through volunteerism and support.',
  },
  {
    key: 'community-partners',
    icon: '🤝',
    title: 'Community Partners',
    description: 'Schools, nonprofits, churches, neighborhood groups, civic organizations, and sponsors working together.',
  },
  {
    key: 'volunteer-spotlight',
    icon: '⭐',
    title: 'Volunteer Spotlight',
    description: 'Celebrating individuals whose kindness inspires others.',
  },
  {
    key: 'cleanup-adventures',
    icon: '🎉',
    title: 'Cleanup Adventures',
    description: 'Memorable events, creative ideas, and community gatherings.',
  },
  {
    key: 'scenic-discoveries',
    icon: '🌅',
    title: 'Scenic Discoveries',
    description: 'Beautiful places volunteers discovered while making Seattle cleaner.',
  },
  {
    key: 'kindness-in-action',
    icon: '❤️',
    title: 'Kindness in Action',
    description: 'Small moments that remind us why community matters.',
  },
];

const CATEGORY_BY_KEY = new Map(STORY_CATEGORIES.map((category) => [category.key, category]));
const CATEGORY_BY_TITLE = new Map(STORY_CATEGORIES.map((category) => [category.title.toLowerCase(), category]));

export const DEFAULT_STORY_CATEGORY_KEY = STORY_CATEGORIES[0].key;

export function findStoryCategoryByValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) {
    return CATEGORY_BY_KEY.get(DEFAULT_STORY_CATEGORY_KEY);
  }

  return CATEGORY_BY_KEY.get(normalized) || CATEGORY_BY_TITLE.get(normalized) || CATEGORY_BY_KEY.get(DEFAULT_STORY_CATEGORY_KEY);
}

export function normalizeStoryCategory(value) {
  const category = findStoryCategoryByValue(value);
  return {
    categoryKey: category.key,
    categoryTitle: category.title,
  };
}
