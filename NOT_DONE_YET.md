# Not done yet

Work deliberately deferred, with the reason. Nothing here is forgotten or
silently dropped — each item is either blocked on a design that does not exist
yet, or scoped out of the current phase.

Decisions that produced this list are recorded in [PORTING_PLAN.md §8](PORTING_PLAN.md).

---

## 1. Controls that exist in the design with no destination behind them

These are drawn in the source and will be **built and visible**, but tapping
them does nothing until a destination screen is designed. Each renders in its
designed state and is wired to a no-op with a `TODO` marker, rather than being
hidden — hiding them would change the layout away from the design.

| Control | Screen | What is missing |
| --- | --- | --- |
| `+234` country chip | `phone` (onboarding) | No country / dialling-code picker screen exists |
| "Add recipient" icon button | `recipients` | No add-recipient form exists |
| "Edit" button | `profile` (your details) | No edit-profile screen exists |
| Crypto network chips (Ethereum / Base / Polygon) | `fund` → USDC | Source has `onChange={() => {}}`; switching networks must change the deposit address, and no address-per-network data exists |
| "Report a problem" | `txn` (transaction detail) | No support-ticket flow exists |
| "Share receipt" | `success`, `billpay` success | No receipt artefact defined (image? PDF? deep link?). Native share sheet is trivial; **what** to share is not specified |
| Corridor chip (`GBP → NGN`) | `rates` | No corridor picker screen exists |

**To close these:** each needs a designed destination. Once one exists, the
control is a one-line `router.push`.

---

## 2. Authentication failure paths

The design has no failure state for any auth step. Only the happy path is
drawn, so only the happy path is built.

| Missing | Where | Notes |
| --- | --- | --- |
| Wrong PIN | `pin`, `pin-gate` | No error copy, no shake/red state, no attempt counter, no lockout rule |
| Wrong OTP | `otp` | No error state on the code boxes |
| Expired OTP | `otp` | No expiry behaviour defined |
| Forgot PIN | `pin-gate` | No recovery entry point anywhere in the app |
| Resend timer | `otp` | Currently static text (`"Resend in 0:24"`). Needs a real countdown, a resend action, and a rate limit |
| Lockout / too many attempts | all | No policy defined |
| Biometric failure / fallback | `review`, `billpay` | `expo-local-authentication` can fail or be cancelled. Falls back to the PIN gate, but no failure copy is designed |

**To close these:** these need product rules (attempt limits, lockout
duration, recovery path) before they can be designed or built. The components
already support an error state — `Input` has `error`, `InlineAlert` has
`danger` — so the visual language exists; the rules do not.

---

## 3. Scoped out of this phase

| Item | Why |
| --- | --- |
| Tablet / desktop layouts | Explicitly mobile-only this phase. No breakpoints, no `useWindowDimensions` branching. Rework surface documented in [PORTING_PLAN.md §6](PORTING_PLAN.md) |
| E2E tests | Explicitly skipped. Unit + interaction tests via `@testing-library/react-native` only |
| Hover / focus-visible on native | Web-only by instruction. Ported as web-only styles |
| Push notifications | The app has a notifications *screen*; nothing defines delivery, permissions or deep-link targets |
| Real API integration | Only the wallets response shape is known (see PORTING_PLAN.md §8.7). Every other endpoint is modelled from the design's sample data behind a typed client, so swapping in real endpoints is a lib-layer change |
