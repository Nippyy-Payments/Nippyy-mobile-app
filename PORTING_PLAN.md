# nippyy — Expo port plan

Porting the nippyy diaspora payments app from the static design source to an
Expo app running on iOS, Android and web.

**Status: plan reviewed, all 20 design decisions resolved (§8). Implementation
in progress, phase by phase (§11).** Deferred work is tracked in
[NOT_DONE_YET.md](NOT_DONE_YET.md).

---

## 1. What the design source actually is

The source folder holds several overlapping artefacts. They do not all agree,
so this section fixes which one I ported from.

| Artefact | What it is | Used? |
| --- | --- | --- |
| `nippyy-app-ds/` | Design system extracted from the shipping build: 6 token files, 29 components with `.d.ts` + `.prompt.md`, 21 guideline cards, and a 29-screen click-through UI kit | **Yes — primary source** |
| `Nippyy App.dc.html` | The shipping build (~25 screens) | Cross-checked only |
| `Nippyy Overview.dc.html` | Every screen on one page | Cross-checked only |
| `Nippyy App v1.dc.html`, `screenshots/` | Earlier iterations | **No** |
| `Nippyy Handoff.dc.html` | Product review deck | **No** — contradicts the app (see §8.1) |
| `_ds/`, `ds-patch/`, `ds-patch-remaining/` | A separate, stale, compiled design system + an unfinished patch | **No** |

I verified the UI kit is faithful to the shipping build rather than assuming
it: token values, the `Total balance` block (13px/600/muted) and the screen
title set all match. The `screenshots/` folder shows a **card-based** home
screen — that is an old iteration and directly violates the current system's
"lists, not cards" rule. I ignored it.

### Two things the source states that shape everything

- **Elevation is off.** Every shadow token in the source is `none`. Separation
  comes from tone (`surface.quiet` / `surface.sunken`) and 1px hairlines.
- **No gradients, no photography, no illustration.** The brand and ink
  gradient tokens are deliberately flattened to solid fills. **`expo-linear-gradient`
  is therefore not needed and is not in the dependency list.**

---

## 2. Screen inventory — 29 screens

Route names follow the source's own screen keys so the two stay greppable.

### Onboarding — full-screen, no tab bar

| # | Screen | Content | States found in source |
| --- | --- | --- | --- |
| 1 | `welcome` | Logo, 34px hero, 3 benefit rows, 2 stacked buttons, legal line | — |
| 2 | `phone` | Country chip (+234), number field, keypad | Focused field (cyan border + halo) |
| 3 | `otp` | 6-box OTP, resend timer, keypad | **Disabled** button until 6 digits; button label changes |
| 4 | `pin` | Lock tile, 4 dots, keypad | Two-step: create → confirm |
| 5 | `pingate` | Same component, `gate` variant + "Use Face ID instead" | Reachable only by deep link (see §8.14) |
| 6 | `kyc` | Tier progress block, 4-step list, info alert, primary CTA | Step: met / next / todo |

### Home & send

| # | Screen | Content | States |
| --- | --- | --- | --- |
| 7 | `home` | Sticky greeting bar, balance + eye toggle, wallet dropdown, primary action + 3 quick actions, people, recent | **Masked balance**; dropdown open/closed; people collapsed/expanded |
| 8 | `recipients` | Search input, count label, rows | **Empty** (no search match) |
| 9 | `send` | Recipient row, AmountHero, preset chips, rate/fee/arrives, keypad | **Over-balance** (red hero + danger alert + disabled button); **disabled** at zero |
| 10 | `review` | AmountHero, journey strip, destination rows, fee card, ink CTA | — |
| 11 | `sending` | Vertical journey strip, timed progression | 4 in-flight steps (done / active / todo) |
| 12 | `success` | SuccessBurst, receipt card, Done + share | Reference **copied** state |

### Activity

| # | Screen | Content | States |
| --- | --- | --- | --- |
| 13 | `activity` | Sticky title + filter chips, grouped rows | **Empty** (filter matches nothing); per-row success / pending / failed |
| 14 | `txn` | Avatar, amount, badge, journey, breakdown card, details card, 2 actions | Copied |

### Money

| # | Screen | Content | States |
| --- | --- | --- | --- |
| 15 | `wallets` | Balance + eye toggle, 2 actions, 5 wallet rows, USDC alert | **Masked** (hides the ≈ NGN line too) |
| 16 | `convert` | From/To AmountFields, overlapping swap button, live-rate line, chips | **Done** (success alert replaces the CTA) |
| 17 | `fund` | 3-way method chips → bank / card / crypto | 3 method branches; copied; 3 different alert tones |
| 18 | `rates` | Corridor chip, 52px rate, 7-bar chart, 2 toggle rows, stepper | Toggle on/off; target above/below |
| 19 | `bills` | 6-category grid, "Pay again" rows | — |
| 20 | `billpay` | 3-step flow: form → sending → success | Prepaid **token card** only for electricity |

### Account

| # | Screen | Content | States |
| --- | --- | --- | --- |
| 21 | `menu` | Title, profile row, verification block, 5 menu groups, dark-mode toggle, log out | Danger rows; external vs chevron affordance |
| 22 | `profile` | Avatar, tag (copy), Personal card, Address card, locked alert | Copied |
| 23 | `tiers` | 3 tier cards | **current** (brand border) / **next** (progress + CTA) / **locked** (muted + lock line) |
| 24 | `security` | Face ID toggle, 4 rows | Sub-view: **devices** (3 rows, current device) |
| 25 | `notifs` | 2 grouped notification cards | Unread dot; 3 tones |
| 26 | `notifsEmpty` | — | **Empty** |
| 27 | `close` | 2-step: facts list → type-CLOSE confirm | **Disabled** until "CLOSE" typed; reason chips |

