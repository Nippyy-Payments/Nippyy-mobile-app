/**
 * nippyy design tokens — the single source of truth for this app.
 *
 * Ported from `nippyy-app-ds/tokens/*.css` (colors, typography, spacing,
 * effects) which was itself extracted from the shipping build. Nothing in
 * this app may hardcode a colour, size, radius, duration or shadow: every
 * style references a token from this file.
 *
 * Porting rules applied here, because CSS and React Native disagree:
 *
 *   1. `em` letter-spacing does not exist in RN. Every tracking value is
 *      resolved to absolute px against the size it is used at, which is why
 *      the type scale is a list of named roles rather than a size ramp.
 *   2. Unitless `line-height` does not exist in RN. Every role carries an
 *      absolute px lineHeight (size x multiplier, rounded).
 *   3. A static font file cannot be synthetically weighted on Android
 *      without smearing. Roles therefore name a `fontFamily` and never a
 *      numeric `fontWeight`.
 *   4. `border-radius: 50%` does not exist in RN. Circles use size / 2, so
 *      every circular element takes its radius from `size`.
 *
 * Values marked `@review` are one-offs in the source that are worth a
 * design decision; they are listed in PORTING_PLAN.md under "Token values
 * to reconsider". They are tokenised faithfully rather than silently
 * rounded onto the grid.
 */

/* ==========================================================================
   1. Primitive scales — private. Never referenced outside this file.
   Semantic aliases below are the public surface.
   ========================================================================== */

const blue = {
  50: '#ECF8FE',
  100: '#D2EFFB',
  200: '#A6DFF6',
  300: '#74CCEF',
  400: '#3DB8E8',
  500: '#0AA5DB', // core brand cyan
  600: '#0888BB',
  700: '#0A6E97',
  800: '#0F5878',
  900: '#114863',
} as const;

const ink = {
  50: '#EDEEF5',
  100: '#D3D5E6',
  200: '#A7ABC9',
  300: '#7B81AC',
  400: '#4E5689',
  500: '#2C3470',
  600: '#1E2563',
  700: '#161C55',
  800: '#101444',
  900: '#0B0D47', // wordmark navy
  950: '#070931',
} as const;

const gray = {
  0: '#FFFFFF',
  50: '#F6F8FB',
  100: '#EEF2F7',
  200: '#E1E7EF',
  300: '#CDD6E1',
  400: '#A4B0C0',
  500: '#7A8798',
  600: '#5A6675',
  700: '#404B59',
  800: '#2A323D',
  900: '#181D26',
} as const;

const green = {
  50: '#E9F8F0',
  100: '#C6ECD8',
  400: '#3ABF85', // light fill: status dots, progress bars
  500: '#15A86B', // success / money in
  600: '#0F8C58',
  700: '#0B6E45',
} as const;

const amber = {
  50: '#FEF4E6',
  100: '#FBE2BC',
  400: '#F8BC55', // light fill: tier progress bar
  500: '#F5A623', // pending
  600: '#D88910',
} as const;

const red = {
  50: '#FDECEC',
  100: '#F9CBCB',
  500: '#E5484D', // failed
  600: '#C5333A',
} as const;

/* Dark theme re-points the scales before re-stating the aliases. A CSS alias
   resolves at its declaration site, so both halves are spelled out. */

const blueDark = { ...blue, 50: '#0E2433', 100: '#14324A', 300: '#2C6F8E', 600: '#4FC0EC', 700: '#86D4F2' } as const;
const inkDark = {
  ...ink,
  50: '#1A1E28',
  100: '#262B36',
  200: '#39404E',
  300: '#626D7A',
  400: '#7B8794',
  500: '#94A0AD',
  600: '#AFB9C5',
  700: '#CBD3DD',
  800: '#E3E8EF',
  900: '#F1F4F8',
} as const;
const grayDark = {
  ...gray,
  50: '#14181F',
  100: '#191D26',
  200: '#262B34',
  300: '#343A45',
  400: '#6E7885',
  500: '#8A94A1',
  600: '#A5AEBA',
  700: '#C3CBD5',
  800: '#DDE3EA',
  900: '#F1F4F8',
} as const;
const greenDark = { ...green, 50: '#0D2219', 100: '#16362A', 400: '#24A473', 600: '#34C58A', 700: '#63D6A6' } as const;
const amberDark = { ...amber, 50: '#241C10', 100: '#33280F', 400: '#C98F2B', 600: '#E9B65C' } as const;
const redDark = { ...red, 50: '#241315', 100: '#3B1E21', 600: '#F27A7E' } as const;

