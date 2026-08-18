import { useLocalSearchParams } from 'expo-router';

import { BillPayScreen } from '@/features/bills/BillPayScreen';

export default function BillPayRoute() {
  const { category } = useLocalSearchParams<{ category: string }>();
  return <BillPayScreen categoryId={String(category ?? '')} />;
}
