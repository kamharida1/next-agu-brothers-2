/** Store category (`Product.cat`) for shop links and optional catalog images. */
export const BLOG_POST_PRODUCT_CATEGORY: Record<string, string> = {
  'choose-right-tv-size-living-room': 'Televisions',
  'choose-refrigerator-capacity-family-size': 'Refrigerators',
  'inverter-vs-conventional-refrigerator-nigeria': 'Refrigerators',
  'split-vs-window-ac-nigerian-homes': 'Air Conditioners',
  'generator-sizing-guide-kva-home-appliances': 'Generators',
  'chest-vs-upright-freezer-guide': 'Freezers',
  'gas-cooker-safety-checklist-nigeria': 'Gas Cookers',
  'washing-machine-front-load-vs-top-load': 'Washing Machines',
  'surge-protectors-protect-electronics-nigeria': 'Electronics',
  'home-electronics-setup-budget-nigeria': 'Electronics',
  'smart-tv-buying-guide-nigeria': 'Televisions',
  'ac-tonnage-room-size-guide-nigeria': 'Air Conditioners',
  'diesel-vs-petrol-generator-nigeria': 'Generators',
  'standing-vs-tabletop-gas-cooker-nigeria': 'Gas Cookers',
  'single-vs-double-door-refrigerator-nigeria': 'Refrigerators',
  'inverter-ac-energy-savings-nigeria': 'Air Conditioners',
  'chest-freezer-maintenance-tips-nigeria': 'Freezers',
  'washing-machine-capacity-kg-guide': 'Washing Machines',
  'avr-voltage-regulator-buying-guide-nigeria': 'Electronics',
  '4k-vs-full-hd-tv-worth-it-nigeria': 'Televisions',
}

/** One stable image key per product type — posts about the same appliance share one image. */
export const BLOG_POST_PRODUCT_IMAGE_KEY: Record<string, string> = {
  'choose-right-tv-size-living-room': 'televisions',
  'choose-refrigerator-capacity-family-size': 'refrigerators',
  'inverter-vs-conventional-refrigerator-nigeria': 'refrigerators',
  'split-vs-window-ac-nigerian-homes': 'air-conditioners',
  'generator-sizing-guide-kva-home-appliances': 'generators',
  'chest-vs-upright-freezer-guide': 'freezers',
  'gas-cooker-safety-checklist-nigeria': 'gas-cookers',
  'washing-machine-front-load-vs-top-load': 'washing-machines',
  'surge-protectors-protect-electronics-nigeria': 'surge-protector',
  'home-electronics-setup-budget-nigeria': 'home-electronics',
  'smart-tv-buying-guide-nigeria': 'televisions',
  'ac-tonnage-room-size-guide-nigeria': 'air-conditioners',
  'diesel-vs-petrol-generator-nigeria': 'generators',
  'standing-vs-tabletop-gas-cooker-nigeria': 'gas-cookers',
  'single-vs-double-door-refrigerator-nigeria': 'refrigerators',
  'inverter-ac-energy-savings-nigeria': 'air-conditioners',
  'chest-freezer-maintenance-tips-nigeria': 'freezers',
  'washing-machine-capacity-kg-guide': 'washing-machines',
  'avr-voltage-regulator-buying-guide-nigeria': 'surge-protector',
  '4k-vs-full-hd-tv-worth-it-nigeria': 'televisions',
}

/** Verified Pexels photo ID — one per product image key. */
export const PRODUCT_IMAGE_PEXELS: Record<string, number> = {
  televisions: 716276,
  refrigerators: 2343467,
  'air-conditioners': 3812016,
  generators: 4545245,
  freezers: 6195125,
  'gas-cookers': 8055149,
  'washing-machines': 3771069,
  'surge-protector': 7937305,
  'home-electronics': 7533923,
}

export function productImageKeyForSlug(slug: string): string {
  return BLOG_POST_PRODUCT_IMAGE_KEY[slug] ?? 'home-electronics'
}

export function fallbackPexelsIdForProductKey(key: string): number {
  return PRODUCT_IMAGE_PEXELS[key] ?? 716276
}

export function fallbackPexelsIdForSlug(slug: string): number {
  return fallbackPexelsIdForProductKey(productImageKeyForSlug(slug))
}

export function allBlogProductImageKeys(): string[] {
  return [...new Set(Object.values(BLOG_POST_PRODUCT_IMAGE_KEY))]
}

export function slugsForProductImageKey(key: string): string[] {
  return Object.entries(BLOG_POST_PRODUCT_IMAGE_KEY)
    .filter(([, k]) => k === key)
    .map(([slug]) => slug)
}

export function pexelsUrlForProductKey(productKey: string): string {
  const id = fallbackPexelsIdForProductKey(productKey)
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop`
}

export const BLOG_POST_SLUGS = Object.keys(BLOG_POST_PRODUCT_CATEGORY)