/* ==========================================================================
   2. Colours — semantic aliases. This is what components reference.
   ========================================================================== */

export type ColorTokens = {
  brand: {
    default: string;
    hover: string;
    active: string;
    soft: string;
    softHover: string;
    onBrand: string;
  };
  text: {
    strong: string;
    body: string;
    muted: string;
    subtle: string;
    link: string;
    onBrand: string;
    onInk: string;
    /** Disabled/placeholder glyphs inside fields and empty-state icons. */
    placeholder: string;
  };
  surface: {
    page: string;
    card: string;
    /** Soft fill for inert blocks — the app's main separation device. */
    quiet: string;
    /** Pressed / recessed fill. */
    sunken: string;
    raised: string;
    ink: string;
    inkSoft: string;
    brand: string;
    overlay: string;
    /** Field fill when disabled. */
    disabled: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    brand: string;
    focus: string;
  };
  status: {
    success: string;
    successSoft: string;
    successBorder: string;
    successText: string;
    warning: string;
    warningSoft: string;
    warningBorder: string;
    warningText: string;
    danger: string;
    dangerSoft: string;
    dangerBorder: string;
    dangerText: string;
    info: string;
    infoSoft: string;
    infoBorder: string;
    infoText: string;
    neutralSoft: string;
    neutralText: string;
    neutralMain: string;
  };
  /** Light 400 steps. At 6-8px a 500-weight fill reads almost black, which
   *  is the entire reason these steps exist. Dots and progress fills only. */
  indicator: {
    success: string;
    pending: string;
    danger: string;
    brand: string;
    neutral: string;
    /** Track behind a progress fill / unfilled segment. */
    track: string;
  };
  money: {
    in: string;
    /** Money out is INK, not red — sending is the point of the app. */
    out: string;
    pending: string;
  };
  /** Deterministic avatar tints, indexed by a hash of the name. */
  avatar: ReadonlyArray<{ bg: string; fg: string }>;
  chrome: {
    /** The one translucent surface in the system. */
    tabBar: string;
    /** Web-only: the desk the mobile column sits on at desktop widths. */
    desk: string;
    /** Toggle knob and any element that must stay white on a brand fill. */
    knob: string;
  };
};

export const lightColors: ColorTokens = {
  brand: {
    default: blue[500],
    hover: blue[600],
    active: blue[700],
    soft: '#EAF6FC', // @review app value, not blue.50 (#ECF8FE) — two near-identical tints
    softHover: blue[100],
    onBrand: '#FFFFFF',
  },
  text: {
    strong: ink[900],
    body: gray[800],
    muted: gray[600],
    subtle: gray[500],
    link: blue[600],
    onBrand: '#FFFFFF',
    onInk: '#FFFFFF',
    placeholder: ink[400],
  },
  surface: {
    page: '#FFFFFF',
    card: '#FFFFFF',
    quiet: '#F5F7FA',
    sunken: '#EDF1F6',
    raised: '#FFFFFF',
    ink: ink[900],
    inkSoft: ink[800],
    brand: blue[500],
    overlay: 'rgba(11, 13, 71, 0.55)',
    disabled: gray[50],
  },
  border: {
    subtle: '#EAEEF3',
    default: '#DFE5EC',
    strong: gray[400],
    brand: blue[500],
    focus: blue[500],
  },
  status: {
    success: green[500],
    successSoft: green[50],
    successBorder: green[100],
    successText: green[700],
    warning: amber[500],
    warningSoft: amber[50],
    warningBorder: amber[100],
    warningText: amber[600],
    danger: red[500],
    dangerSoft: red[50],
    dangerBorder: red[100],
    dangerText: red[600],
    info: blue[500],
    infoSoft: blue[50],
    infoBorder: blue[100],
    infoText: blue[700],
    neutralSoft: gray[100],
    neutralText: gray[700],
    neutralMain: gray[500],
  },
  indicator: {
    success: green[400],
    pending: amber[400],
    danger: red[500],
    brand: blue[500],
    neutral: gray[400],
    track: gray[200],
  },
  money: {
    in: green[600],
    out: ink[900],
    pending: amber[600],
  },
  avatar: [
    { bg: blue[100], fg: blue[700] },
    { bg: ink[100], fg: ink[700] },
    { bg: green[100], fg: green[700] },
    { bg: amber[100], fg: amber[600] },
  ],
  chrome: {
    tabBar: 'rgba(255, 255, 255, 0.94)',
    desk: '#E9EDF2',
    knob: '#FFFFFF',
  },
};

