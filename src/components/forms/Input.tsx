import { useState, type ReactNode } from 'react';
import {
  Platform,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import { focusRing } from '@/theme/tokens';
import { textStyles } from '@/theme/typography';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> & {
  label?: string;
  value?: string;
  onChangeText?: (next: string) => void;
  size?: InputSize;
  helper?: string;
  /** Replaces the helper line and turns the border red. */
  error?: string;
  prefix?: ReactNode;
  suffix?: string | ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING_H = 14;
const GAP = 10;
const STACK_GAP = 7;
const LABEL_INSET = 2;

/**
 * Labelled text field with helper/error text and optional adornments.
 *
 * The 1.5px border turns cyan on focus with a 4px halo. CSS expresses that
 * halo as a spread-only `box-shadow`, which RN cannot do, so it is drawn as a
 * real ring behind the field on native and as a `boxShadow` on web.
 */
export function Input({
  label,
  value,
  onChangeText,
  size = 'md',
  helper,
  error,
  prefix,
  suffix,
  disabled = false,
  style,
  testID,
  ...rest
}: InputProps) {
  const { colors, size: sizes, radius, borderWidth } = useTokens();
  const [focused, setFocused] = useState(false);

  const invalid = Boolean(error);
  const showRing = focused && !invalid;

  const borderColor = invalid
    ? colors.status.danger
    : focused
      ? colors.border.focus
      : 'transparent';

  return (
    <View style={[{ rowGap: STACK_GAP }, style]}>
      {label ? (
        <Text variant="captionStrong" tone="subtle" style={{ paddingLeft: LABEL_INSET }}>
          {label}
        </Text>
      ) : null}

      <View>
        {/* The focus halo. A spread-only shadow has no RN equivalent, so it is
            an inset-negative ring sitting behind the field. */}
        {showRing ? (
          <View
            pointerEvents="none"
            testID={testID ? `${testID}-focus-ring` : undefined}
            style={{
              position: 'absolute',
              top: -focusRing.width,
              left: -focusRing.width,
              right: -focusRing.width,
              bottom: -focusRing.width,
              borderRadius: radius.field + focusRing.width,
              backgroundColor: focusRing.color,
            }}
          />
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: GAP,
            height: sizes.field[size],
            paddingHorizontal: PADDING_H,
            backgroundColor: disabled ? colors.surface.disabled : colors.surface.quiet,
            borderWidth: borderWidth.strong,
            borderColor,
            borderRadius: radius.field,
            opacity: disabled ? DISABLED_OPACITY : 1,
          }}
        >
          {prefix ? <View style={{ flexShrink: 0 }}>{prefix}</View> : null}

          <TextInput
            value={value}
            onChangeText={onChangeText}
            editable={!disabled}
            allowFontScaling={false}
            placeholderTextColor={colors.text.subtle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessibilityLabel={label}
            testID={testID}
            style={[
              textStyles.input,
              {
                flex: 1,
                minWidth: 0,
                height: '100%',
                color: colors.text.strong,
              },
              // Browsers draw their own focus outline; the design supplies
              // its own halo, so suppress the native one on web only.
              Platform.OS === 'web' ? { outlineWidth: 0 } : null,
            ]}
            {...rest}
          />

          {typeof suffix === 'string' ? (
            <Text variant="labelMuted" tone="muted">
              {suffix}
            </Text>
          ) : (
            suffix
          )}
        </View>
      </View>

      {error || helper ? (
        <Text
          variant="caption"
          style={{
            paddingLeft: LABEL_INSET,
            color: invalid ? colors.status.danger : colors.text.muted,
          }}
        >
          {error ?? helper}
        </Text>
      ) : null}
    </View>
  );
}

const DISABLED_OPACITY = 0.6;
