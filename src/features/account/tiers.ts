/**
 * Verification tiers and their limits.
 *
 * **This is the single source for these figures.** Five screens quote them,
 * and the design system is explicit that they must never be retyped.
 *
 * The three source documents disagree. The app build and the overview use
 * per-transaction, daily and balance limits **in naira**; the product design
 * review deck uses monthly caps in sterling and collects the phone number at
 * Tier 1. **The app wins** (PORTING_PLAN.md §8.1), so these are the app's
 * naira figures.
 */

export type TierRequirement = {
  label: string;
  met: boolean;
};

export type Tier = {
  number: 1 | 2 | 3;
  name: string;
  /** Formatted for display; "Unlimited" is a legitimate value. */
  deposit: string;
  withdrawal: string;
  balanceCap: string;
  capabilities: string[];
  requirements: TierRequirement[];
  cta: string;
};

export const TIERS: Tier[] = [
  {
    number: 1,
    name: 'Tier 1',
    deposit: '₦50,000',
    withdrawal: '₦50,000',
    balanceCap: '₦300,000',
    capabilities: ['Local transfers', 'Utility bills'],
    requirements: [{ label: 'BVN', met: true }],
    cta: 'Verify with BVN',
  },
  {
    number: 2,
    name: 'Tier 2',
    deposit: '₦200,000',
    withdrawal: '₦50,000',
    balanceCap: '₦500,000',
    capabilities: ['Higher limits'],
    requirements: [
      { label: 'NIN', met: true },
      { label: 'Liveness check', met: false },
    ],
    cta: 'Upgrade to Tier 2',
  },
  {
    number: 3,
    name: 'Tier 3',
    deposit: '₦5,000,000',
    withdrawal: '₦5,000,000',
    balanceCap: 'Unlimited',
    capabilities: ['International transfers'],
    requirements: [
      { label: 'Government ID', met: false },
      { label: 'Proof of address', met: false },
    ],
    cta: 'Upgrade to Tier 3',
  },
];

/** The tier the account is currently on. */
export const CURRENT_TIER: Tier['number'] = 1;

/** "Deposit ₦50,000 · balance cap ₦300,000" — the one-line summary. */
export function tierLimitLine(tier: Tier): string {
  return `Deposit ${tier.deposit} · balance cap ${tier.balanceCap}`;
}

/** Limits reset daily; deposits and withdrawals are counted separately. */
export const TIER_FOOTNOTE =
  'Limits reset daily at midnight WAT. Deposits and withdrawals are counted separately.';