export const darkColors: ColorTokens = {
  brand: {
    default: blue[500],
    hover: '#4FC0EC',
    active: '#86D4F2',
    soft: '#10283A',
    softHover: '#16354C',
    onBrand: '#FFFFFF',
  },
  text: {
    strong: '#F1F4F8',
    body: '#DDE3EA',
    muted: '#97A2AF',
    subtle: '#77828F',
    link: blueDark[600],
    onBrand: '#FFFFFF',
    onInk: '#0E1016',
    placeholder: inkDark[400],
  },
  surface: {
    page: '#101319',
    card: '#191D26',
    quiet: '#191D26',
    sunken: '#22262F',
    raised: '#191D26',
    ink: '#F1F4F8',
    inkSoft: '#E3E8EF',
    brand: blue[500],
    overlay: 'rgba(4, 6, 12, 0.66)',
    disabled: grayDark[50],
  },
  border: {
    subtle: '#23272F',
    default: '#2E3340',
    strong: '#414957',
    brand: blue[500],
    focus: blue[500],
  },
  status: {
    success: green[500],
    successSoft: '#10281E',
    successBorder: greenDark[100],
    successText: greenDark[700],
    warning: amber[500],
    warningSoft: '#2A2113',
    warningBorder: amberDark[100],
    warningText: amberDark[600],
    danger: red[500],
    dangerSoft: '#2B1518',
    dangerBorder: redDark[100],
    dangerText: redDark[600],
    info: blue[500],
    infoSoft: '#0E2433',
    infoBorder: blueDark[100],
    infoText: blueDark[700],
    neutralSoft: grayDark[100],
    neutralText: grayDark[700],
    neutralMain: grayDark[500],
  },
  indicator: {
    success: greenDark[400],
    pending: amberDark[400],
    danger: red[500],
    brand: blue[500],
    neutral: grayDark[400],
    track: grayDark[200],
  },
  money: {
    in: '#34C58A',
    out: '#F1F4F8',
    pending: '#E9B65C',
  },
  avatar: [
    { bg: blueDark[100], fg: blueDark[700] },
    { bg: inkDark[100], fg: inkDark[700] },
    { bg: greenDark[100], fg: greenDark[700] },
    { bg: amberDark[100], fg: amberDark[600] },
  ],
  chrome: {
    tabBar: 'rgba(16, 19, 25, 0.94)',
    desk: '#0A0C11',
    knob: '#FFFFFF',
  },
};

/* ==========================================================================
   3. Spacing — 4px grid, plus the named off-grid values the design uses.
   ========================================================================== */

export const spacing = {
  none: 0,
  /** 4px grid. */
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
} as const;

/**
 * Off-grid values the design uses deliberately. Named so no call site has to
 * write a number. Each is flagged in PORTING_PLAN.md.
 */
export const spacingRaw = {
  /** ListRow / ToggleRow gap between the leading tile and the text. @review 13 */
  rowLeadingGap: 13,
  /** Home greeting bar gap between avatar and name. @review 11 */
  greetingGap: 11,
  /** Gap inside a stacked button pair. @review 9 */
  buttonStackGap: 9,
  /** Tight inline gap — chip internals, status bar icons. @review 7 */
  inlineTight: 7,
  /** ListRow vertical padding. */
  rowPaddingY: 16,
  /** TransactionRow vertical padding. @review 14 */
  txnRowPaddingY: 14,
  /** Gap between a section's last row and the next SectionLabel. @review 26 */
  sectionGapSm: 26,
  /** Home: balance block to primary action. @review 30 */
  sectionGapMd: 30,
  /** Home: primary action to "Your people". @review 36 */
  sectionGapLg: 36,
  /** Bottom padding on a tab screen so content clears the tab bar. */
  tabScreenBottom: 120,
} as const;

/** Page gutters. Settings screens run tighter than the rest. */
export const gutter = {
  default: 24,
  /** Security centre, devices. */
  tight: 20,
  /** Bills. @review 22 — a third gutter for one screen */
  bills: 22,
} as const;

