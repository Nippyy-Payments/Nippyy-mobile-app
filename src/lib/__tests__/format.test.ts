import { convert, formatAmount, formatMoney, formatWhen, sumAmounts } from '@/lib/format';
import { currency } from '@/lib/currency';

describe('formatAmount', () => {
  it('groups thousands', () => {
    expect(formatAmount('1250000', 'NGN')).toBe('1,250,000');
  });

  it('quotes naira without decimals, as the design does', () => {
    expect(formatAmount('1250000.00', 'NGN')).toBe('1,250,000');
  });

  it('keeps two decimals on sterling', () => {
    expect(formatAmount('840.2', 'GBP')).toBe('840.20');
  });

  it('does not drift on values that float badly', () => {
    // The whole reason amounts stay strings: Number("8311.51") * 100 is
    // 831150.9999999999, and a naive round-trip shows it.
    expect(formatAmount('8311.51', 'GBP')).toBe('8,311.51');
  });

  it('keeps the sign in front of the grouping', () => {
    expect(formatAmount('-200000', 'NGN')).toBe('-200,000');
  });

  it('handles a bare zero', () => {
    expect(formatAmount('0.00', 'USDC')).toBe('0.00');
  });
});

describe('formatMoney', () => {
  it('prefixes the currency symbol', () => {
    expect(formatMoney('840.20', 'GBP')).toBe('£840.20');
    expect(formatMoney('1250000', 'NGN')).toBe('₦1,250,000');
    expect(formatMoney('1500', 'GHS')).toBe('₵1,500');
  });
});

describe('sumAmounts', () => {
  it('adds without floating-point drift', () => {
    expect(sumAmounts(['0.10', '0.20'], 'GBP')).toBe('0.30');
  });

  it('respects the currency scale', () => {
    expect(sumAmounts(['1250000', '1667797'], 'NGN')).toBe('2917797');
  });
});

describe('convert', () => {
  const rates = { 'GBP-NGN': 1985, 'NGN-GBP': 1 / 1985 };

  it('returns the amount unchanged for the same currency', () => {
    expect(convert('200', 'GBP', 'GBP', rates)).toBe('200');
  });

  it('converts to the target currency scale', () => {
    expect(convert('200', 'GBP', 'NGN', rates)).toBe('397000');
  });

  it('returns zero rather than NaN when no rate exists', () => {
    expect(convert('200', 'GBP', 'KES', rates)).toBe('0');
  });
});

describe('currency metadata', () => {
  it('supplies what the wallets endpoint does not', () => {
    const ngn = currency('NGN');

    expect(ngn.name).toBe('Nigerian naira');
    expect(ngn.symbol).toBe('₦');
    expect(ngn.capability).toBe('Send, pay bills, withdraw');
  });

  it('degrades safely for an unknown code', () => {
    expect(currency('XAF').name).toBe('XAF');
  });
});

describe('formatWhen', () => {
  const now = new Date('2026-08-18T20:00:00Z');

  it('shows a time for today', () => {
    expect(formatWhen('2026-08-18T07:52:00Z', now)).toMatch(/\d{2}:\d{2}/);
  });

  it('shows a weekday within the last week', () => {
    expect(formatWhen('2026-08-16T09:00:00Z', now)).toMatch(/^[A-Z][a-z]{2}$/);
  });

  it('shows a date beyond a week', () => {
    expect(formatWhen('2026-07-01T09:00:00Z', now)).toMatch(/Jul/);
  });
});
