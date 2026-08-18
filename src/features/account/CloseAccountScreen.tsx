import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/core/Button';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { Input } from '@/components/forms/Input';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { SectionLabel } from '@/components/core/SectionLabel';
import { CLOSE_CONFIRMATION, CLOSE_FACTS, CLOSE_REASONS } from '@/features/account/menu';
import { HOME_CURRENCY, totalInHomeCurrency, useRates, useWallets } from '@/lib/api/queries';
import { formatMoney } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';

const FACT_GAP = 11;
const FACT_PAD_Y = 16;

/** The facts a user should read before closing. */
export function CloseAccountIntro() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, size, borderWidth } = theme;

  const wallets = useWallets();
  const rates = useRates();
  const total = totalInHomeCurrency(wallets.data, rates.data);

  return (
    <Screen scroll header={<ScreenHeader title="Close account" />}>
      <ScreenTitle subhead="You can do this yourself. No phone call needed.">
        Close your nippyy account
      </ScreenTitle>

      <View style={{ marginTop: spacing.lg }}>
        {/* The money warning comes first, and quotes the real balance. */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            columnGap: FACT_GAP,
            paddingVertical: FACT_PAD_Y,
            borderTopWidth: borderWidth.hairline,
            borderTopColor: colors.border.subtle,
          }}
        >
          <Icon name="warn" size={size.icon.md} color={colors.status.warningText} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="bodyStrong" tone="strong">
              Move your money first
            </Text>
            <Text variant="labelMuted" tone="muted" style={{ marginTop: 2 }}>
              {total
                ? `You still hold ${formatMoney(total, HOME_CURRENCY)} across ${wallets.data?.length ?? 0} wallets. Withdraw or send it before closing — we cannot reopen a closed account to release funds.`
                : 'Withdraw or send anything you hold before closing — we cannot reopen a closed account to release funds.'}
            </Text>
          </View>
        </View>

        {CLOSE_FACTS.map((fact) => (
          <View
            key={fact.heading}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              columnGap: FACT_GAP,
              paddingVertical: FACT_PAD_Y,
              borderTopWidth: borderWidth.hairline,
              borderTopColor: colors.border.subtle,
            }}
          >
            <Icon name="info" size={size.icon.md} color={colors.text.placeholder} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="bodyStrong" tone="strong">
                {fact.heading}
              </Text>
              <Text variant="labelMuted" tone="muted" style={{ marginTop: 2 }}>
                {fact.body}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: spacingRaw.sectionGapSm, rowGap: spacingRaw.buttonStackGap }}>
        <Button
          variant="quiet"
          size="lg"
          fullWidth
          testID="continue-close"
          onPress={() => router.push('/account/close/confirm')}
        >
          Continue to close account
        </Button>
        <Button variant="ghost" size="md" fullWidth onPress={() => router.back()}>
          Keep my account
        </Button>
      </View>
    </Screen>
  );
}

/** The irreversible step: type CLOSE, optionally say why. */
export function CloseAccountConfirm() {
  const router = useRouter();
  const { theme } = useTheme();
  const { spacing, spacingRaw } = theme;

  const [typed, setTyped] = useState('');
  const [reason, setReason] = useState<string | null>(null);

  const ready = typed.trim().toUpperCase() === CLOSE_CONFIRMATION;

  return (
    <Screen scroll={false} header={<ScreenHeader title="Close account" />}>
      <ScreenTitle>This cannot be undone</ScreenTitle>

      <Text variant="body" tone="muted" style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>
        {`Type ${CLOSE_CONFIRMATION} to confirm. We delete your profile and recipients, and keep only the transaction records the law requires.`}
      </Text>

      <Input
        value={typed}
        onChangeText={setTyped}
        placeholder={CLOSE_CONFIRMATION}
        size="lg"
        autoCapitalize="characters"
        autoCorrect={false}
        testID="close-confirmation"
        style={{ marginBottom: spacing.xl }}
      />

      <SectionLabel>Why are you leaving? (optional)</SectionLabel>
      <ChipGroup tone="brand" size="lg" options={CLOSE_REASONS} value={reason} onChange={setReason} />

      <View style={{ flex: 1, minHeight: spacing.xl }} />

      <Button
        variant="danger"
        size="lg"
        fullWidth
        disabled={!ready}
        testID="close-account"
        iconLeft={<Icon name="trash" size={17} color={theme.colors.text.onBrand} />}
      >
        Close my account
      </Button>
      <Button
        variant="ghost"
        size="md"
        fullWidth
        style={{ marginTop: spacingRaw.buttonStackGap }}
        onPress={() => router.back()}
      >
        Go back
      </Button>
    </Screen>
  );
}
