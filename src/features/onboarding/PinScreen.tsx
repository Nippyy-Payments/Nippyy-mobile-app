import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { Keypad } from '@/components/forms/Keypad';
import { OtpField } from '@/components/forms/OtpField';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import {
  PIN_LENGTH,
  applyPinKey,
  initialPinState,
  pinCopy,
  settlePin,
  type PinMode,
  type PinState,
} from '@/features/onboarding/pinMachine';
import { useTheme } from '@/theme/ThemeProvider';

const TILE = 64;
const ICON = 26;
/** Long enough for the last dot to register before the screen moves on. */
const SETTLE_MS = 320;

export type PinScreenProps = {
  /**
   * `create` walks the two-step set-up; `gate` confirms an action that is
   * already in flight (PORTING_PLAN.md §8.14).
   */
  mode?: PinMode;
  /** Shown on the gate, when biometrics are available as an alternative. */
  onUseBiometrics?: () => void;
  onComplete: (pin: string) => void;
  onBack?: () => void;
};

/**
 * PIN entry, for both creating one and confirming an action with it.
 *
 * The rules live in `pinMachine`; this screen owns only the presentation and
 * the short settle delay that lets the last dot register before the step
 * changes.
 */
export function PinScreen({ mode = 'create', onUseBiometrics, onComplete, onBack }: PinScreenProps) {
  const { theme } = useTheme();
  const { spacing, spacingRaw, colors } = theme;
  const brandFg = useRowTileForeground('brand');

  const [pin, setPin] = useState('');
  const [state, setState] = useState<PinState>(initialPinState);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    },
    []
  );

  const handleKey = useCallback((key: string) => {
    // The updater form is required: presses can land faster than a render.
    setPin((current) => applyPinKey(current, key));
  }, []);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    settleTimer.current = setTimeout(() => {
      const outcome = settlePin(state, pin, mode);
      if (outcome.type === 'complete') {
        onComplete(outcome.pin);
        return;
      }
      setState(outcome.state);
      setPin('');
    }, SETTLE_MS);

    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [pin, state, mode, onComplete]);

  const copy = pinCopy(state, mode);
  const isGate = mode === 'gate';

  return (
    <Screen scroll={false} header={<ScreenHeader onBack={onBack} showBack={Boolean(onBack)} />}>
      <View style={{ alignItems: 'center', paddingTop: spacing.md }}>
        <RowTile tone="brand" size={TILE} radius={TILE / 2}>
          <Icon name="lock" size={ICON} color={brandFg} />
        </RowTile>

        <Text
          variant="flowTitle"
          tone="strong"
          accessibilityRole="header"
          style={{ marginTop: spacing.lg, textAlign: 'center' }}
        >
          {copy.title}
        </Text>
        <Text
          variant="labelMuted"
          tone="muted"
          style={{ marginTop: spacing.sm, textAlign: 'center', maxWidth: 260 }}
        >
          {copy.body}
        </Text>
      </View>

      <OtpField
        value={pin}
        length={PIN_LENGTH}
        mask
        style={{ marginTop: spacingRaw.sectionGapLg }}
        testID="pin"
      />

      {isGate && onUseBiometrics ? (
        <Button
          variant="ghost"
          size="sm"
          style={{ alignSelf: 'center', marginTop: spacing['2xl'] }}
          onPress={onUseBiometrics}
          iconLeft={<Icon name="faceid" size={17} color={colors.status.infoText} />}
        >
          Use Face ID instead
        </Button>
      ) : null}

      {state.mismatch ? (
        <Text
          variant="caption"
          testID="pin-mismatch"
          style={{ textAlign: 'center', marginTop: spacing.md, color: colors.status.danger }}
        >
          Those did not match. Start again.
        </Text>
      ) : null}

      <View style={{ flex: 1, minHeight: spacing.lg }} />

      <Keypad decimal={false} onKey={handleKey} />
    </Screen>
  );
}
