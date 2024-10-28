import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key from environment variable
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key';
export const stripePromise = loadStripe(STRIPE_PK);

export const STRIPE_PRICES = {
  'Digital Mailbox - 30n': 'price_digital_30n',
  'Digital Mailbox - 60n': 'price_digital_60n',
  'Physical Mailbox - Standard': 'price_physical_standard',
  'Physical Mailbox - Business': 'price_physical_business',
  'Physical Mailbox - Executive': 'price_physical_executive',
} as const;

export type PlanId = keyof typeof STRIPE_PRICES;