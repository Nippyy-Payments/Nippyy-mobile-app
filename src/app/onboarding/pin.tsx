import { useRouter } from 'expo-router';

import { PinScreen } from '@/features/onboarding/PinScreen';

export default function CreatePinRoute() {
  const router = useRouter();

  return (
    <PinScreen
      mode="create"
      onBack={() => router.back()}
      onComplete={() => router.replace('/onboarding/verify')}
    />
  );
}
