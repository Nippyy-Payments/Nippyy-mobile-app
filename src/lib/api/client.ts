import type { ApiEnvelope, RateTable, Recipient, Transaction, Wallet } from './types';

/**
 * The API client.
 *
 * Only the wallets response shape is known for real (PORTING_PLAN.md §8.7);
 * everything else is modelled from the design's own sample figures behind the
 * same envelope, so swapping in live endpoints is a change here and nowhere
 * else. Screens and hooks never see fixtures.
 *
 * Latency is simulated so loading and refresh states are exercised in the app
 * rather than only in tests.
 */

/**
 * Simulated latency, so loading and refresh states are exercised by hand in
 * the app. Zero under test: racing a real delay against `waitFor` makes
 * suites fail together while passing in isolation, and the delay proves
 * nothing about the code.
 */
const LATENCY_MS = process.env.NODE_ENV === 'test' ? 0 : 420;

/** Flip to make every request fail, for exercising error states by hand. */
let failNextRequests = false;

export function __setApiFailure(shouldFail: boolean) {
  failNextRequests = shouldFail;
}

async function respond<T>(data: T, message: string): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  if (failNextRequests) {
    throw new Error('We could not reach nippyy. Check your connection and try again.');
  }

  const envelope: ApiEnvelope<T> = { message, success: true, status: 200, data };
  return envelope.data;
}

const WALLETS: Wallet[] = [
  {
    id: '6974f3795209b494fb8b691f',
    primary: true,
    currency: 'NGN',
    balance: '1250000',
    availableBalance: '1250000',
    virtualAccounts: [
      {
        accountNumber: '1101470163',
        bankName: '9 payment service Bank',
        bankCode: '120001',
        accountName: 'NIPPYY/TOBI ADEYEMI',
      },
    ],
  },
  {
    id: '6974f3795209b494fb8b6920',
    primary: false,
    currency: 'GBP',
    balance: '840.20',
    availableBalance: '840.20',
    virtualAccounts: [],
  },
  {
    id: '6974f3795209b494fb8b6921',
    primary: false,
    currency: 'USD',
    balance: '310.00',
    availableBalance: '310.00',
    virtualAccounts: [],
  },
  {
    id: '6974f3795209b494fb8b6922',
    primary: false,
    currency: 'EUR',
    balance: '120.00',
    availableBalance: '120.00',
    virtualAccounts: [],
  },
  {
    id: '6974f3795209b494fb8b6923',
    primary: false,
    currency: 'USDC',
    balance: '0.00',
    availableBalance: '0.00',
    virtualAccounts: [],
  },
];

const RECIPIENTS: Recipient[] = [
  {
    id: 'ada-okeke',
    name: 'Ada Okeke',
    handle: 'GTBank · ···4471',
    country: 'NGN',
    status: 'verified',
  },
  {
    id: 'amara-njoku',
    name: 'Amara Njoku',
    handle: 'M-Pesa · ···0182',
    country: 'KES',
    status: 'verified',
  },
  {
    id: 'kwame-mensah',
    name: 'Kwame Mensah',
    handle: 'MTN MoMo · ···7729',
    country: 'GHS',
    status: 'verifying',
  },
  {
    id: 'emeka-okeke',
    name: 'Emeka Okeke',
    handle: 'Zenith · ···9930',
    country: 'NGN',
    status: 'verified',
  },
];

/** Anchored to a fixed clock so the design's relative labels stay stable. */
const NOW = new Date('2026-08-18T09:30:00Z');
const hoursAgo = (hours: number) =>
  new Date(NOW.getTime() - hours * 3_600_000).toISOString();

const TRANSACTIONS: Transaction[] = [
  {
    id: 'np-8841-2207',
    counterparty: 'Ada Okeke',
    context: 'To GTBank',
    amount: '200000',
    currency: 'NGN',
    direction: 'out',
    status: 'success',
    kind: 'transfer',
    createdAt: hoursAgo(2),
    reference: 'NP-8841-2207',
    paidAmount: '100.40',
    paidCurrency: 'GBP',
    fee: '0.40',
    rate: '1985',
    bank: 'GTBank · ···4471',
  },
  {
    id: 'np-7712-0043',
    counterparty: 'Ikeja Electric',
    context: 'Electricity',
    amount: '15000',
    currency: 'NGN',
    direction: 'out',
    status: 'success',
    kind: 'bill',
    createdAt: hoursAgo(3),
    reference: 'NP-7712-0043',
    paidAmount: '7.96',
    paidCurrency: 'GBP',
    fee: '0.40',
    rate: '1985',
  },
  {
    id: 'np-5521-8890',
    counterparty: 'Kwame Mensah',
    context: 'MTN MoMo',
    amount: '1500',
    currency: 'GHS',
    direction: 'out',
    status: 'pending',
    kind: 'transfer',
    createdAt: hoursAgo(30),
    reference: 'NP-5521-8890',
    paidAmount: '96.15',
    paidCurrency: 'GBP',
    fee: '0.40',
    rate: '15.6',
    bank: 'MTN MoMo · ···7729',
  },
  {
    id: 'np-9930-4471',
    counterparty: 'Salary — Northwind',
    context: 'Received',
    amount: '2400.00',
    currency: 'GBP',
    direction: 'in',
    status: 'success',
    kind: 'deposit',
    createdAt: hoursAgo(52),
    reference: 'NP-9930-4471',
  },
  {
    id: 'np-3390-1147',
    counterparty: 'Amara Njoku',
    context: 'M-Pesa',
    amount: '18000',
    currency: 'KES',
    direction: 'out',
    status: 'failed',
    kind: 'transfer',
    createdAt: hoursAgo(76),
    reference: 'NP-3390-1147',
    paidAmount: '104.20',
    paidCurrency: 'GBP',
    fee: '0.40',
    rate: '172.7',
    bank: 'M-Pesa · ···0182',
  },
];

const RATES: RateTable = {
  'GBP-NGN': 1985,
  'NGN-GBP': 1 / 1985,
  'USD-NGN': 1570,
  'NGN-USD': 1 / 1570,
  'EUR-NGN': 1830,
  'NGN-EUR': 1 / 1830,
  'USDC-NGN': 1570,
  'NGN-USDC': 1 / 1570,
  'GBP-USD': 1.27,
  'USD-GBP': 1 / 1.27,
  'KES-NGN': 11.5,
  'GHS-NGN': 127.2,
};

export const api = {
  wallets: () => respond(WALLETS, 'Wallets fetched successfully'),
  recipients: () => respond(RECIPIENTS, 'Recipients fetched successfully'),
  transactions: () => respond(TRANSACTIONS, 'Transactions fetched successfully'),
  transaction: (id: string) => {
    const found = TRANSACTIONS.find((transaction) => transaction.id === id);
    if (!found) return Promise.reject(new Error('We could not find that transfer.'));
    return respond(found, 'Transaction fetched successfully');
  },
  rates: () => respond(RATES, 'Rates fetched successfully'),
};
