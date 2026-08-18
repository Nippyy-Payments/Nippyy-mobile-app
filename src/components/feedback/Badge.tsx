import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import type { TypeVariant } from '@/theme/typography';

export type BadgeStatus = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeAppearance = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeProps = {
  children?: ReactNode;
  status?: BadgeStatus;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const TYPE_BY_SIZE: Record<BadgeSize, TypeVariant> = {
  sm: 'microStrong',
  md: 'captionStrong',
  lg: 'label',
};

const PADDING: Record<BadgeSize, number> = { sm: 8, md: 10, lg: 12 };

/** Leading dot diameter. */
const DOT = 6;
/** Gap between dot and label. */
const GAP = 6;

/**
 * The compact status pill.
 *
 * Soft by default — a tinted fill with a darker label — which is how the app
 * states a transaction's state, a tier, or a verified biller without
 * shouting.
 */
export function Badge({
  children,
  status = 'neutral',
  appearance = 'soft',
  size = 'md',
  dot = false,
  style,
  testID,
}: BadgeProps) {
  const { colors, size: sizes, radii, borderWidth } = useTokens();

  const palettes: Record<
    BadgeStatus,
    { softBg: string; softFg: string; solidBg: string; main: string }
  > = {
    neutral: {
      softBg: colors.status.neutralSoft,
      softFg: colors.status.neutralText,
      solidBg: colors.status.neutralText,
      main: colors.status.neutralMain,
    },
    brand: {
      softBg: colors.brand.soft,
      softFg: colors.status.infoText,
      solidBg: colors.brand.default,
      main: colors.brand.default,
    },
    info: {
      softBg: colors.status.infoSoft,
      softFg: colors.status.infoText,
      solidBg: colors.status.info,
      main: colors.status.info,
    },
    success: {
      softBg: colors.status.successSoft,
      softFg: colors.status.successText,
      solidBg: colors.status.success,
      main: colors.status.success,
    },
    warning: {
      softBg: colors.status.warningSoft,
      softFg: colors.status.warningText,
      solidBg: colors.status.warning,
      main: colors.status.warning,
    },
    danger: {
      softBg: colors.status.dangerSoft,
      softFg: colors.status.dangerText,
      solidBg: colors.status.danger,
      main: colors.status.danger,
    },
  };

  const palette = palettes[status];

  const resolved =
    appearance === 'solid'
      ? { bg: palette.solidBg, fg: colors.text.onBrand, border: 'transparent' }
      : appearance === 'outline'
        ? { bg: 'transparent', fg: palette.softFg, border: palette.main }
        : { bg: palette.softBg, fg: palette.softFg, border: 'transparent' };

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: GAP,
          height: sizes.badge[size],
          paddingHorizontal: PADDING[size],
          backgroundColor: resolved.bg,
          borderColor: resolved.border,
          borderWidth: borderWidth.hairline,
          borderRadius: radii.pill,
          flexShrink: 0,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={{
            width: DOT,
            height: DOT,
            borderRadius: DOT / 2,
            backgroundColor: appearance === 'solid' ? colors.text.onBrand : palette.main,
            flexShrink: 0,
          }}
        />
      )}
      <Text variant={TYPE_BY_SIZE[size]} style={{ color: resolved.fg }} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}