### Support

| # | Screen | Content | States |
| --- | --- | --- | --- |
| 28 | `support` | Contact rows, social rows | External affordance throughout |
| 29 | `chatsupport` | EmptyState "Coming soon" with fallback rows | Empty-as-content |

### States the design does **not** define

No screen in the source has a **loading** or **network-error** state. The
`Button` has a `loading` prop with a spinner, but no screen uses it. This is
listed under §8 as a decision, not invented here.

---

## 3. Component inventory — design → React Native

29 source components. `View`/`Text`/`Pressable` are RN primitives; nothing
below substitutes an OS-native control, per the fidelity policy.

### Core

| Source | RN counterpart | Porting notes |
| --- | --- | --- |
| `Button` | `Pressable` + `Animated.View` | 7 variants x 3 sizes. Press scale 0.97 via Reanimated. `filter: brightness(.94)` hover is **web-only**. `quiet` variant is a soft fill with **red** text — see §8.9 |
| `IconButton` | `Pressable` | 6 variants, 3 sizes, `shape="circle"` → `borderRadius: size/2` |
| `Card` | `View` | 5 tones. Never wraps a list |
| `ScreenHeader` | `View` + `Pressable` | Back button calls `router.back()`. Title `numberOfLines={1}` |
| `ScreenTitle` | `View` + `Text` | 34px Montserrat + optional subhead |
| `SectionLabel` | `View` + `Text` | Optional trailing action slot |
| `PhoneFrame` | **Dropped on native** | It is a 390x844 device mock with a fake status bar, notch and bezel. On device the app *is* the phone. Web keeps a centred max-width column only (§6) |

### Forms

| Source | RN counterpart | Porting notes |
| --- | --- | --- |
| `Input` | `TextInput` | 1.5px border → cyan + halo on focus. Halo is a ring View, not a shadow |
| `AmountHero` | `View` + `Text` | 3 states: default / over / muted |
| `AmountField` | `View` + `TextInput` | Figure steps 38→32→28→24 by length — tokenised as `typography.amountField.*` |
| `Keypad` | `View` grid | CSS grid → 4 rows x 3 `flex: 1` cells. Press tint, not scale |
| `OtpField` | `View` + `Text` | Boxes (6-digit) or dots (4-digit PIN). Display-only |
| `Toggle` | `Pressable` + `Animated.View` | **Built, not `Switch`** — per the fidelity policy. Knob slides 3→21 |
| `ToggleRow` | `View` | Optional icon tile |
| `ChipGroup` | `Pressable` row, `flexWrap` | 2 tones (`ink` / `brand`), 3 sizes; `brand` is deselectable |

### Feedback

| Source | RN counterpart | Porting notes |
| --- | --- | --- |
| `Badge` | `View` + `Text` | 6 statuses x 3 appearances x 3 sizes, optional dot |
| `StatusDot` | `View` | Uses the light `400` steps deliberately |
| `ProgressTrack` | `View` | 2 variants. Continuous fill animates width (Reanimated). **Source has a dead ternary — see §7.4** |
| `InlineAlert` | `View` | 4 tones, optional actions row |
| `JourneyStrip` | `View` + `react-native-svg` | Horizontal + vertical. The vertical node ring is a **layout ring**, not a shadow (§5.3) |
| `EmptyState` | `View` | Circle + icon + heading + line + optional children |
| `SuccessBurst` | `View` + Reanimated | 2 rings + core + check, spring pop |

### Data

| Source | RN counterpart | Porting notes |
| --- | --- | --- |
| `MoneyText` | Wrapped `Text` | The most repeated styling in the product (83 inline spans). Applies `fontVariant: ['tabular-nums']` once. `tone` carries money semantics; `masked` renders bullets |
| `Avatar` | `View` / `expo-image` | Deterministic tint from a name hash. Flag badge ring uses `surface.raised` so it disappears in dark |
| `RowTile` | `View` | 6 tones |
| `ListRow` | `Pressable` | Full-bleed: `marginHorizontal: -gutter` + `paddingHorizontal: gutter`. 3 affordances: chevron / external / none. `href` rows open via `expo-linking` |
| `TransactionRow` | `Pressable` | Amount + status badge stack |
| `DetailRow` | `View` | Label / value, optional copy button (`expo-clipboard`) |

### Navigation

| Source | RN counterpart | Porting notes |
| --- | --- | --- |
| `TabBar` | Custom `tabBar` for `expo-router` Tabs | 4 tabs + a raised centre send button. `backdrop-filter` → `expo-blur` (§5.1). Hidden on full-screen flows — handled by route grouping, not a visibility flag |

### New components this port adds

| Component | Why |
| --- | --- |
| `Text` (`src/components/Text.tsx`) | Wraps RN `Text` with `allowFontScaling={false}` in one place, and takes a `variant` from `typography`. No call site repeats either |
| `Icon` (`src/components/Icon.tsx`) | The source ships ~40 inline SVG paths (Lucide, 2px rounded). Ported to `react-native-svg` with the path data in one registry |
| `Screen` (`src/components/Screen.tsx`) | Safe-area + gutter + scroll container. The seam where a breakpoint lands later (§6) |
| `AppShell` (`src/app/_layout.tsx`) | The single place the web max-width column is applied |
| `Flag` | Emoji flags need a decision — §8.10 |

---

## 4. Token table

Full detail in [`src/theme/tokens.ts`](src/theme/tokens.ts). Summary:

