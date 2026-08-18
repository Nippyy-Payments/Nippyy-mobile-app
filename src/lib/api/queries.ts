import { useQuery } from '@tanstack/react-query';

import { convert, sumAmounts } from '@/lib/format';
import type { CurrencyCode } from '@/lib/currency';

import { api } from './client';
import type { RateTable, Wallet } from './types';

export const queryKeys = {
  wallets: ['wallets'] as const,
  recipients: ['recipients'] as const,
  transactions: ['transactions'] as const,
  transaction: (id: string) => ['transaction', id] as const,
  rates: ['rates'] as const,
};

export const useWallets = () => useQuery({ queryKey: queryKeys.wallets, queryFn: api.wallets });
export const useRecipients = () =>
  useQuery({ queryKey: queryKeys.recipients, queryFn: api.recipients });
export const useTransactions = () =>
  useQuery({ queryKey: queryKeys.transactions, queryFn: api.transactions });
export const useRates = () => useQuery({ queryKey: queryKeys.rates, queryFn: api.rates });

export const useTransaction = (id: string) =>
  useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => api.transaction(id),
    enabled: Boolean(id),
  });

/** The design's home currency: the total is always quoted in naira. */
export const HOME_CURRENCY: CurrencyCode = 'NGN';

/**
 * Total balance across every wallet, in naira.
 *
 * Computed on the client because the wallets endpoint returns per-wallet
 * balances only. If the server ever returns a total it should win — a
 * client-side sum can disagree with the ledger the moment a rate moves.
 */
export function totalInHomeCurrency(
  wallets: Wallet[] | undefined,
  rates: RateTable | undefined
): string | null {
  if (!wallets || !rates) return null;

  const converted = wallets.map((wallet) =>
    convert(wallet.balance, wallet.currency, HOME_CURRENCY, rates)
  );
  return sumAmounts(converted, HOME_CURRENCY);
}

/** The wallet a transfer pays from unless the user picks another (§8.7). */
export function primaryWallet(wallets: Wallet[] | undefined): Wallet | undefined {
  return wallets?.find((wallet) => wallet.primary) ?? wallets?.[0];
}
