import { Platform, type ViewStyle } from 'react-native';

import { shadows, type ShadowToken } from './tokens';

export type ShadowName = keyof typeof shadows;

/**
 * Resolves a shadow token to the right props for the current platform.
 *
 * CSS box-shadow, iOS shadow props and Android elevation do not correspond,
 * so each token carries per-platform values tuned to look the same rather
 * than to match numerically. Call sites use `shadow('sm')` and never write
 * shadowOffset or elevation themselves.
 *
 * Note: this design ships almost no elevation. `none` is the correct answer
 * nearly everywhere — see PORTING_PLAN.md §4.
 */
export function shadow(name: ShadowName): ViewStyle {
  const token: ShadowToken = shadows[name];

  return Platform.select<ViewStyle>({
    ios: token.ios,
    android: token.android,
    default: token.web as unknown as ViewStyle,
  });
}
