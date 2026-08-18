import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import type { ColorTokens } from '@/theme/tokens';

export type AlertTone = 'warning' | 'danger' | 'success' | 'info';

export type InlineAlertProps = {
  tone?: AlertTone;
  title: string;
  detail?: string;
  /** Pass an `<Icon>`; colour it with `useAlertIconColor(tone)`. */
  icon?: ReactNode;
  /**
   * The fix, attached to the problem. An alert without one is just bad news —
   * pass actions whenever the user can do something about it.
   */
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING_V = 12;
const PADDING_H = 14;
const GAP = 10;
const DETAIL_GAP = 2;
const ACTIONS_GAP = 9;
const ICON_NUDGE = 1;

function tones(colors: ColorTokens): Record<AlertTone, { bg: string; border: string; fg: string }> {
  return {
    warning: {
      bg: colors.status.warningSoft,
      border: colors.status.warningBorder,
      fg: colors.status.warningText,
    },
    danger: {
      bg: colors.status.dangerSoft,
      border: colors.status.dangerBorder,
      fg: colors.status.dangerText,
    },
    success: {
      bg: colors.status.successSoft,
      border: colors.status.successBorder,
      fg: colors.status.successText,
    },
    info: {
      bg: colors.status.infoSoft,
      border: colors.status.infoBorder,
      fg: colors.status.infoText,
    },
  };
}

/**
 * The in-flow notice that explains a limit, a shortfall or a risk right where
 * it bites, with the action to resolve it attached.
 *
 * One of the few places the app uses a tinted fill.
 */
export function InlineAlert({
  tone = 'warning',
  title,
  detail,
  icon,
  actions,
  style,
  testID,
}: InlineAlertProps) {
  const { colors, radius, borderWidth, spacing } = useTokens();
  const resolved = tones(colors)[tone];

  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          columnGap: GAP,
          paddingVertical: PADDING_V,
          paddingHorizontal: PADDING_H,
          borderRadius: radius.alert,
          borderWidth: borderWidth.hairline,
          borderColor: resolved.border,
          backgroundColor: resolved.bg,
        },
        style,
      ]}
    >
      {icon ? <View style={{ marginTop: ICON_NUDGE, flexShrink: 0 }}>{icon}</View> : null}

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="label" style={{ color: resolved.fg }}>
          {title}
        </Text>

        {detail ? (
          <Text variant="caption" tone="muted" style={{ marginTop: DETAIL_GAP }}>
            {detail}
          </Text>
        ) : null}

        {actions ? (
          <View
            style={{
              flexDirection: 'row',
              columnGap: spacing.sm,
              marginTop: ACTIONS_GAP,
            }}
          >
            {actions}
          </View>
        ) : null}
      </View>
    </View>
  );
}

/** The glyph colour that matches a tone. */
export function useAlertIconColor(tone: AlertTone = 'warning'): string {
  const { colors } = useTokens();
  return tones(colors)[tone].fg;
}
