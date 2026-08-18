import { useLocalSearchParams } from 'expo-router';

import { TransactionScreen } from '@/features/activity/TransactionScreen';

export default function TransactionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TransactionScreen id={String(id ?? '')} />;
}
