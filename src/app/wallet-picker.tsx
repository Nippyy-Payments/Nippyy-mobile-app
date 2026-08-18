import { useRouter } from 'expo-router';

import { WalletPickerSheet } from '@/features/wallets/WalletPickerSheet';
import { useSendStore } from '@/store/send';

/**
 * The wallet picker, on its own route with modal presentation so back and the
 * dismiss gesture both work without custom handling.
 */
export default function WalletPickerRoute() {
  const router = useRouter();
  const setSourceWallet = useSendStore((s) => s.setSourceWallet);

  return (
    <WalletPickerSheet
      onSelect={(walletId, walletCurrency) => setSourceWallet(walletId, walletCurrency)}
      onClose={() => router.back()}
    />
  );
}
