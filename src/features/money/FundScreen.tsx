import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Badge } from '@/components/feedback/Badge';
import { Button } from '@/components/core/Button';
import { Card } from '@/components/core/Card';
import { ChipGroup } from '@/components/forms/ChipGroup';
import { DetailRow } from '@/components/data/DetailRow';
import { InlineAlert, useAlertIconColor } from '@/components/feedback/InlineAlert';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile, useRowTileForeground } from '@/components/data/RowTile';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionLabel } from '@/components/core/SectionLabel';
import { SkeletonRows } from '@/components/feedback/Skeleton';
import { STABLECOIN } from '@/lib/currency';
import { primaryWallet, useWallets } from '@/lib/api/queries';
import { useTheme } from '@/theme/ThemeProvider';

type Method = 'bank' | 'card' | 'crypto';

const METHODS = [
  { key: 'bank', label: 'Bank transfer' },
  { key: 'card', label: 'Debit card' },
  { key: 'crypto', label: STABLECOIN },
];

/** The chains USDC can arrive on. There is no other coin to choose. */
const NETWORKS = ['Ethereum', 'Base', 'Polygon'];
const TILE = 38;

export function FundScreen() {
  const { theme } = useTheme();
  const { colors, spacing, spacingRaw, radius, size } = theme;

  const [method, setMethod] = useState<Method>('bank');
  const [network, setNetwork] = useState<string>('Base');
  const [copied, setCopied] = useState(false);

  const infoFg = useAlertIconColor('info');
  const warnFg = useAlertIconColor('warning');
  const dangerFg = useAlertIconColor('danger');
  const quietFg = useRowTileForeground('quiet');
  const brandFg = useRowTileForeground('brand');

  const wallets = useWallets();
  const account = primaryWallet(wallets.data)?.virtualAccounts[0];

  return (
    <Screen header={<ScreenHeader title="Add money" />}>
      <Text variant="body" tone="muted">
        Top up a wallet, then send or convert.
      </Text>

      <ChipGroup
        style={{ marginTop: spacing.xl }}
        size="lg"
        tone="ink"
        options={METHODS}
        value={method}
        onChange={(next) => next && setMethod(next as Method)}
      />

      {method === 'bank' ? (
        <>
          <SectionLabel style={{ marginTop: spacingRaw.sectionGapSm }}>
            Send a transfer to
          </SectionLabel>

          {wallets.isPending ? (
            <SkeletonRows count={2} />
          ) : account ? (
            <Card tone="sunken">
              <DetailRow label="Account name" value={account.accountName} divider />
              <DetailRow label="Bank" value={account.bankName} divider />
              <DetailRow
                label="Account number"
                value={account.accountNumber}
                numeric
                copyable
                divider
                testID="account-number"
              />
              <DetailRow label="Reference" value="TOBI-NP" numeric />
            </Card>
          ) : null}

          <InlineAlert
            style={{ marginTop: spacing.lg }}
            tone="info"
            title="Use the reference"
            detail="Without it we cannot match your transfer, and it may take up to 2 working days to trace."
            icon={<Icon name="info" size={size.icon.sm} color={infoFg} />}
          />
        </>
      ) : null}

      {method === 'card' ? (
        <>
          <SectionLabel style={{ marginTop: spacingRaw.sectionGapSm }}>Your cards</SectionLabel>
          <ListRow
            first
            leading={
              <RowTile size={TILE} radius={radius.tile}>
                <Icon name="card" size={size.icon.md} color={quietFg} />
              </RowTile>
            }
            title="Visa ···4471"
            subtitle="Expires 09/28"
            affordance="none"
            trailing={
              <Badge status="neutral" size="sm">
                Default
              </Badge>
            }
          />
          <ListRow
            leading={
              <RowTile tone="brand" size={TILE} radius={radius.tile}>
                <Icon name="plus" size={size.icon.md} color={brandFg} />
              </RowTile>
            }
            title="Add a new card"
            onPress={() => {}}
          />

          <InlineAlert
            style={{ marginTop: spacing.lg }}
            tone="warning"
            title="Card top-ups carry a 1.4% fee"
            detail="A bank transfer is free and usually clears within the hour."
            icon={<Icon name="warn" size={size.icon.sm} color={warnFg} />}
          />
        </>
      ) : null}

      {method === 'crypto' ? (
        <>
          <SectionLabel style={{ marginTop: spacingRaw.sectionGapSm }}>
            {`Deposit ${STABLECOIN}`}
          </SectionLabel>

          <ChipGroup
            style={{ marginBottom: spacing.lg }}
            options={NETWORKS}
            value={network}
            onChange={(next) => next && setNetwork(next)}
          />

          <Card tone="ink">
            <Text variant="caption" style={{ color: colors.text.onInk, opacity: 0.7 }}>
              {`Your ${STABLECOIN} address · ${network}`}
            </Text>

            <View style={{ marginTop: spacing.sm }}>
              <MoneyText variant="addressCode" tone="onInk" testID="deposit-address">
                0x7A41c8b2E9d0F3a5B6c8D1e2F3a4B5c6D7e8F9a0
              </MoneyText>
            </View>

            <View style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}>
              <Button
                size="sm"
                variant="secondary"
                onPress={() => setCopied(true)}
                iconLeft={<Icon name="copy" size={14} color={colors.status.infoText} />}
              >
                {copied ? 'Copied' : 'Copy address'}
              </Button>
            </View>
          </Card>

          <InlineAlert
            style={{ marginTop: spacing.lg }}
            tone="danger"
            title={`${STABLECOIN} only, on the network shown`}
            detail="Sending any other coin, or using a different network, loses the funds permanently. We cannot recover them."
            icon={<Icon name="warn" size={size.icon.sm} color={dangerFg} />}
          />
        </>
      ) : null}
    </Screen>
  );
}