/* ==========================================================================
   4. Radii — nothing sharp. Circles use size / 2, not a radius token.
   ========================================================================== */

export const radii = {
  xs: 6,
  sm: 10,
  /** Fields, keys, icon buttons. */
  md: 12,
  /** Cards, blocks, tiles. */
  lg: 16,
  xl: 20,
  '2xl': 24,
  pill: 999,
  /** Progress track / bar caps. */
  track: 3,
} as const;

/** Role aliases, so a call site says what it means. */
export const radius = {
  card: radii.lg,
  field: radii.md,
  tile: radii.md,
  chip: radii.pill,
  button: { sm: radii.sm, md: radii.md, lg: radii.lg },
  alert: radii.md,
  amountField: radii.xl,
} as const;

/* ==========================================================================
   5. Sizing — control heights and component dimensions.
   ========================================================================== */

export const size = {
  /** Nothing interactive goes below this. */
  tapMin: 44,
  /** List / recipient / transaction row. */
  rowMin: 56,
  field: { sm: 38, md: 52, lg: 56 },
  button: { sm: 38, md: 52, lg: 56 },
  iconButton: { sm: 34, md: 42, lg: 46 },
  avatar: { xs: 28, sm: 36, md: 44, lg: 56, xl: 72 },
  /** RowTile — the rounded square that leads a row. */
  tile: { sm: 38, md: 40, lg: 44 },
  badge: { sm: 20, md: 24, lg: 28 },
  chip: { sm: 30, md: 34, lg: 38 },
  /** Toggle track and knob. */
  toggle: { width: 46, height: 28, knob: 22, inset: 3 },
  /** OTP box (6-digit code) — PIN uses `pinDot`. */
  otpBox: { width: 46, height: 56 },
  pinDot: 14,
  keypadKey: 46,
  /** Journey step nodes. */
  journeyNode: { horizontal: 22, vertical: 32 },
  /** The ring that punches the journey node through its connector line. */
  journeyNodeRing: 4,
  journeyConnector: { horizontal: 2, vertical: 3 },
  /** StatusDot default. */
  dot: 7,
  progress: { continuous: 6, segmented: 5 },
  emptyStateIcon: 64,
  successBurst: 104,
  tabBarHeight: 76,
  tabItemWidth: 54,
  tabSendButton: 46,
  /** Icon glyph sizes used across the app. */
  icon: { xs: 13, sm: 15, md: 18, lg: 20, xl: 26, '2xl': 28 },
} as const;

/* ==========================================================================
   6. Layout — this phase is mobile-only. No breakpoints.
   ========================================================================== */

export const layout = {
  /**
   * Web only: the app column is capped and centred so a desktop browser
   * shows the mobile layout instead of a stretched one. Applied in exactly
   * one place (the root layout), never per screen.
   */
  maxWidth: 430,
  /** The width the design was drawn at. Reference only — never a container width. */
  designWidth: 390,
} as const;

/* ==========================================================================
   7. Typography
   ========================================================================== */

/**
 * The two families are final: Montserrat for display and headings, Space
 * Grotesk for UI text AND all money (its figures are already even-width).
 * Do not substitute — not Plus Jakarta Sans, not JetBrains Mono.
 *
 * Keys match the names registered with expo-font, which match the exports
 * of @expo-google-fonts/montserrat and @expo-google-fonts/space-grotesk.
 *
 * The source CSS also requests Montserrat 800; nothing in the design uses
 * it, so it is not loaded. No italic is used anywhere, and neither family
 * ships one here — never synthesise it.
 */
export const fontFamily = {
  displayMedium: 'Montserrat_500Medium',
  displaySemiBold: 'Montserrat_600SemiBold',
  displayBold: 'Montserrat_700Bold',
  sansRegular: 'SpaceGrotesk_400Regular',
  sansMedium: 'SpaceGrotesk_500Medium',
  sansSemiBold: 'SpaceGrotesk_600SemiBold',
  sansBold: 'SpaceGrotesk_700Bold',
} as const;

/** Money and any figure that must not shift width as it updates. */
export const tabularNums = ['tabular-nums'] as const;

export type TypeRole = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

/**
 * The type scale, as roles rather than a size ramp — because tracking is
 * `em` in the source and must resolve against a specific size.
 *
 * Every `Text` in the app spreads exactly one of these.
 */
