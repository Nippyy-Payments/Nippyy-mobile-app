import type { CurrencyCode } from '@/lib/currency';

/** The envelope every nippyy endpoint returns. */
export type ApiEnvelope<T> = {
  message: string;
  success: boolean;
  status: number;
  data: T;
};

export type VirtualAccount = {
  accountNumber: string;
  bankName: string;
  bankCode: string;
  accountName: string;
};

/**
 * Exactly the shape the wallets endpoint returns (PORTING_PLAN.md §8.7).
 *
 * Amounts are strings and stay strings. `balance` and `availableBalance` are
 * distinct: the wallet row shows `balance`, but anything that decides whether
 * a transfer can go ahead must use `availableBalance`.
 */
export type Wallet = {
  id: string;
  primary: boolean;
  currency: CurrencyCode;
  balance: string;
  availableBalance: string;
  virtualAccounts: VirtualAccount[];
};

export type RecipientStatus = 'verified' | 'verifying';

export type Recipient = {
  id: string;
  name: string;
  /** "GTBank · ···4471" — institution and masked account, as the design writes it. */
  handle: string;
  country: CurrencyCode;
  status: RecipientStatus;
};

export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionDirection = 'in' | 'out';
export type TransactionKind = 'transfer' | 'bill' | 'deposit';

export type Transaction = {
  id: string;
  counterparty: string;
  /** "To GTBank", "Electricity", "Received" — the row's second line, minus the time. */
  context: string;
  amount: string;
  currency: CurrencyCode;
  direction: TransactionDirection;
  status: TransactionStatus;
  kind: TransactionKind;
  createdAt: string;
  reference: string;
  /** Present on transfers: what the sender actually paid, and how. */
  paidAmount?: string;
  paidCurrency?: CurrencyCode;
  fee?: string;
  rate?: string;
  bank?: string;
};

/** Quoted as `FROM-TO`, e.g. `GBP-NGN`. */
export type RateTable = Record<string, number>;
