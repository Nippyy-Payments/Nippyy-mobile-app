import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTokens } from '@/theme/ThemeProvider';
import type { ColorTokens } from '@/theme/tokens';

export type RowTileTone = 'quiet' | 'sunken' | 'brand' | 'success' | 'warning' | 'danger';

export type RowTileProps = {
  children?: ReactNode;
  tone?: RowTileTone;
  /** Defaults to the 44px tile that leads a ListRow. */
  size?: number;
  /** Pass `size / 2` for a circle; RN has no percentage radius. */
  radius?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Background and matching foreground for each tone. */
function toneColors(colors: ColorTokens): Record<RowTileTone, { bg: string; fg: string }> {
  return {
    quiet: { bg: colors.surface.quiet, fg: colors.text.body },
    sunken: { bg: colors.surface.sunken, fg: colors.text.muted },
    brand: { bg: colors.brand.soft, fg: colors.status.infoText },
    success: { bg: colors.status.successSoft, fg: colors.status.successText },
    warning: { bg: colors.status.warningSoft, fg: colors.status.warningText },
    danger: { bg: colors.status.dangerSoft, fg: colors.status.dangerText },
  };
}

/**
 * The rounded square that leads a ListRow: a category icon, a biller's
 * monogram, a currency flag.
 *
 * `tone="brand"` marks the row as the primary path; `quiet` and `sunken` are
 * for everything else.
 */
export function RowTile({ children, tone = 'quiet', size, radius, style, testID }: RowTileProps) {
  const { colors, size: sizes, radii } = useTokens();

  const dimension = size ?? sizes.tile.lg;

  return (
    <View
      testID={testID}
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: radius ?? radii.lg,
          backgroundColor: toneColors(colors)[tone].bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Foreground colour for a tone. Icons inherit no colour in React Native, so
 * a caller passes this to `Icon` alongside the tile.
 */
export function useRowTileForeground(tone: RowTileTone = 'quiet'): string {
  const { colors } = useTokens();
  return toneColors(colors)[tone].fg;
}
