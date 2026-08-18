import { currency, type CurrencyCode } from './currency';

/**
 * Money formatting.
 *
 * The API sends amounts as strings ("8311.51") and they stay strings all the
 * way to the screen. Parsing to a float to display a balance is how you get
 * `8311.509999`, so the only place a number appears is where arithmetic is
 * genuinely required, and it is rounded back immediately.
 */

/** Groups the integer part and trims or pads decimals to the currency's scale. */
export function formatAmount(amount: string | number, code: string): string {
  const meta = currency(code);
  const raw = typeof amount === 'number' ? amount.toFixed(meta.decimals) : amount.trim();

  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;

  const [whole = '0', fraction = ''] = unsigned.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (meta.decimals === 0) return `${negative ? '-' : ''}${grouped}`;

  const padded = fraction.padEnd(meta.decimals, '0').slice(0, meta.decimals);
  return `${negative ? '-' : ''}${grouped}.${padded}`;
}

/** The same, with the currency symbol attached. */
export function formatMoney(amount: string | number, code: string): string {
  return `${currency(code).symbol}${formatAmount(amount, code)}`;
}

/**
 * Converts between currencies via a rate table.
 *
 * Returns a string in the target currency's scale, so the result can be
 * formatted without ever holding a float.
 */
export function convert(
  amount: string,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<string, number>
): string {
  if (from === to) return amount;

  const rate = rates[`${from}-${to}`];
  if (rate === undefined) return '0';

  const value = Number(amount) * rate;
  return value.toFixed(currency(to).decimals);
}

/** Sums a set of same-currency amounts without floating-point drift. */
export function sumAmounts(amounts: string[], code: CurrencyCode): string {
  const scale = 10 ** currency(code).decimals;
  const total = amounts.reduce((carry, amount) => carry + Math.round(Number(amount) * scale), 0);
  return (total / scale).toFixed(currency(code).decimals);
}

/** "07:52", "Sun", "Fri" — the design's short, human time labels. */
export function formatWhen(iso: string, now = new Date()): string {
  const at = new Date(iso);
  const sameDay = at.toDateString() === now.toDateString();
  if (sameDay) {
    return at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  const daysAgo = Math.floor((now.getTime() - at.getTime()) / 86_400_000);
  if (daysAgo < 7) return at.toLocaleDateString('en-GB', { weekday: 'short' });

  return at.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
