import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  name?: string;
  src?: string | null;
  size?: AvatarSize;
  /**
   * A country flag, shown as a badge on the lower-right.
   *
   * These are emoji (PORTING_PLAN.md §8.10). On a platform without an emoji
   * font they degrade to letter pairs — "NG" — which is legible but not the
   * design.
   */
  flag?: string | null;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Initials size, flag badge size and flag glyph size, as fractions of the avatar. */
const INITIALS_RATIO = 0.38;
const FLAG_RATIO = 0.42;
const FLAG_GLYPH_RATIO = 0.28;

/** Tracking on initials, in px per px of size. */
const INITIALS_TRACKING = -0.01;

/** Takes the first letter of up to two words. */
export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase();
}

/**
 * Picks a palette deterministically, so the same person keeps the same colour
 * everywhere in the app.
 */
export function paletteIndexOf(name: string, paletteCount: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % paletteCount;
}

/**
 * Recipient or user identity.
 *
 * Renders an image when `src` is given, otherwise initials on a deterministic
 * brand-tinted background. The flag ring uses `surface.raised` rather than a
 * hard-coded white so it stays invisible in dark mode.
 */
export function Avatar({ name = '', src, size = 'md', flag, style, testID }: AvatarProps) {
  const { colors, size: sizes, borderWidth } = useTokens();

  const dimension = sizes.avatar[size];
  const palette = colors.avatar[paletteIndexOf(name, colors.avatar.length)];
  const initials = initialsOf(name);
  const flagSize = dimension * FLAG_RATIO;

  return (
    <View testID={testID} style={[{ width: dimension, height: dimension, flexShrink: 0 }, style]}>
      <View
        style={{
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: src ? colors.surface.quiet : palette?.bg,
        }}
      >
        {src ? (
          <Image
            source={{ uri: src }}
            accessibilityLabel={name}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Text
            variant="bodyStrong"
            style={{
              color: palette?.fg,
              fontSize: dimension * INITIALS_RATIO,
              lineHeight: dimension,
              letterSpacing: dimension * INITIALS_TRACKING,
            }}
          >
            {initials}
          </Text>
        )}
      </View>

      {flag ? (
        <View
          style={{
            position: 'absolute',
            right: -FLAG_OFFSET,
            bottom: -FLAG_OFFSET,
            width: flagSize,
            height: flagSize,
            borderRadius: flagSize / 2,
            backgroundColor: colors.surface.raised,
            borderWidth: borderWidth.strong,
            borderColor: colors.surface.raised,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Text
            variant="micro"
            style={{ fontSize: dimension * FLAG_GLYPH_RATIO, lineHeight: flagSize }}
          >
            {flag}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/** How far the flag badge overhangs the avatar edge. */
const FLAG_OFFSET = 2;
