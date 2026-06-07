import {
  getCategoryGuideSlug,
} from '@/lib/data/categoryBlogTemplates'

const CATEGORY_META: Record<
  string,
  { description: string; intro: string; highlights: string[] }
> = {
  Televisions: {
    description:
      'Shop brand-new televisions in Nigeria — Smart TV, LED, and 4K models with warranty. Compare screen sizes, picture quality, and delivery from Agu Brothers Enugu.',
    intro:
      'Find the right TV for your living room, bedroom, or office. Agu Brothers stocks factory-fresh televisions from trusted brands — all 100% brand new with manufacturer warranty and nationwide delivery.',
    highlights: [
      'Smart TV and LED options for every budget',
      'Size guides for Nigerian living rooms',
      'Surge protection recommended for stable viewing',
    ],
  },
  Refrigerators: {
    description:
      'Buy brand-new refrigerators in Nigeria — single door, double door, and inverter models. Genuine warranty, Enugu showroom, and delivery across Nigeria from Agu Brothers.',
    intro:
      'Refrigerators are essential for Nigerian homes and businesses. Choose capacity and compressor type based on household size, generator backup, and daily power costs — we only sell brand-new units.',
    highlights: [
      'Inverter compressors for lower running costs',
      '150 L to 500 L+ capacities in stock',
      'Measure doorways before delivery',
    ],
  },
  'Air Conditioners': {
    description:
      'Shop split and window air conditioners in Nigeria. Inverter ACs, correct tonnage sizing, and expert advice from Agu Brothers — brand new with warranty.',
    intro:
      'Stay cool through dry season with correctly sized air conditioning. Split inverter units suit bedrooms and living areas; we help you match BTU/tonnage to room size and power availability.',
    highlights: [
      'Split and window AC options',
      'Inverter technology for efficiency',
      'Professional sizing guidance available',
    ],
  },
  Generators: {
    description:
      'Buy generators in Nigeria — petrol and diesel kVA options for homes and shops. Size for fridge and AC startup load. Brand-new stock at Agu Brothers with nationwide delivery.',
    intro:
      'Reliable backup power starts with correct generator sizing. Account for startup surge from refrigerators and air conditioners, not just running watts — all our generators are brand new.',
    highlights: [
      'kVA sizing for home and small business',
      'Safe outdoor operation guidance',
      'Quality cables and earthing matter',
    ],
  },
  Freezers: {
    description:
      'Shop chest and upright freezers in Nigeria. Bulk storage for homes, caterers, and retailers — brand-new freezers with warranty from Agu Brothers.',
    intro:
      'Freezers extend food storage for families and businesses. Compare chest vs upright layouts, litre capacity, and cold retention — especially important when running on generator backup.',
    highlights: [
      'Chest and upright configurations',
      'Commercial and home capacities',
      'Plan startup load on backup power',
    ],
  },
  'Gas Cookers': {
    description:
      'Buy gas cookers in Nigeria — tabletop and standing cookers with oven. Safe LPG setup, brand-new units, and delivery from Agu Brothers Enugu.',
    intro:
      'Gas cookers offer instant heat and work during power outages. Choose burner count and oven size for your kitchen; all units are factory-fresh with warranty support.',
    highlights: [
      'Standing and tabletop models',
      'Flame failure and safety features',
      'Works when grid power is out',
    ],
  },
  'Washing Machines': {
    description:
      'Shop front-load and top-load washing machines in Nigeria. 6–10 kg capacities, brand-new with warranty — Agu Brothers delivers nationwide.',
    intro:
      'Pick a washer that matches family size and water availability. Front-load models save water; top-load models are easier to load — every machine we sell is 100% brand new.',
    highlights: [
      'Front-load and top-load options',
      'Drum capacity for family size',
      'Eco cycles reduce power and water use',
    ],
  },
  Electronics: {
    description:
      'Shop electronics and accessories in Nigeria — surge protectors, AVRs, and home essentials. Brand-new products with warranty from Agu Brothers.',
    intro:
      'Protect your investment with stable power and quality accessories. From surge protection to small appliances, Agu Brothers stocks genuine brand-new electronics for Nigerian homes.',
    highlights: [
      'Surge protection for valuable gear',
      'AVR and power accessories',
      'Full manufacturer warranty',
    ],
  },
}

export function getCategoryLandingCopy(category: string) {
  const known = CATEGORY_META[category]
  if (known) return known

  const lower = category.toLowerCase()
  return {
    description: `Shop ${category} at Agu Brothers Nigeria — 100% brand-new products, secure checkout, and fast delivery from Enugu nationwide.`,
    intro: `Browse our ${lower} collection at Agu Brothers. Every item is factory-fresh with manufacturer warranty — no tokunbo or second-hand goods.`,
    highlights: [
      '100% brand new with warranty',
      'Secure Paystack checkout',
      'Nationwide delivery from Enugu',
    ],
  }
}

export function getCategoryGuidePath(category: string): string | null {
  const slug = getCategoryGuideSlug(category)
  return slug ? `/blog/${slug}` : null
}