export const typography = {
  /* --- Display: Montserrat ------------------------------------------- */

  /** 34px root screen title. A pushed screen gets `screenHeader` instead;
   *  that size gap is the app's only depth cue. */
  screenTitle: { fontFamily: fontFamily.displayBold, fontSize: 34, lineHeight: 38, letterSpacing: -0.85 },
  /** "Money sent!", "Bill paid!" — same size, looser tracking in source. @review */
  celebrationTitle: { fontFamily: fontFamily.displayBold, fontSize: 34, lineHeight: 38, letterSpacing: -0.68 },
  /** PIN / OTP screen heading. */
  flowTitle: { fontFamily: fontFamily.displayBold, fontSize: 28, lineHeight: 31, letterSpacing: -0.56 },
  /** Pushed-screen header, profile name, tier name. */
  screenHeader: { fontFamily: fontFamily.displayBold, fontSize: 20, lineHeight: 25, letterSpacing: -0.4 },
  /** ToggleRow title, notification title, KYC tier label, biller monogram. */
  cardTitle: { fontFamily: fontFamily.displayBold, fontSize: 15, lineHeight: 19, letterSpacing: 0 },
  /** Home greeting. */
  greeting: { fontFamily: fontFamily.displaySemiBold, fontSize: 15, lineHeight: 19, letterSpacing: -0.15 },
  /** EmptyState heading. */
  emptyTitle: { fontFamily: fontFamily.displaySemiBold, fontSize: 17, lineHeight: 21, letterSpacing: -0.17 },
  /** Vertical journey step label. */
  journeyLabel: { fontFamily: fontFamily.displaySemiBold, fontSize: 15, lineHeight: 19, letterSpacing: 0 },

  /* --- Body & UI: Space Grotesk -------------------------------------- */

  body: { fontFamily: fontFamily.sansRegular, fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  /** ListRow title, TransactionRow name, close-account fact heading. */
  bodyStrong: { fontFamily: fontFamily.sansSemiBold, fontSize: 15, lineHeight: 23, letterSpacing: 0 },
  /** SectionLabel, and any 13/600 muted line. */
  label: { fontFamily: fontFamily.sansSemiBold, fontSize: 13, lineHeight: 20, letterSpacing: 0 },
  /** ListRow subtitle, DetailRow-adjacent prose. */
  labelMuted: { fontFamily: fontFamily.sansRegular, fontSize: 13, lineHeight: 20, letterSpacing: 0 },
  /** InlineAlert detail, helper lines. */
  caption: { fontFamily: fontFamily.sansRegular, fontSize: 12, lineHeight: 17, letterSpacing: 0 },
  /** DetailRow value, Input label, Badge md. */
  captionStrong: { fontFamily: fontFamily.sansSemiBold, fontSize: 12, lineHeight: 17, letterSpacing: 0 },
  /** Legal line, timestamps. */
  micro: { fontFamily: fontFamily.sansRegular, fontSize: 11, lineHeight: 17, letterSpacing: 0 },
  /** Tab label, Badge sm, horizontal journey label. */
  microStrong: { fontFamily: fontFamily.sansSemiBold, fontSize: 11, lineHeight: 14, letterSpacing: 0 },
  /** Text input value. */
  input: { fontFamily: fontFamily.sansRegular, fontSize: 17, lineHeight: 22, letterSpacing: 0 },

  button: {
    sm: { fontFamily: fontFamily.sansSemiBold, fontSize: 13, lineHeight: 13, letterSpacing: -0.07 },
    md: { fontFamily: fontFamily.sansSemiBold, fontSize: 15, lineHeight: 15, letterSpacing: -0.08 },
    lg: { fontFamily: fontFamily.sansSemiBold, fontSize: 17, lineHeight: 17, letterSpacing: -0.09 },
  },

  /* --- Money: Space Grotesk, tabular figures -------------------------
     Every one of these must also carry `fontVariant: tabularNums`. The
     MoneyText component applies it once so call sites never repeat it. */

  /** The default inline amount — the app writes this 83 times. */
  money: { fontFamily: fontFamily.sansSemiBold, fontSize: 15, lineHeight: 20, letterSpacing: -0.3 },
  moneySm: { fontFamily: fontFamily.sansSemiBold, fontSize: 13, lineHeight: 18, letterSpacing: -0.26 },
  /** Home total balance. @review 46 is not on the type scale (44 / 52 are) */
  balanceHero: { fontFamily: fontFamily.sansMedium, fontSize: 46, lineHeight: 52, letterSpacing: -0.92 },
  /** Wallets total balance. */
  balance: { fontFamily: fontFamily.sansMedium, fontSize: 34, lineHeight: 40, letterSpacing: -0.68 },
  /** AmountHero — the number IS the screen. Tracking is -0.03em here. */
  amountHero: { fontFamily: fontFamily.sansSemiBold, fontSize: 52, lineHeight: 55, letterSpacing: -1.56 },
  /** @review 38 is not on the type scale */
  amountHeroMd: { fontFamily: fontFamily.sansSemiBold, fontSize: 38, lineHeight: 40, letterSpacing: -1.14 },
  /** @review 30 is not on the type scale */
  amountHeroSm: { fontFamily: fontFamily.sansSemiBold, fontSize: 30, lineHeight: 32, letterSpacing: -0.9 },
  /** Transaction detail amount. @review 38 */
  amountDetail: { fontFamily: fontFamily.sansSemiBold, fontSize: 38, lineHeight: 42, letterSpacing: -0.76 },
  /** In-flight amount on the sending screen, and the rate hero's siblings. */
  amountFlow: { fontFamily: fontFamily.sansSemiBold, fontSize: 34, lineHeight: 38, letterSpacing: -0.68 },
  /** Rate target stepper. @review 30 */
  amountStepper: { fontFamily: fontFamily.sansSemiBold, fontSize: 30, lineHeight: 34, letterSpacing: -0.6 },
  /** AmountField steps its figure down rather than ellipsising — a truncated
   *  amount is worse than a small one. Keyed by resolved character length. */
  amountField: {
    xl: { fontFamily: fontFamily.sansSemiBold, fontSize: 38, lineHeight: 42, letterSpacing: -0.76 },
    lg: { fontFamily: fontFamily.sansSemiBold, fontSize: 32, lineHeight: 36, letterSpacing: -0.64 },
    md: { fontFamily: fontFamily.sansSemiBold, fontSize: 28, lineHeight: 32, letterSpacing: -0.56 },
    sm: { fontFamily: fontFamily.sansSemiBold, fontSize: 24, lineHeight: 28, letterSpacing: -0.48 },
  },
  /** Currency symbol beside an AmountField figure. */
  amountFieldSymbol: { fontFamily: fontFamily.sansMedium, fontSize: 26, lineHeight: 30, letterSpacing: -0.52 },
  otpDigit: { fontFamily: fontFamily.sansSemiBold, fontSize: 22, lineHeight: 26, letterSpacing: -0.44 },
  keypadKey: { fontFamily: fontFamily.sansSemiBold, fontSize: 22, lineHeight: 26, letterSpacing: 0 },
  keypadDot: { fontFamily: fontFamily.sansSemiBold, fontSize: 20, lineHeight: 24, letterSpacing: 0 },
  /** Phone number entry — the one positive-tracked figure. */
  phoneNumber: { fontFamily: fontFamily.sansSemiBold, fontSize: 17, lineHeight: 22, letterSpacing: 0.68 },
  /** Prepaid meter token on the bill success screen. */
  tokenCode: { fontFamily: fontFamily.sansSemiBold, fontSize: 22, lineHeight: 28, letterSpacing: 1.32 },
  /** Wallet deposit address — the only money-face text that wraps. */
  addressCode: { fontFamily: fontFamily.sansRegular, fontSize: 13, lineHeight: 19, letterSpacing: 0 },
} as const;

/**
 * The currency symbol beside a MoneyText figure renders at a fraction of the
 * figure's size. `em` has no RN equivalent, so the ratio is applied in code.
 */
export const moneySymbolRatio = {
  /** MoneyText default. */
  default: 0.66,
  /** Home balance hero. */
  balanceHero: 0.62,
  /** Wallets balance. */
  balance: 0.7,
  /** AmountHero. */
  hero: 0.62,
} as const;

/* ==========================================================================
   8. Shadows — elevation is deliberately OFF in this design.
   ========================================================================== */

/**
 * CSS box-shadow, iOS shadow props and Android elevation do not correspond,
 * so each step carries per-platform values tuned to look the same, not to
 * match numerically. Never write shadowOffset / elevation at a call site.
 *
 * The nippyy app ships `none` almost everywhere: separation comes from tone
 * and 1px hairlines. `sm` exists because exactly one element uses it (the
 * Toggle knob). `md` and `lg` are defined so the scale is complete and so a
 * component copied from another kit lands on a real token — but nothing in
 * this design should reach for them. See PORTING_PLAN.md.
 */
export type ShadowToken = {
  ios: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  android: { elevation: number };
  web: { boxShadow: string };
};

const shadowColor = ink[900];

export const shadows: Record<'none' | 'sm' | 'md' | 'lg', ShadowToken> = {
  none: {
    ios: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0 },
    android: { elevation: 0 },
    web: { boxShadow: 'none' },
  },
  /** The Toggle knob, and nothing else in this design. */
  sm: {
    ios: { shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 2 },
    android: { elevation: 1 },
    web: { boxShadow: '0 1px 2px rgba(11, 13, 71, 0.18)' },
  },
  md: {
    ios: { shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10 },
    android: { elevation: 4 },
    web: { boxShadow: '0 4px 12px rgba(11, 13, 71, 0.12)' },
  },
  lg: {
    ios: { shadowColor, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24 },
    android: { elevation: 12 },
    web: { boxShadow: '0 12px 28px rgba(11, 13, 71, 0.16)' },
  },
};

