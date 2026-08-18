import { useLocalSearchParams } from 'expo-router';

import { SendAmountScreen } from '@/features/send/SendAmountScreen';

export default function SendRoute() {
  const { recipient } = useLocalSearchParams<{ recipient?: string }>();
  return <SendAmountScreen recipientId={recipient ? String(recipient) : undefined} />;
}
