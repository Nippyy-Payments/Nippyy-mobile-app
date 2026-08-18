import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/Text';
import { Badge } from '@/components/feedback/Badge';
import { ListRow } from '@/components/data/ListRow';
import { MoneyText } from '@/components/data/MoneyText';
import { RowTile } from '@/components/data/RowTile';
import { SectionLabel } from '@/components/core/SectionLabel';
import { SkeletonRows } from '@/components/feedback/Skeleton';
import { currency, type CurrencyCode } from '@/lib/currency';
import { formatMoney } from '@/lib/format';
import { useWallets } from '@/lib/api/queries';
import { useTheme } from '@/theme/ThemeProvider';

export type WalletPickerSheetProps = {
  /**
   * Called with the chosen wallet. The currency travels with the id, because
   * the caller stores both and must not have to guess one from the other.
   */
  onSelect: (walletId: string, walletCurrency: CurrencyCode) => void;
  onClose: () => void;
};

const HANDLE_WIDTH = 40;
const HANDLE_HEIGHT = 4;

/**
 * Choose which wallet pays.
 *
 * The primary wallet is the default and never has to be picked — this is for
 * changing it (PORTING_PLAN.md §8.7). Presented as a sheet on its own route,
 * so system back and the swipe-down both dismiss it without custom handling.
 */
export function WalletPickerSheet({ onSelect, onClose }: WalletPickerSheetProps) {
  const { theme } = useTheme();
  const { colors, spacing, gutter, radii } = theme;

  const sheet = useRef<BottomSheetModal>(null);
  const wallets = useWallets();

  useEffect(() => {
    sheet.current?.present();
  }, []);

  const handleDismiss = useCallback(() => onClose(), [onClose]);

  return (
    <BottomSheetModal
      ref={sheet}
      onDismiss={handleDismiss}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.surface.page }}
      handleIndicatorStyle={{
        backgroundColor: colors.border.strong,
        width: HANDLE_WIDTH,
        height: HANDLE_HEIGHT,
        borderRadius: radii.track,
      }}
    >
      <BottomSheetView style={{ paddingHorizontal: gutter.default, paddingBottom: spacing['4xl'] }}>
        <Text variant="screenHeader" tone="strong" accessibilityRole="header">
          Pay from
        </Text>
        <Text variant="body" tone="muted" style={{ marginTop: spacing.xs }}>
          Your primary wallet is used unless you pick another.
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          {wallets.isPending ? (
            <SkeletonRows count={3} />
          ) : (
            <>
              <SectionLabel>{`${wallets.data?.length ?? 0} wallets`}</SectionLabel>
              {wallets.data?.map((wallet, index) => {
                const meta = currency(wallet.currency);
                return (
                  <ListRow
                    key={wallet.id}
                    first={index === 0}
                    testID={`wallet-${wallet.currency}`}
                    leading={
                      <RowTile tone="sunken">
                        <Text variant="emptyTitle">{meta.flag}</Text>
                      </RowTile>
                    }
                    title={meta.name}
                    subtitle={meta.capability}
                    affordance="none"
                    trailing={
                      <View style={{ alignItems: 'flex-end', rowGap: spacing.xs }}>
                        <MoneyText>{formatMoney(wallet.balance, wallet.currency)}</MoneyText>
                        {wallet.primary ? (
                          <Badge status="info" size="sm">
                            Primary
                          </Badge>
                        ) : null}
                      </View>
                    }
                    onPress={() => {
                      onSelect(wallet.id, wallet.currency);
                      sheet.current?.dismiss();
                    }}
                  />
                );
              })}
            </>
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