/**
 * The focus halo is a spread-only ring, which RN cannot express as a shadow.
 * It is rendered as a real ring (an absolutely positioned View) on native and
 * as a boxShadow on web. Focus itself is a web-only concern per the brief.
 */
export const focusRing = {
  width: 4,
  color: 'rgba(10, 165, 219, 0.16)',
  web: '0 0 0 4px rgba(10, 165, 219, 0.16)',
} as const;

/* ==========================================================================
   9. Motion — quick and gentle.
   ========================================================================== */

export const duration = {
  /** Press and tint. */
  fast: 120,
  /** Colour and border. */
  base: 200,
  /** Screen transitions, progress fills. */
  slow: 320,
  /** The live-step pulse cycle. */
  pulse: 1800,
} as const;

/** Bezier control points, for Reanimated's `Easing.bezier(...)`. */
export const easing = {
  out: [0.22, 0.61, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const motion = {
  /** Buttons shrink to this on press. */
  pressScale: 0.97,
  /** IconButton presses harder. */
  pressScaleIcon: 0.92,
  /** Cards do not lift in this app. */
  hoverLift: 0,
  /** Solid buttons darken on hover — web only, no native equivalent. */
  hoverBrightness: 0.94,
  /** The cyan ring that pulses off an in-flight step. */
  pulseRing: { from: 0, to: 9, colorFrom: 'rgba(10, 165, 219, 0.45)', colorTo: 'rgba(10, 165, 219, 0)' },
  /** SuccessBurst pop. */
  pop: { from: 0.4, overshoot: 1.08, to: 1 },
} as const;

/* ==========================================================================
   10. Borders
   ========================================================================== */

export const borderWidth = {
  /** Hairline dividers. Carries all the structure, since shadows are off. */
  hairline: 1,
  /** Inputs, chips, outline buttons. */
  strong: 1.5,
  /** Journey node outline. */
  node: 3,
} as const;

/* ==========================================================================
   11. Theme assembly
   ========================================================================== */

export type Theme = {
  colors: ColorTokens;
  spacing: typeof spacing;
  spacingRaw: typeof spacingRaw;
  gutter: typeof gutter;
  radii: typeof radii;
  radius: typeof radius;
  size: typeof size;
  layout: typeof layout;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  shadows: typeof shadows;
  focusRing: typeof focusRing;
  duration: typeof duration;
  easing: typeof easing;
  motion: typeof motion;
  borderWidth: typeof borderWidth;
};

const shared = {
  spacing,
  spacingRaw,
  gutter,
  radii,
  radius,
  size,
  layout,
  typography,
  fontFamily,
  shadows,
  focusRing,
  duration,
  easing,
  motion,
  borderWidth,
} as const;

export const lightTheme: Theme = { colors: lightColors, ...shared };
export const darkTheme: Theme = { colors: darkColors, ...shared };

export const themes = { light: lightTheme, dark: darkTheme } as const;
export type ThemeName = keyof typeof themes;
