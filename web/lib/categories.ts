// Centralized category definitions used across the app

export type Category = {
  slug: string; // stored in DB
  label: string; // displayed to users
  emoji?: string;
};

export const CATEGORY_OPTIONS: Category[] = [
  { slug: 'survival', label: 'Survival', emoji: '🏗️' },
  { slug: 'pvp', label: 'PvP', emoji: '⚔️' },
  { slug: 'skyblock', label: 'Skyblock', emoji: '🌌' },
  { slug: 'prison', label: 'Prison', emoji: '⛏️' },
  { slug: 'faction', label: 'Faction', emoji: '🏛️' },
  { slug: 'roleplay', label: 'Roleplay', emoji: '🎭' },
  { slug: 'creative', label: 'Creative', emoji: '🎨' },
  { slug: 'minigames', label: 'Minigames', emoji: '🎮' },
  { slug: 'pixelmon', label: 'Pixelmon', emoji: '🐉' },
  { slug: 'economy', label: 'Economy', emoji: '💰' },
  { slug: 'rpg', label: 'RPG', emoji: '🧙' },
  { slug: 'anarchy', label: 'Anarchy', emoji: '🔥' },
  { slug: 'bedwars', label: 'BedWars', emoji: '🛏️' },
  { slug: 'skywars', label: 'SkyWars', emoji: '☁️' },
];

const labelToSlugMap: Record<string, string> = CATEGORY_OPTIONS.reduce(
  (acc, c) => {
    acc[c.label.toLowerCase()] = c.slug;
    return acc;
  },
  {} as Record<string, string>
);

export function toSlug(value: string): string {
  if (!value) return value;
  const lower = value.toLowerCase();
  return labelToSlugMap[lower] || lower.replace(/\s+/g, '-');
}

export function normalizeCategories(values: string[] | null | undefined): string[] {
  if (!values) return [];
  return values.map(toSlug);
}

export function getLabelBySlug(slug: string): string {
  const found = CATEGORY_OPTIONS.find((c) => c.slug === slug);
  return found ? found.label : slug;
}


