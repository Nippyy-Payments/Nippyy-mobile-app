import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { useTokens } from '@/theme/ThemeProvider';
import { tabularNums } from '@/theme/tokens';

export type DetailEmphasis = 'default' | 'strong' | 'money' | 'muted' | 'onInk';

export type DetailRowProps = {
  label: string;
  value: string;
  /**
   * Marks the value as a figure — money, a rate, a reference code.
   *
   * In the source this switched the value to `--font-mono`. It has no visible
   * effect here: this design points `--font-mono` and `--font-sans` at the
   * same family (Space Grotesk, chosen because its figures are already
   * even-width), and the value carries tabular figures either way. Kept so
   * call sites can still state intent, and so the day a second family arrives
   * there is somewhere to hang it. See PORTING_PLAN.md §15.
   */
  numeric?: boolean;
  emphasis?: DetailEmphasis;
  divider?: boolean;
  /** Adds a copy control. Copies `value` unless `copyValue` overrides it. */
  copyable?: boolean;
  copyValue?: string;
  onCopied?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PADDING_Y = 11;
const GAP = 16;
const VALUE_GAP = 8;

/**
 * A label/value line in a fee breakdown, a receipt or a bank-details block.
 *
 * The label is small and subtle; the value carries the weight.
 */
export function DetailRow({
  label,
  value,
  numeric: _numeric = false,
  emphasis = 'default',
  divider = false,
  copyable = false,
  copyValue,
  onCopied,
  style,
  testID,
}: DetailRowProps) {
  const { colors, borderWidth } = useTokens();
  const [copied, setCopied] = useState(false);

  const colorFor: Record<DetailEmphasis, string> = {
    default: colors.text.body,
    strong: colors.text.strong,
    money: colors.money.in,
    muted: colors.text.muted,
    onInk: colors.text.onInk,
  };

  const copy = async () => {
    await Clipboard.setStringAsync(copyValue ?? value);
    setCopied(true);
    onCopied?.();
  };

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: GAP,
          paddingVertical: PADDING_Y,
          borderBottomWidth: divider ? borderWidth.hairline : 0,
          borderBottomColor: colors.border.subtle,
        },
        style,
      ]}
    >
      <Text variant="caption" tone="subtle">
        {label}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: VALUE_GAP }}>
        <Text
          variant="captionStrong"
          numberOfLines={1}
          style={{ color: colorFor[emphasis], fontVariant: [...tabularNums] }}
        >
          {value}
        </Text>

        {copyable ? (
          <Pressable
            onPress={copy}
            accessibilityRole="button"
            accessibilityLabel={copied ? `${label} copied` : `Copy ${label}`}
            testID={testID ? `${testID}-copy` : undefined}
          >
            <Text
              variant="captionStrong"
              style={{ color: copied ? colors.status.success : colors.text.link }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
