import { create } from 'zustand';

import type { CurrencyCode } from '@/lib/currency';

/**
 * The transfer being composed.
 *
 * It spans four routes — amount, review, sending, success — so it cannot live
 * in a screen. It is deliberately NOT persisted: a half-composed transfer
 * should not survive a restart.
 */
type SendState = {
  recipientId: string | null;
  /** The wallet paying for this transfer. Defaults to the primary (§8.7). */
  sourceWalletId: string | null;
  /** Held as a string, in the source wallet's currency. */
  amount: string;
  sourceCurrency: CurrencyCode | null;
  /** Set once the transfer completes, so the success screen can quote it. */
  reference: string | null;

  setRecipient: (id: string | null) => void;
  setSourceWallet: (id: string, currency: CurrencyCode) => void;
  setAmount: (amount: string) => void;
  pushKey: (key: string) => void;
  complete: (reference: string) => void;
  reset: () => void;
};

const EMPTY = '0';

/** Applies one keypad press to an amount string. */
export function applyKey(current: string, key: string): string {
  if (key === 'back') return current.length > 1 ? current.slice(0, -1) : EMPTY;
  if (key === '.') return current.includes('.') ? current : `${current}.`;
  // A leading zero is replaced rather than appended to.
  return current === EMPTY ? key : `${current}${key}`;
}

export const useSendStore = create<SendState>((set) => ({
  recipientId: null,
  sourceWalletId: null,
  amount: EMPTY,
  sourceCurrency: null,
  reference: null,

  setRecipient: (recipientId) => set({ recipientId }),
  setSourceWallet: (sourceWalletId, sourceCurrency) => set({ sourceWalletId, sourceCurrency }),
  setAmount: (amount) => set({ amount }),
  pushKey: (key) => set((state) => ({ amount: applyKey(state.amount, key) })),
  complete: (reference) => set({ reference }),
  reset: () =>
    set({
      recipientId: null,
      sourceWalletId: null,
      amount: EMPTY,
      sourceCurrency: null,
      reference: null,
    }),
}));
