/** Price filter values are `min-max` (NGN), matched against product list `price`. */
export const PRICE_RANGES = [
  { value: 'all', label: 'Any Price' },
  { value: '0-150000', label: 'Under ₦150,000' },
  { value: '150000-350000', label: '₦150,000 – ₦350,000' },
  { value: '350000-600000', label: '₦350,000 – ₦600,000' },
  { value: '600000-999999999', label: 'Over ₦600,000' },
] as const

export type PriceFilterValue = (typeof PRICE_RANGES)[number]['value']

export function priceFilterLabel(value: string): string {
  return PRICE_RANGES.find((r) => r.value === value)?.label ?? 'Any Price'
}
