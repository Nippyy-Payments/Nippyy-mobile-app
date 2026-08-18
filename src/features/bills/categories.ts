import type { IconName } from '@/components/icons';

/**
 * Bill categories, with the biller each one pays and the field it collects.
 *
 * Figures and copy come from the design. Only electricity returns a prepaid
 * token, which is why `token` is on the category rather than assumed.
 */
export type BillCategory = {
  id: string;
  label: string;
  icon: IconName;
  /** What the account field is called for this biller. */
  field: string;
  presets: number[];
  biller: string;
  /** Two-letter monogram used in place of a logo. */
  monogram: string;
  account: string;
  accountName: string;
  /** Prepaid meters hand back a token to key in. */
  token?: boolean;
};

export const BILL_CATEGORIES: BillCategory[] = [
  {
    id: 'airtime',
    label: 'Airtime & data',
    icon: 'billAirtime',
    field: 'Phone number',
    presets: [1000, 2000, 5000, 10000],
    biller: 'MTN Nigeria',
    monogram: 'MTN',
    account: '0803 114 2208',
    accountName: 'Ada O.',
  },
  {
    id: 'power',
    label: 'Electricity',
    icon: 'billPower',
    field: 'Meter number',
    presets: [5000, 10000, 15000, 20000],
    biller: 'Ikeja Electric',
    monogram: 'IK',
    account: '4512 8830 119',
    accountName: 'Prepaid',
    token: true,
  },
  {
    id: 'tv',
    label: 'TV & cable',
    icon: 'billTv',
    field: 'Smartcard number',
    presets: [4400, 8300, 14000, 24500],
    biller: 'DStv Nigeria',
    monogram: 'DS',
    account: '7042 119 880',
    accountName: 'Compact',
  },
  {
    id: 'net',
    label: 'Internet',
    icon: 'billNet',
    field: 'Account ID',
    presets: [9000, 15000, 25000, 40000],
    biller: 'Spectranet',
    monogram: 'SP',
    account: 'SPN-44120',
    accountName: 'Unlimited',
  },
  {
    id: 'water',
    label: 'Water',
    icon: 'billWater',
    field: 'Account number',
    presets: [3000, 6000, 9000, 12000],
    biller: 'Lagos Water',
    monogram: 'LW',
    account: 'LWC-90218',
    accountName: 'Household',
  },
  {
    id: 'school',
    label: 'School fees',
    icon: 'billSchool',
    field: 'Student ID',
    presets: [50000, 120000, 250000, 400000],
    biller: 'Remita / School',
    monogram: 'RM',
    account: 'STU-118420',
    accountName: 'Term 2',
  },
];

/** The categories offered under "Pay again". */
export const RECENT_BILLS = ['power', 'airtime', 'tv'];

export function billCategory(id: string): BillCategory | undefined {
  return BILL_CATEGORIES.find((category) => category.id === id);
}