| Group | Source | Exported as | Notes |
| --- | --- | --- | --- |
| Colour scales | `tokens/colors.css` | private consts | blue, ink, gray, green, amber, red — light + dark |
| Colour aliases | same | `lightColors` / `darkColors` | `brand`, `text`, `surface`, `border`, `status`, `indicator`, `money`, `avatar`, `chrome`. Every alias restated for dark, as the source requires |
| Spacing | `tokens/spacing.css` | `spacing` | 4px grid, `xs`(4) → `7xl`(80) |
| Off-grid spacing | measured from screens | `spacingRaw` | 7 named values the design uses off the grid |
| Gutters | `--app-gutter` | `gutter` | `default`(24), `tight`(20), `bills`(22) |
| Radii | `tokens/effects.css` | `radii` + `radius` | Role aliases so call sites say *what*, not *how much* |
| Sizing | `tokens/spacing.css` + components | `size` | Control heights, tiles, avatars, badges, chips, toggle, OTP, journey nodes |
| Type | `tokens/typography.css` | `typography` | **38 named roles**, each with resolved px lineHeight + px letterSpacing |
| Families | `tokens/fonts.css` | `fontFamily` | 7 static faces |
| Shadows | `tokens/effects.css` | `shadows` | `none` / `sm` / `md` / `lg`, per-platform |
| Focus ring | `--shadow-focus` | `focusRing` | Spread-only — not a shadow (§5.2) |
| Motion | `tokens/effects.css` | `duration`, `easing`, `motion` | Beziers as control-point arrays for Reanimated |
| Borders | `tokens/effects.css` | `borderWidth` | hairline 1 / strong 1.5 / node 3 |

### Why the type scale is roles, not sizes

The source expresses tracking in `em` and line-height unitless. React Native
supports neither. `-0.025em` is a different pixel value at 34px than at 15px,
so a bare size ramp would lose the design. Every role therefore carries
`{ fontFamily, fontSize, lineHeight, letterSpacing }` already resolved, and
every `Text` spreads exactly one role.

Roles name a **font family per weight** and never a numeric `fontWeight`:
with static font files, Android synthesises bold by smearing the glyphs.

### Token values to reconsider

These are ported faithfully but are worth a decision:

1. **`brand.soft` = `#EAF6FC`** — the source comments "app value, not
   `--blue-50`" (`#ECF8FE`). Two near-identical tints for the same job.
   Collapse to one?
2. **Balance sizes 46 and 38** — the type scale has 44 and 52. Home's balance
   is 46px, the transaction amount 38px. Neither is on the scale.
3. **AmountHero sizes 30 / 38 / 52** — only 52 is on the scale.
4. **A third gutter (22px)** for the Bills screen only, where the rest of the
   app uses 24 or 20.
5. **Off-grid spacing** — 7, 9, 11, 13, 14, 26, 30, 36 all appear on a stated
   4px grid. `13` (row leading gap) and `11` (greeting gap) are the frequent
   ones.
6. **`ScreenTitle` uses `-0.025em` but every ad-hoc 34px heading uses
   `-0.02em`** — the success titles are tracked differently from the screen
   titles at the same size. Likely unintended.
7. **Montserrat 800 is loaded but never used.** Not loaded in this port.
8. **`--gradient-ink` is re-pointed to `#232936` in dark** but nothing reads
   it (the ink panel uses `--surface-ink`). Dead token; dropped.
9. **`shadows.md` / `shadows.lg`** are defined here for scale completeness but
   **nothing in this design may use them**. Say the word and I will delete
   them so reaching for elevation is a type error.

---

## 5. CSS with no RN equivalent — every occurrence and its plan

