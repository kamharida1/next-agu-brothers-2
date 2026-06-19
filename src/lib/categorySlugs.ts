import slugify from 'slugify'
import { STORE_CATEGORY_TO_GUIDE_KEY } from '@/lib/data/categoryBlogTemplates'

const SLUG_TO_STORE_CATEGORY = Object.fromEntries(
  Object.entries(STORE_CATEGORY_TO_GUIDE_KEY).map(([category, slug]) => [
    slug,
    category,
  ])
) as Record<string, string>

export function categoryToSlug(category: string): string {
  return (
    STORE_CATEGORY_TO_GUIDE_KEY[category] ??
    slugify(category, { lower: true, strict: true })
  )
}

export function categoryHref(category: string): string {
  return `/categories/${categoryToSlug(category)}`
}

/** Resolve slug to store category name using known mappings + live category list. */
export function resolveCategoryFromSlug(
  slug: string,
  categories: string[]
): string | null {
  if (SLUG_TO_STORE_CATEGORY[slug]) return SLUG_TO_STORE_CATEGORY[slug]
  return categories.find((cat) => categoryToSlug(cat) === slug) ?? null
}

/** @deprecated Use getCategoryImageSrc — kept for OG/fallbacks */
export const CATEGORY_ICONS: Record<string, string> = {
  Televisions: '📺',
  Refrigerators: '🧊',
  'Air Conditioners': '❄️',
  Generators: '⚡',
  Freezers: '🥶',
  'Gas Cookers': '🍳',
  'Washing Machines': '🫧',
  Electronics: '🔌',
}

