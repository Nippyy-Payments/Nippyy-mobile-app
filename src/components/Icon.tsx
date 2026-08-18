import Svg, { G } from 'react-native-svg';

import { useTokens } from '@/theme/ThemeProvider';

import { icons, type IconName } from './icons';

export type IconProps = {
  name: IconName;
  /** Glyph box, in px. Defaults to the design's common 20px. */
  size?: number;
  /**
   * Resolved stroke/fill colour. React Native SVG has no `currentColor`, so
   * a caller that sets a surface tone must pass the matching foreground.
   */
  color?: string;
  /**
   * The set is drawn at 1.9 by default. A handful of places in the design use
   * a heavier stroke — the back arrow (2.1) and the chevrons (2).
   */
  strokeWidth?: number;
  testID?: string;
};

/**
 * Renders one glyph from the icon registry.
 *
 * Stroke, fill and joins are set once on a wrapping `G` so registry entries
 * stay pure path data; only genuinely filled shapes override them.
 */
export function Icon({ name, size, color, strokeWidth = 1.9, testID }: IconProps) {
  const { colors, size: sizes } = useTokens();

  const box = size ?? sizes.icon.lg;
  const stroke = color ?? colors.text.body;

  return (
    <Svg testID={testID} width={box} height={box} viewBox="0 0 24 24" fill="none">
      <G
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {icons[name](stroke)}
      </G>
    </Svg>
  );
}
