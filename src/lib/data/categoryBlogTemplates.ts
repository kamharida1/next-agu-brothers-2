/** Maps store category (`Product.cat`) to stable auto-blog slug suffix. */
export const STORE_CATEGORY_TO_GUIDE_KEY: Record<string, string> = {
  Televisions: 'televisions',
  Refrigerators: 'refrigerators',
  'Air Conditioners': 'air-conditioners',
  Generators: 'generators',
  Freezers: 'freezers',
  'Gas Cookers': 'gas-cookers',
  'Washing Machines': 'washing-machines',
  Electronics: 'electronics',
}

const GUIDE_KEY_TO_CATEGORY = Object.fromEntries(
  Object.entries(STORE_CATEGORY_TO_GUIDE_KEY).map(([cat, key]) => [key, cat])
) as Record<string, string>

export function getCategoryGuideSlug(category: string): string | null {
  const key = STORE_CATEGORY_TO_GUIDE_KEY[category]
  return key ? `guide-${key}` : null
}

export function resolveBlogCategory(
  slug: string,
  storedCategory?: string | null
): string | null {
  if (storedCategory) return storedCategory
  if (slug.startsWith('guide-')) {
    return GUIDE_KEY_TO_CATEGORY[slug.slice(6)] ?? null
  }
  return null
}

export function hasAutoCategoryBlog(category: string): boolean {
  return Boolean(STORE_CATEGORY_TO_GUIDE_KEY[category])
}

type ProductForBlog = {
  name: string
  slug: string
  cat: string
  brand?: string
  description?: string
}

const CATEGORY_INTRO: Record<string, string> = {
  Televisions:
    'Choosing the right TV improves comfort, picture quality, and long-term value. Match screen size to viewing distance and room layout.',
  Refrigerators:
    'Refrigerator capacity and compressor type affect daily running costs — especially on generator backup. Size for your household and shopping habits.',
  'Air Conditioners':
    'Split and window units differ in noise, installation, and efficiency. Correct tonnage and inverter technology matter in Nigerian homes.',
  Generators:
    'Generator sizing must cover startup surges from fridges and ACs. Match kVA to your essential load for safe, reliable backup power.',
  Freezers:
    'Chest and upright freezers suit different storage needs. Capacity, cold retention, and startup power are key when buying in Nigeria.',
  'Gas Cookers':
    'Gas cookers need safe LPG setup, flame failure devices, and regular hose checks. Instant heat and outage-proof cooking make them popular.',
  'Washing Machines':
    'Front-load and top-load washers differ in water use, ergonomics, and price. Match drum capacity to family size and power availability.',
  Electronics:
    'Protect electronics with surge control and stable power. Choose appliances rated for your home load and backup setup.',
}

const CATEGORY_TIPS: Record<string, string[]> = {
  Televisions: [
    'Match screen size to viewing distance (43″–55″ suits many Nigerian living rooms).',
    'Prefer Full HD or 4K for larger panels; use surge protection.',
    'All Agu Brothers TVs are brand new with manufacturer warranty.',
  ],
  Refrigerators: [
    'Allow 150–450 L depending on household size.',
    'Inverter compressors reduce generator load and electricity use.',
    'Measure doorways before delivery.',
  ],
  'Air Conditioners': [
    'Size by room area — undersized units never catch up.',
    'Split inverter ACs are quieter and more efficient for bedrooms.',
    'Clean filters often during dusty season.',
  ],
  Generators: [
    'List running watts plus startup surge for fridges and ACs.',
    'Never operate indoors — carbon monoxide risk.',
    'Use correct cable gauge and earth connection.',
  ],
  Freezers: [
    'Chest units retain cold better; upright units are easier to organize.',
    'Plan litres around bulk shopping or business storage.',
    'Allow compressor startup headroom on backup power.',
  ],
  'Gas Cookers': [
    'Use certified regulators and leak-test joints with soapy water.',
    'Replace hoses every two years.',
    'Keep cylinder ventilated and upright.',
  ],
  'Washing Machines': [
    '6–8 kg capacity suits many families.',
    'Higher spin speed helps drying in humid weather.',
    'Eco cycles reduce generator fuel use.',
  ],
  Electronics: [
    'Use AVR or surge protection on valuable gear.',
    'Wait after generator startup before loading sensitive devices.',
    'Buy brand-new units with full warranty.',
  ],
}

export function buildCategoryBlogTitle(category: string, productName: string): string {
  return `${category} Buying Guide — Featuring ${productName}`
}

export function buildCategoryBlogContent(product: ProductForBlog): string {
  const intro =
    CATEGORY_INTRO[product.cat] ??
    `A practical overview of ${product.cat.toLowerCase()} for Nigerian homes — what to look for before you buy.`

  const tips = CATEGORY_TIPS[product.cat] ?? [
    'Compare capacity, power draw, and warranty before purchase.',
    'Buy brand-new products from authorised dealers.',
    'Nationwide delivery available from Agu Brothers.',
  ]

  const tipsHtml = tips.map((t) => `<li>${t}</li>`).join('')

  const brandLine = product.brand
    ? `<p>Our latest addition: <strong>${product.name}</strong> by ${product.brand} — now available at Agu Brothers.</p>`
    : `<p>Our latest addition: <strong>${product.name}</strong> — now available at Agu Brothers.</p>`

  const desc =
    product.description?.trim().slice(0, 280) ??
    'Browse specifications, warranty, and delivery options on the product page.'

  return `<p>${intro}</p>
<h2>What to look for</h2>
<ul>${tipsHtml}</ul>
<h2>Featured product</h2>
${brandLine}
<p>${desc}${product.description && product.description.length > 280 ? '…' : ''}</p>
<p><strong><a href="/product/${product.slug}">View ${product.name} — shop now</a></strong></p>
<p>All products at Agu Brothers are 100% brand new with manufacturer warranty. Questions? Visit us at 33 Ogui Road, Enugu, or contact us via WhatsApp.</p>`
}
