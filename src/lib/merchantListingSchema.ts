import { BASE_URL } from './seo'

/** Shared return policy for Product Offer structured data (Google Merchant listings). */
export const MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'NG',
  returnPolicyCategory:
    'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 7,
  returnMethod: [
    'https://schema.org/ReturnByMail',
    'https://schema.org/ReturnInStore',
  ],
  returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
  merchantReturnLink: `${BASE_URL}/terms-and-conditions#returns`,
} as const

/**
 * Nationwide shipping details for Product Offer structured data.
 * Rates vary by zone (₦0–₦15,000); maxValue reflects the upper range from shipping-rates.
 */
export const MERCHANT_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    maxValue: 15000,
    currency: 'NGN',
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'NG',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 1,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 7,
      unitCode: 'DAY',
    },
  },
} as const
