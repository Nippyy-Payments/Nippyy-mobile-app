/**
 * Presentation metadata for a currency.
 *
 * The wallets endpoint returns money and nothing else — no flag, no display
 * name, no symbol, none of the "what you can do with it" copy the design puts
 * on every wallet row (PORTING_PLAN.md §8.7). The server owns the money; the
 * client owns how it reads, so that lives here.
 *
 * Flags are emoji, per the ruling in §8.10. On a platform without an emoji
 * font they degrade to letter pairs.
 */
export type CurrencyCode = 'NGN' | 'GBP' | 'USD' | 'EUR' | 'KES' | 'GHS' | 'USDC';

export type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  flag: string;
  /** Sentence case, as the design writes it. */
  name: string;
  /** The row's second line: what this wallet is for. */
  capability: string;
  /** Naira and the stablecoin are quoted whole; the rest carry decimals. */
  decimals: number;
};

const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    flag: '🇳🇬',
    name: 'Nigerian naira',
    capability: 'Send, pay bills, withdraw',
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    name: 'British pound',
    capability: 'Send and convert',
    decimals: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    name: 'US dollar',
    capability: 'Send and convert',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    name: 'Euro',
    capability: 'Send and convert',
    decimals: 2,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    flag: '🇰🇪',
    name: 'Kenyan shilling',
    capability: 'Send and convert',
    decimals: 0,
  },
  GHS: {
    code: 'GHS',
    symbol: '₵',
    flag: '🇬🇭',
    name: 'Ghanaian cedi',
    capability: 'Send and convert',
    decimals: 0,
  },
  USDC: {
    code: 'USDC',
    symbol: '$',
    // USDC has no country. The design shows the symbol in the flag slot.
    flag: '$',
    name: 'USD Coin',
    capability: 'Deposit stablecoin',
    decimals: 2,
  },
};

/** The only stablecoin nippyy supports. There is no coin switcher anywhere. */
export const STABLECOIN: CurrencyCode = 'USDC';

export function currency(code: string): CurrencyMeta {
  return CURRENCIES[code as CurrencyCode] ?? {
    code: code as CurrencyCode,
    symbol: '',
    flag: '',
    name: code,
    capability: '',
    decimals: 2,
  };
}
