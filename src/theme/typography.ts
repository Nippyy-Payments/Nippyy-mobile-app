import type { TextStyle } from 'react-native';

import { tabularNums, typography } from './tokens';

/**
 * The design's type roles as React Native `TextStyle` objects.
 *
 * Roles are flattened to single names (`buttonLg`, `amountFieldXl`) so a
 * variant is one string. Money roles automatically carry tabular figures, so
 * no call site has to remember `fontVariant` — columns of amounts align and
 * digits do not shift as a value updates.
 */
const roles = {
  screenTitle: typography.screenTitle,
  celebrationTitle: typography.celebrationTitle,
  flowTitle: typography.flowTitle,
  screenHeader: typography.screenHeader,
  cardTitle: typography.cardTitle,
  greeting: typography.greeting,
  emptyTitle: typography.emptyTitle,
  journeyLabel: typography.journeyLabel,

  body: typography.body,
  bodyStrong: typography.bodyStrong,
  label: typography.label,
  labelMuted: typography.labelMuted,
  caption: typography.caption,
  captionStrong: typography.captionStrong,
  micro: typography.micro,
  microStrong: typography.microStrong,
  input: typography.input,

  buttonSm: typography.button.sm,
  buttonMd: typography.button.md,
  buttonLg: typography.button.lg,

  money: typography.money,
  moneySm: typography.moneySm,
  balanceHero: typography.balanceHero,
  balance: typography.balance,
  amountHero: typography.amountHero,
  amountHeroMd: typography.amountHeroMd,
  amountHeroSm: typography.amountHeroSm,
  amountDetail: typography.amountDetail,
  amountFlow: typography.amountFlow,
  amountStepper: typography.amountStepper,
  amountFieldXl: typography.amountField.xl,
  amountFieldLg: typography.amountField.lg,
  amountFieldMd: typography.amountField.md,
  amountFieldSm: typography.amountField.sm,
  amountFieldSymbol: typography.amountFieldSymbol,
  otpDigit: typography.otpDigit,
  keypadKey: typography.keypadKey,
  keypadDot: typography.keypadDot,
  phoneNumber: typography.phoneNumber,
  tokenCode: typography.tokenCode,
  addressCode: typography.addressCode,
} as const;

export type TypeVariant = keyof typeof roles;

/** Roles that render figures, and therefore need even-width digits. */
const numericRoles: ReadonlySet<TypeVariant> = new Set<TypeVariant>([
  'money',
  'moneySm',
  'balanceHero',
  'balance',
  'amountHero',
  'amountHeroMd',
  'amountHeroSm',
  'amountDetail',
  'amountFlow',
  'amountStepper',
  'amountFieldXl',
  'amountFieldLg',
  'amountFieldMd',
  'amountFieldSm',
  'amountFieldSymbol',
  'otpDigit',
  'keypadKey',
  'keypadDot',
  'phoneNumber',
  'tokenCode',
  'addressCode',
]);

export const textStyles = Object.fromEntries(
  (Object.keys(roles) as TypeVariant[]).map((name) => {
    const role = roles[name];
    const style: TextStyle = {
      fontFamily: role.fontFamily,
      fontSize: role.fontSize,
      lineHeight: role.lineHeight,
      letterSpacing: role.letterSpacing,
    };
    if (numericRoles.has(name)) style.fontVariant = [...tabularNums];
    return [name, style];
  })
) as Record<TypeVariant, TextStyle>;

export { roles as typeRoles };
