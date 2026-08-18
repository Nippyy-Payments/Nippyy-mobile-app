import { useRouter } from 'expo-router';

import { PinScreen } from '@/features/onboarding/PinScreen';

/**
 * The PIN gate in front of a transfer.
 *
 * Reached when biometrics are off, unsupported, or were cancelled — every
 * money action passes through confirmation (PORTING_PLAN.md §8.14).
 */
export default function SendPinRoute() {
  const router = useRouter();

  return (
    <PinScreen
      mode="gate"
      onBack={() => router.back()}
      onComplete={() => router.replace('/send/sending')}
    />
  );
}
