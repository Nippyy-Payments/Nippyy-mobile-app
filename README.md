# nippyy — mobile app

The nippyy diaspora payments app, ported from the design system in
`copy-of-nippyy-diaspora-payments-app/project/nippyy-app-ds` to Expo, running
on iOS, Android and web from one codebase.

```bash
npm install
npm start          # then i / a / w
```

| Script | What it does |
| --- | --- |
| `npm start` | Expo dev server |
| `npm run typecheck` | `tsc --noEmit`, strict |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm test` | Jest + @testing-library/react-native |
| `npm run theme:gen` | Regenerates `global.css` from `src/theme/tokens.ts` |

## The one rule

**Every colour, size, radius, duration and shadow comes from
`src/theme/tokens.ts`.** Nothing else may hardcode one.

This is enforced, not just asked for: `src/theme/__tests__/token-discipline.test.ts`
fails the build on a hex or `rgba()` outside the token file, on a component
reaching into the raw colour scales, and on any `shadowOffset` / `elevation`
written at a call site.

Run `npm run theme:gen` after editing tokens — the Tailwind/NativeWind theme
reads its CSS variables from the generated `global.css`.

## Layout

```
src/
  app/          expo-router routes only — a route file is a thin default export
  components/   presentational, no data fetching
  features/<x>/ feature-scoped screens
  theme/        tokens, typography, shadows, ThemeProvider
  lib/          api client, currency metadata, money formatting, auth
  store/        zustand: session (persisted) and send (not)
```

## Things that will bite if you undo them

- **Money is a string, end to end.** `lib/format.ts` groups and pads without
  parsing. Converting a balance to a float is how `8311.51` becomes
  `8311.509999`. Arithmetic goes through `sumAmounts`, in minor units.
- **Type roles carry resolved pixels.** The design expresses tracking in `em`
  and line-height unitless; React Native supports neither, so every role in
  `typography` has absolute values. Spread a role — never set `fontSize`
  alone.
- **Roles name a font family, never a `fontWeight`.** With static font files,
  Android synthesises bold by smearing glyphs.
- **`allowFontScaling={false}` lives in one place** — `components/Text.tsx` —
  so the decision can be reversed in one edit.
- **The tab bar is not hidden by a flag.** Full-screen flows live outside the
  `(tabs)` group, so there is no bar to hide.
- **`gestureEnabled` is never `false`.** A test enforces it.

## Where the decisions are written down

- [PORTING_PLAN.md](PORTING_PLAN.md) — the port: screen inventory, component
  mapping, every CSS feature with no RN equivalent and what was done about it,
  the 20 resolved design decisions, and a result section per phase.
- [NOT_DONE_YET.md](NOT_DONE_YET.md) — what is deliberately unfinished, and
  the known limitations of what is finished.

## Design source

Ported from `nippyy-app-ds`, which was extracted from the shipping build.
Two things about that design shape everything here: **elevation is off** —
separation comes from tone and 1px hairlines, not shadow — and **no gradients
or imagery ship at all**.