| # | CSS | Where | Plan |
| --- | --- | --- | --- |
| 5.1 | `backdrop-filter: blur(14px)` | `TabBar` — the system's only blur | **`expo-blur`** `BlurView` with the `chrome.tabBar` colour behind it. Works on all three platforms |
| 5.2 | `box-shadow: 0 0 0 4px rgba(10,165,219,.16)` (focus halo) | `Input`, `PhoneScreen` field, `*:focus-visible` | Spread-only — RN has no such shadow. **Native:** an absolutely-positioned ring `View`. **Web:** real `boxShadow`. Focus-visible itself is **web-only** per the brief |
| 5.3 | `box-shadow: 0 0 0 4px var(--surface-page)` | `JourneyStrip` vertical node | Not a shadow — it punches the node through the connector line. **Wrap the node in a `View` with `surface.page` background + `padding: 4` + circular radius.** Deterministic, no shadow |
| 5.4 | `box-shadow: 0 1px 2px rgba(11,13,71,.18)` | `Toggle` knob | The one genuine shadow. → `shadows.sm`, per-platform |
| 5.5 | `--shadow-device` (`0 50px 90px -30px …`, stacked + negative spread) | `PhoneFrame` bezel | **Dropped.** The bezel is a mock, not app chrome |
| 5.6 | `filter: brightness(0.94)` | Solid button hover | **Web only.** Native press = scale 0.97 (Reanimated) |
| 5.7 | `transition: …` (~20 uses) | Buttons, chips, rows, borders | Reanimated `withTiming` on `duration.*` + `Easing.bezier(...easing.out)` |
| 5.8 | `@keyframes nip-pulse` — animates **box-shadow spread** | Journey active node, `StatusDot pulse` | Spread cannot animate in RN. **Sibling ring `View` animating `scale` 1→~1.9 and `opacity` 0.45→0**, looped |
| 5.9 | `@keyframes nip-pop` | `SuccessBurst` | Reanimated `withSequence` on the spring bezier (0.4 → 1.08 → 1) |
| 5.10 | `@keyframes nip-spin` | Button spinner | Reanimated looped rotation |
| 5.11 | `@keyframes nip-ring` | declared, unused | **Dropped** |
| 5.12 | `position: sticky` (16 uses) | Home greeting bar, Activity header, `ScreenHeader sticky` | No RN equivalent. **Header rendered outside the scroll view** as a sibling, so it is genuinely fixed. (`stickyHeaderIndices` is the alternative but forces the header into the list's data flow) |
| 5.13 | `display: grid` (3 uses) | `Keypad` 3x4, Home quick actions 1x3, Bills categories 2x3 | Flexbox rows of `flex: 1` cells with `gap`. **Not `flexWrap` + percentage widths** — that drifts on odd widths |
| 5.14 | `position: absolute` + `translate(-50%,-50%)` | Convert swap button | RN has no percentage translate. Absolute with `top: 50%` then `marginTop: -(size/2)` |
| 5.15 | `calc(100% + 48px)` + negative margin | `ListRow`, `TransactionRow` full-bleed | `marginHorizontal: -gutter` + `paddingHorizontal: gutter`. No `calc` needed |
| 5.16 | `border-radius: 50%` (~20 uses) | Avatars, dots, nodes, tiles | `borderRadius: size / 2`. Every circular element takes its size from `size.*` |
| 5.17 | `min-height: 100%` / `--app-height: 844px` | Every full-screen flow | `flex: 1` + `react-native-safe-area-context`. **No fixed heights** |
| 5.18 | `env(safe-area-inset-bottom)` | TabBar padding | `useSafeAreaInsets()` |
| 5.19 | `text-wrap: pretty` (8 uses) | Prose blocks | No RN equivalent. **Dropped** — RN wraps by default; the difference is orphan control only |
| 5.20 | `white-space: nowrap` + `text-overflow: ellipsis` | Row titles, subtitles, amounts | `numberOfLines={1}` + `ellipsizeMode="tail"` |
| 5.21 | `font-variant-numeric: tabular-nums` / `font-feature-settings: 'tnum'` | All money | `fontVariant: ['tabular-nums']`, applied once inside `MoneyText` |
| 5.22 | `cursor`, `user-select`, `-webkit-tap-highlight-color` | Every control | No-ops on native; web handled by the Pressable wrapper |
| 5.23 | `dangerouslySetInnerHTML` for tab icons | `TabBar` | `react-native-svg` `Path` from the icon registry |
| 5.24 | `<img src="…logo-navy.png">` | Welcome screen | `expo-image` + the two real logo PNGs |
| 5.25 | `opacity: .7` / `.6` on ink cards | Fund, BillPay token card | Fine in RN, but currently **hardcoded alphas on white** (`rgba(255,255,255,.75/.6/.12)` in `AmountField`). Tokenised as `text.onInk` variants |
| 5.26 | Media queries | **none in the design system** | Nothing to port. Mobile-only by construction |
| 5.27 | `::before` / `::after` | **none in the design system** | Verified — the only hits are in the deck-authoring tooling, not the design |
| 5.28 | Gradients | **none in the design system** | Verified. Tokens are deliberately flat fills. `expo-linear-gradient` not needed |
| 5.29 | `float` | **none** | — |
| 5.30 | `vh` / `vw` | **none** | The design uses a fixed 390x844 frame instead — replaced by flex |

---

## 6. Width, responsiveness, and where the rework will be

This phase is **mobile-only**: no breakpoints, no `useWindowDimensions`
branching, no tablet layouts.

- **No fixed pixel widths on containers.** `layout.designWidth` (390) exists
  as documentation only and is never used as a width.
- **Web column:** `layout.maxWidth` (430) is applied in exactly one place —
  the root layout — centred on `chrome.desk`. One seam, one change later.
- **Layout stays inside components,** so a breakpoint lands at one seam per
  component rather than being sprinkled through screens.

### Screens that will need the most rework when larger screens arrive

1. **`home`** — the sticky greeting bar, the balance hero and the 3-up quick
   action row all assume a single narrow column. On a wide screen the balance
   and the action row want to sit side by side.
2. **`convert`** — two stacked `AmountField`s with an **absolutely positioned
   swap button centred on the seam between them**. A side-by-side layout moves
   that button from vertical-centre to horizontal-centre; the positioning has
   to be re-derived, not adjusted.
3. **`bills`** — a hard 3-column category grid. Needs a column count that
   responds rather than a fixed 3.
4. **`tiers`** — three tall cards stacked vertically; the obvious wide layout
   is three columns, which changes the internal card rhythm (progress bar,
   requirement rows, CTA).
5. **`send` / `billpay` / `phone` / `otp` / `pin`** — all keypad flows pinned
   to the bottom of a full-height column. On a tall/wide screen the keypad
   should not stretch, so these need a max-width inner column of their own.
6. **`sending`** — the vertical journey strip is centred in the remaining
   space; that centring assumes a phone-height viewport.

Everything else is a single scrolling column of full-bleed rows and will
mostly survive a width change untouched.

---

## 7. Navigation

Every transition goes through `expo-router`. No local-state screen switching,
no custom animated containers.

```
src/app/
  _layout.tsx              Root Stack. Fonts, providers, web max-width column
  (onboarding)/            Full-screen flow, no tab bar
  (tabs)/_layout.tsx       Tabs with the custom nippyy TabBar
    index.tsx              home
    wallets.tsx
    activity.tsx
    menu.tsx
  send/                    Full-screen flow (pushed above the tabs)
  ...
```

- **iOS swipe-back** works on every pushed screen. `gestureEnabled` is never
  set to `false`.
- **Android back** maps to the same stack; a nested screen never exits the app.
- **Modals** use router modal presentation, so back and swipe dismiss them.
- **Web** gets real URLs; browser back/forward and deep links hit the same
  routes.
- The designed back button stays exactly as drawn — it just calls
  `router.back()`.

Three things in the source are **local state that must become routes**:

1. `security` → its `devices` sub-view (currently `useState('menu'|'devices')`)
2. `billpay` → `form` → `sending` → `success`
3. `close` → `intro` → `confirm`

Tab visibility is handled by **route grouping** — full-screen flows live
outside `(tabs)` — not by the source's `FULLSCREEN` array.

### 7.4 A bug in the source worth knowing about

`ProgressTrack` (segmented) contains a dead ternary:

```js
background: i < value ? (complete ? 'var(--green-500)' : 'var(--green-500)') : …
```

Both branches are identical, so a completed segmented track never changes
colour — contradicting the component's own doc ("amber while outstanding,
green once complete"). I will implement the **documented** behaviour and flag
it here rather than copying the bug. Tell me if you want the bug preserved.

---

## 8. Design decisions — RESOLVED

All 20 questions answered. Recorded here as the ruling plus what it changes.

| # | Question | Ruling | Consequence for the build |
| --- | --- | --- | --- |
| 8.1 | Tier limits conflict | **The app is the source of truth, not the Handoff deck** | Per-transaction / daily / balance limits **in naira**, from `guidelines/data-tier-limits.html`. The Handoff deck's sterling monthly caps are ignored. Figures are quoted from one constant, never retyped |
| 8.2 | Loading states | **Skeletons where they fit, spinners where they don't** | Skeletons for known-shape content (row lists, balance block, cards). Spinners for indeterminate/in-place work (button `loading`, pull-to-refresh, sheet content) |
| 8.3 | Error / retry states | **Implement, aligned to the app's design** | Built from the existing language: `EmptyState` shape + `InlineAlert danger` tone + a retry `Button`. No new visual vocabulary invented |
| 8.4 | Missing empty states | **Create, aligned to the app's design** | `EmptyState` for: no wallets, no devices, no "Pay again" history, first-run activity, no recipients |
| 8.5 | Pull-to-refresh | **Add, mostly to list-fetching screens** | `activity`, `recipients`, `notifications`, `wallets`, bills "Pay again" |
| 8.6 | Recipient passed to send | **Yes, recipient id is passed** | `send` takes a recipient id param; the row no longer hardcodes `RECIPS[0]` |
| 8.7 | Source wallet | **Primary wallet is the default; a bottom sheet selects another** | See §8.7 below — this one carries real API shape |
| 8.8 | Dark mode | **User decides via the toggle. Not system.** | Two-state, user-owned, persisted. The design's off-label "Following the system" is now wrong and becomes **"Off"** |
| 8.9 | `quiet` button renders red | **Yes, intended** | "Log out", "Sign out all other devices" and "Continue to close account" keep red text on the quiet fill |
| 8.10 | Emoji flags | **Ship emoji for now** | No SVG flag set. Known limitation: renders as letter pairs ("NG") on systems without an emoji font. Revisit if it bites on Android/web |
| 8.11 | `notifsEmpty` | **A state, not a route** | One `notifications` route that renders its own empty state |
| 8.12 | Balance masking | **Survives a restart** | Persisted, not session-only. Contradicts the source's "session-wide" note — the ruling wins |
| 8.13 | Face ID | **Real biometric prompt, but only if enabled in settings** | `expo-local-authentication`. Gated on the Security-centre toggle **and** hardware/enrolment availability. Falls back to the PIN gate |
| 8.14 | When `pin-gate` appears | **Before any money or destructive action** | Transfers, bill payments, and account closure. It is a real gate, not a deep-link-only screen |
| 8.15 | Controls with no destination | **Deferred** | Listed in [NOT_DONE_YET.md §1](NOT_DONE_YET.md) |
| 8.16 | Auth failure paths | **Deferred** | Listed in [NOT_DONE_YET.md §2](NOT_DONE_YET.md) |
| 8.17 | Rate chart data | **Real history** | 7-day series comes from the API, not the 7 hardcoded bars. Chart scales to real min/max |
| 8.18 | Transaction detail | **Pass an id** | `transaction/[id]` |
| 8.19 | Status bar | **Yes — use the real OS status bar** | `expo-status-bar`, style driven by theme. The mock status bar, notch and bezel are dropped |
| 8.20 | Web background | **Keep `--desk` (`#E9EDF2`)** | Already tokenised as `chrome.desk`; dark theme uses `#0A0C11` |

### 8.7 Wallet model — the one piece of real API shape we have

```jsonc
{
  "primary": true,
  "id": "6974f3795209b494fb8b691f",
  "currency": "NGN",
  "balance": "8311.51",
  "availableBalance": "8311.51",
  "virtualAccounts": [
    { "accountNumber": "…", "bankName": "…", "bankCode": "…", "accountName": "…" }
  ]
}
```

Three things follow from this, and they change the build:

1. **The server sends no presentation data.** No flag, no display name, no
   symbol, no "can do" line — all of which the design shows on every wallet
   row. So a **currency metadata registry** lives client-side in
   `src/lib/currency.ts`, keyed by ISO code, supplying flag emoji, display
   name ("Nigerian naira"), symbol and capability copy. The server owns the
   money; the client owns how it reads.
2. **Amounts arrive as strings** (`"8311.51"`), which is correct for money and
   must stay that way — parsing to a float to display it is how you get
   `8311.509999`. Formatting goes through one helper; no arithmetic on
   display values.
3. **`balance` vs `availableBalance` are distinct.** The design shows a single
   balance. The send flow's over-balance check must use
   **`availableBalance`**, while the wallet row shows `balance`. Flagging
   this: if they diverge, the user can see a balance they cannot spend. Worth
   a copy decision later, but the safe behaviour is built now.

**Wallet selection** uses `@gorhom/bottom-sheet`: the `primary` wallet is the
default source; tapping the source opens a sheet listing the rest. The sheet
is a router modal so back and swipe dismiss it.

### New dependencies these rulings pull in

| Package | Pulled in by |
| --- | --- |
| `expo-local-authentication` | 8.13 |
| `@react-native-async-storage/async-storage` | 8.12, 8.8 (persisted masking + theme) |

### Two consequences worth calling out

- **8.8 changes designed copy.** The dark-mode row's detail line reads
  "Following the system" when off. With system-following removed that text is
  now false, so it becomes "Off". This is the one place I am changing the
  design's words, and only because the ruling made them wrong.
- **8.12 contradicts the source.** `guidelines/pattern-balance-masking.html`
  documents masking as session-wide. The ruling makes it persistent. Building
  to the ruling.

---

## 9. File tree

```
Nippyy-mobile-app/
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js          # consumes tokens.ts
├── global.css                  # NativeWind entry; token vars for light/dark
├── tsconfig.json               # strict
├── jest.config.js              # jest-expo preset
├── PORTING_PLAN.md
├── assets/
│   ├── icon.png                # from nippyy-icon.png
│   └── logo-navy.png / logo-white.png
└── src/
    ├── app/                              # expo-router routes ONLY
    │   ├── _layout.tsx                   # fonts, providers, web column
    │   ├── +not-found.tsx
    │   ├── (onboarding)/
    │   │   ├── _layout.tsx
    │   │   ├── welcome.tsx  phone.tsx  otp.tsx  pin.tsx
    │   │   ├── pin-gate.tsx
    │   │   └── verify.tsx                # kyc
    │   ├── (tabs)/
    │   │   ├── _layout.tsx               # custom TabBar
    │   │   ├── index.tsx                 # home
    │   │   ├── wallets.tsx
    │   │   ├── activity.tsx
    │   │   └── menu.tsx
    │   ├── send/
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx                 # amount
    │   │   ├── review.tsx  sending.tsx  success.tsx
    │   ├── recipients.tsx
    │   ├── transaction/[id].tsx
    │   ├── money/
    │   │   ├── convert.tsx  fund.tsx  rates.tsx  bills.tsx
    │   │   └── bill/[category]/
    │   │       ├── index.tsx  paying.tsx  done.tsx
    │   ├── account/
    │   │   ├── profile.tsx  tiers.tsx
    │   │   ├── security/index.tsx
    │   │   ├── security/devices.tsx
    │   │   ├── notifications.tsx
    │   │   └── close/index.tsx
    │   │   └── close/confirm.tsx
    │   └── support/
    │       ├── index.tsx  chat.tsx
    │
    ├── components/                       # presentational, no data fetching
    │   ├── Text.tsx                      # allowFontScaling={false} lives here
    │   ├── Icon.tsx  icons.ts
    │   ├── Screen.tsx
    │   ├── core/        Button IconButton Card ScreenHeader ScreenTitle SectionLabel
    │   ├── forms/       Input AmountHero AmountField Keypad OtpField Toggle ToggleRow ChipGroup
    │   ├── feedback/    Badge StatusDot ProgressTrack InlineAlert JourneyStrip EmptyState SuccessBurst
    │   ├── data/        MoneyText Avatar RowTile ListRow TransactionRow DetailRow
    │   └── navigation/  TabBar
    │
    ├── features/                         # feature-scoped screens, hooks, api
    │   ├── onboarding/   send/   activity/
    │   ├── wallets/      bills/  account/  support/
    │   └── (each: components/ hooks/ api.ts index.ts ← the only barrel)
    │
    ├── theme/
    │   ├── tokens.ts                     # ✅ written
    │   ├── typography.ts                 # role → RN TextStyle
    │   ├── ThemeProvider.tsx             # light/dark, useTheme()
    │   └── shadows.ts                    # per-platform resolver
    │
    ├── lib/
    │   ├── api/  query.ts  format.ts  clipboard.ts  linking.ts
    │
    └── store/                            # zustand
        ├── session.ts                    # balance masking, theme
        └── send.ts
```

One component per file. Barrel exports only at feature boundaries.

---

## 10. Stack

Exactly as specified — no substitutions. Versions verified against npm:

| Package | Version |
| --- | --- |
| `expo` | 57.0.14 (SDK 57, New Architecture) |
| `react-native` | 0.86.2 |
| `react` | 19.2 |
| `expo-router` | 57.0.14 |
| `nativewind` | 4.2.6 |
| `react-native-reanimated` | 4.5.3 |
| `react-native-gesture-handler` | latest for SDK 57 |
| `@shopify/flash-list` | 2.3.2 |
| `zustand` / `@tanstack/react-query` | latest |
| `react-hook-form` + `zod` | latest |
| `expo-image`, `expo-font` | SDK 57 |
| `@gorhom/bottom-sheet` | 5.2.14 |

Also required by the port: `react-native-svg` (~40 icons), `expo-blur` (§5.1),
`expo-clipboard` (copy rows), `react-native-safe-area-context`,
`expo-status-bar`, `expo-linking` (external rows).

**Not needed:** `expo-linear-gradient` — the design ships no gradients (§1).

### FlashList threshold (">20 items")

Only two lists can exceed 20: **activity** and **notifications**. Both get
`FlashList`. Everything else in this app is a short, fixed stack (5 wallets,
4 recipients, 6 bill categories, 3 devices) and stays a plain `View` stack —
virtualising them would cost more than it saves.

### Fonts

Montserrat and Space Grotesk, loaded via `expo-font` from
`@expo-google-fonts/montserrat` (0.4.2) and `@expo-google-fonts/space-grotesk`
(0.4.1) — real static TTFs, not the CSS `@import` the source uses, so they
work identically on iOS, Android **and** web.

Weights required by the design and confirmed available:

- Montserrat **500, 600, 700**
- Space Grotesk **400, 500, 600, 700**

**No weight is missing and nothing is substituted.** Two notes:

- The source CSS also requests **Montserrat 800**; I audited every weight
  usage and nothing in the design uses it, so it is not loaded.
- **No italic appears anywhere** in the design — verified. Neither family
  ships one here, and none will be synthesised.

Nothing renders in the system font: the splash is held until fonts resolve.

### Text scaling

`allowFontScaling={false}` is set **once**, inside `src/components/Text.tsx`.
No call site repeats it, so the decision reverses in one edit.

---

## 11. Phase order

Each phase ends with: `npx expo start` clean on iOS, Android and web; `tsc`
passing; tests passing; every colour/spacing/shadow tracing to a token. I stop
and summarise after each.

| Phase | Scope | Done when |
| --- | --- | --- |
| **0** | Scaffold: Expo 57 + TS strict + New Arch, NativeWind wired to `tokens.ts`, fonts loading, theme provider, web column, Jest | ✅ **Done** — see §13 |
| **1** | Primitives: `Text`, `Icon` (~40 paths), `Screen`, `MoneyText`, `Button`, `IconButton`, `Card`, `Badge`, `StatusDot`, `RowTile`, `Avatar` + tests | ✅ **Done** — see §14 |
| **2** | Layout & data components: `ScreenHeader`, `ScreenTitle`, `SectionLabel`, `ListRow`, `TransactionRow`, `DetailRow`, `EmptyState`, `InlineAlert` | ✅ **Done** — see §15 |
| **3** | Navigation shell: expo-router tree, custom `TabBar` with blur, 4 tab screens as stubs, back/swipe/deep-link verified on all three | All navigation rules in §7 demonstrably hold |
| **4** | Forms & motion: `Input`, `Keypad`, `OtpField`, `Toggle`, `ToggleRow`, `ChipGroup`, `AmountHero`, `AmountField`, `ProgressTrack`, `JourneyStrip`, `SuccessBurst` + Reanimated (§5.7–5.10) | Motion matches the documented timings |
| **5** | Home, wallets, activity, transaction detail — incl. masking, FlashList | 4 screens pixel-matched |
| **6** | Send flow + onboarding (10 screens, keypad-driven) | Full send journey works end to end |
| **7** | Money: convert, fund, rates, bills, bill pay (6 screens) | Incl. the swap button (§5.14) and the 3 fund branches |
| **8** | Account + support (9 screens) | All 29 screens complete |
| **9** | Polish: dark-mode sweep, a11y labels, empty/loading/error states from §8, test gaps | Definition of done met across the board |

Phases 5–8 depend on answers to §8. If the answers are slow I will build the
happy path and leave the undefined states as clearly-marked stubs rather than
inventing them.

---

## 12. Status

All 20 design questions are resolved (§8). Deferred work is tracked in
[NOT_DONE_YET.md](NOT_DONE_YET.md).

Outstanding, non-blocking: the 9 items in §4 "Token values to reconsider".
I am proceeding with the tokens as extracted — they are faithful to the
source. Say the word on any of them and it is a single-file change.

---

## 13. Phase 0 result

Scaffold complete and verified on all three platforms.

### Verified

| Gate | Result |
| --- | --- |
| `tsc --noEmit` (strict, `noUncheckedIndexedAccess`) | Clean |
| `eslint . --max-warnings 0` | Clean |
| `jest` | 23 passing, 3 suites |
| `expo export --platform web` | Builds |
| `expo export --platform ios --platform android` | Builds |
| Fonts in web bundle | 7 TTFs, correct families |
| Fonts in native bundle | 7 TTFs present (hash-named, extensionless) |
| Both themes in generated CSS | 68 variables each |

### Version deviations from the plan's §10 table

The stack is as specified; these are patch-level corrections made because
Expo SDK 57 pins a tested combination and I aligned to it rather than to the
newest published version.

| Package | Planned | Actual | Why |
| --- | --- | --- | --- |
| `typescript` | 5.9 | **6.0.3** | SDK 57 expects TS 6 |
| `react` / `react-dom` | 19.2 | **19.2.3** | RN 0.86.2 peer-requires `^19.2.3` |
| `react-native-gesture-handler` | 3.2.1 | **2.32.0** | SDK 57 pins v2; v3 is untested against it |
| `@shopify/flash-list` | 2.3.2 | **2.0.2** | SDK 57 pin. Still v2, as specified |
| `react-native-reanimated` | 4.5.3 | **4.5.1** | SDK 57 pin. Still v4, as specified |
| `@react-native-async-storage/async-storage` | 3.1.1 | **2.2.0** | SDK 57 pin |
| `react-test-renderer` | — | **removed**, replaced by `test-renderer` 1.2.0 | React 19 dropped it from core; RNTL 14 peer-requires the standalone package |

`npx expo install --check` reports **"Dependencies are up to date."**

### Three things worth knowing

1. **`render()` is asynchronous in React Native Testing Library 14.** It
   returns a Promise, so every test must `await` it. The shared helper in
   `src/test/render.tsx` handles this; call sites just need `await`.
2. **Font packages must be deep-imported.** A named import from
   `@expo-google-fonts/montserrat` pulls all 23 faces — italics included —
   into the bundle (~6.4MB of assets). Importing the seven `.ttf` files
   directly drops that to 1.4MB. `src/theme/fonts.ts` documents this so it is
   not "tidied" back later.
3. **`npx expo install --fix` crashes** in this install (`Cannot find module
   './utils/autoAddConfigPlugins.js'` inside `@expo/cli`). Versions were
   pinned by hand instead. `--check` works fine; only `--fix` is affected.

### Deliberately not built yet

`src/app/index.tsx` is a scaffold smoke screen, not the Home screen. It
exercises both typefaces, the type scale, money tones, surfaces and the theme
switch so the phase gate is verifiable. Phase 5 replaces it.

---

## 14. Phase 1 result

Eleven primitives built, all driven by tokens. 64 tests passing across 6
suites; `tsc`, `eslint --max-warnings 0` and web/iOS/Android bundles all clean.

### Built

| Component | Notes |
| --- | --- |
| `Icon` + `icons` | **57 glyphs**, not the ~40 estimated — the count grew once component-internal icons (back arrow, chevrons, external, backspace, search, share), the 4 tab icons, 6 bill categories and 4 social marks were included |
| `MoneyText` | 7 tones, masking, scaled currency symbol |
| `Button` | 7 variants x 3 sizes, loading spinner, press scale |
| `IconButton` | 6 variants x 3 sizes, rounded/circle |
| `Card` | 5 tones x 4 paddings |
| `Badge` | 6 statuses x 3 appearances x 3 sizes, optional dot |
| `StatusDot` | 5 tones, pulse |
| `RowTile` | 6 tones |
| `Avatar` | 5 sizes, deterministic tint, flag badge |
| `Screen` | Safe area, gutter, scroll, pull-to-refresh, fixed header slot |

### Decisions made while building

1. **Icons take an explicit colour.** React Native SVG has no `currentColor`,
   so colour cannot cascade from a parent the way the design assumes. Rather
   than have call sites guess, the tone-bearing components export a matching
   foreground hook — `useRowTileForeground('brand')`,
   `useIconButtonForeground('quiet')` — so a tile and its glyph can never
   drift apart.
2. **`MoneyText` spaces its currency symbol with trailing letter-spacing.**
   The design uses `margin-right: 2px` on a nested span; margin on nested
   `Text` is unreliable in RN, and a space character is far too wide at 46px.
   Letter-spacing applies after the final glyph in RN exactly as in CSS.
3. **`StatusDot`'s pulse is a real ring.** The source animates `box-shadow`
   spread, which RN cannot express. An expanding, fading sibling circle reads
   identically — as planned in §5.8.
4. **`Button` exposes its painted surface as `<testID>-surface`.** The fill,
   radius and height live on an inner animated view, so tests assert against a
   named seam rather than walking the child tree.

### Two toolchain findings

- **Reanimated 4 needs `react-native-worklets/jest/resolver.js`.** Without it
  every suite touching Reanimated dies on `loadUnpackers` — worklets' native
  entry expects the native runtime. The resolver (shipped by worklets) drops
  the `.native` extension under Jest. Using it means tests run against real
  Reanimated rather than a mock.
- **Never render in a loop with RNTL 14.** Sequential `await render(...)`
  calls leave overlapping `act()` scopes and poison the *whole* suite, not
  just the offending test. Render the set in one pass instead.

### Not yet wired

`src/app/index.tsx` is still a smoke screen — now exercising every primitive
in both themes. Navigation arrives in phase 3; the real Home screen in phase 5.

---

## 15. Phase 2 result

Eight layout and data components. **104 tests** across 8 suites; `tsc`,
`eslint --max-warnings 0` and web/iOS/Android bundles all clean.

### Built

| Component | Notes |
| --- | --- |
| `ScreenTitle` | 34px root title + optional subhead |
| `ScreenHeader` | 20px pushed title; back target defaults to `router.back()` |
| `SectionLabel` | 13/600 muted, optional trailing action |
| `ListRow` | Full-bleed, 3 affordances, danger tone, external links |
| `TransactionRow` | Direction sign + colour, status badge |
| `DetailRow` | Label/value, copy-to-clipboard with confirmed state |
| `EmptyState` | Sunken circle, heading, one line, optional fallback rows |
| `InlineAlert` | 4 tones, optional attached actions |

### The full-bleed row, resolved

The design widens a row to `calc(100% + 48px)` and pulls it back with a
negative margin so it reaches the screen edge while its content stays on the
gutter. In RN that is a negative horizontal margin plus matching padding — no
width calculation, and it composes with any gutter. `ListRow` and
`TransactionRow` both take a `gutter` prop so the 20px settings screens and
the 22px Bills screen bleed correctly too.

### A finding: `DetailRow`'s `numeric` prop does nothing

The source switches the value to `--font-mono` when `numeric` is set. **In
this design `--font-mono` and `--font-sans` are the same family** — Space
Grotesk, chosen precisely because its figures are already even-width — and
the source applies `tabular-nums` to the value either way. So the prop has no
visible effect in the shipping design.

I kept it, because call sites still want to state intent and it is the natural
hook if a second family ever arrives, but it is documented as inert rather
than left looking meaningful. **Worth a decision:** drop it, or keep it as
documentation?

### Deviation from the source worth confirming

`DetailRow` owns its copied state internally and flips "Copy" to "Copied"
permanently, matching the source's behaviour (the source never resets it). It
also actually writes to the clipboard via `expo-clipboard`, which the static
design could only imply. If you want the label to revert after a few seconds,
that is a one-line change.

### Two test-harness notes

- **`jest.mock` factories may only close over names beginning with `mock`.**
  Jest hoists the call above every declaration, so a plain `const back` in the
  factory is a compile error, not a runtime one.
- **React 19 needs `globalThis.IS_REACT_ACT_ENVIRONMENT = true`.** Without it
  any state update from an async handler warns even when correctly awaited —
  as `DetailRow`'s clipboard write does.

