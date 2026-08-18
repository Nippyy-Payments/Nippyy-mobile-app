import type { IconName } from '@/components/icons';

export type MenuItem = {
  label: string;
  sub?: string;
  icon: IconName;
  /** An in-app destination. Mutually exclusive with `href`. */
  to?: string;
  /** An external destination — the row gets the external affordance. */
  href?: string;
  chip?: string;
  danger?: boolean;
};

export type MenuGroup = {
  title: string;
  items: MenuItem[];
};

/**
 * The account menu.
 *
 * The affordance names the destination: anything with `href` opens a browser
 * tab and shows the external glyph; everything else pushes a screen and shows
 * a chevron. Getting that wrong makes every row a guess.
 */
export const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Trust & security',
    items: [
      {
        label: 'Verification',
        sub: 'Upgrade for higher limits',
        chip: 'Tier 1',
        icon: 'shield',
        to: '/onboarding/verify',
      },
      {
        label: 'Account tiers',
        sub: 'Deposit, withdrawal and balance limits',
        icon: 'chart',
        to: '/account/tiers',
      },
      {
        label: 'Security centre',
        sub: 'PIN, Face ID, devices',
        icon: 'lock',
        to: '/account/security',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Manage recipients', sub: '4 saved', icon: 'people', to: '/recipients' },
      { label: 'Rates and fees', sub: 'What a transfer costs', icon: 'rate', to: '/money/rates' },
      {
        label: 'Notifications',
        sub: 'Money, rates, security',
        icon: 'bell',
        to: '/account/notifications',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & support', sub: 'Chat, email, help centre', icon: 'help', to: '/support' },
      { label: 'FAQ', icon: 'help', href: 'https://nippyy.com/faq' },
    ],
  },
  {
    title: 'Legal & privacy',
    items: [
      { label: 'Privacy policy', icon: 'doc', href: 'https://nippyy.com/privacy-policy' },
      { label: 'Terms of use', icon: 'doc', href: 'https://nippyy.com/terms' },
      { label: 'Acceptable use policy', icon: 'doc', href: 'https://nippyy.com/acceptable-use' },
    ],
  },
  {
    title: 'Danger zone',
    items: [
      {
        label: 'Close account',
        sub: 'Delete your profile and recipients',
        icon: 'trash',
        danger: true,
        to: '/account/close',
      },
    ],
  },
];

export const SUPPORT_CONTACT = [
  {
    label: 'Chat with support',
    sub: 'Start a conversation with our team',
    icon: 'chat' as IconName,
    to: '/support/chat',
  },
  {
    label: 'Send us an email',
    sub: 'contact@nippyy.com',
    icon: 'mail' as IconName,
    href: 'mailto:contact@nippyy.com',
  },
  {
    label: 'Visit help center',
    icon: 'headset' as IconName,
    href: 'https://nippyy.com/support',
  },
];

export const SOCIAL_LINKS = [
  { label: 'Twitter / X', icon: 'twitter' as IconName, href: 'https://x.com/nippyyhq' },
  { label: 'Instagram', icon: 'instagram' as IconName, href: 'https://www.instagram.com/nippyyhq' },
  { label: 'Facebook', icon: 'facebook' as IconName, href: 'https://www.facebook.com/nippyy' },
  {
    label: 'Linkedin',
    icon: 'linkedin' as IconName,
    href: 'https://www.linkedin.com/company/nippyy/',
  },
];

export const DEVICES = [
  { name: 'iPhone 15 Pro', sub: 'Lagos · this device', current: true },
  { name: 'MacBook Air', sub: 'Lagos · 2 days ago', current: false },
  { name: 'iPad (9th gen)', sub: 'London · 3 weeks ago', current: false },
];

export const CLOSE_FACTS = [
  {
    heading: 'Your transfers stop immediately',
    body: 'Anything already on its way still completes. Track it from the email receipt.',
  },
  {
    heading: 'Your nippyy tag is released',
    body: '@tobi.adeyemi becomes available to someone else after 90 days.',
  },
  {
    heading: 'We keep some records',
    body: 'Money-transfer law requires us to hold transaction records for five years. Everything else is deleted.',
  },
  {
    heading: 'You can come back',
    body: 'Signing up again is fine, but you start at Tier 0 and verify from scratch.',
  },
];

export const CLOSE_REASONS = [
  'Fees too high',
  'Rates too low',
  'Using another app',
  'Not sending any more',
  'Something went wrong',
];

/** Typed exactly, to confirm closing the account. */
export const CLOSE_CONFIRMATION = 'CLOSE';
