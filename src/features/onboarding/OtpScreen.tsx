import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/core/Button';
import { Keypad } from '@/components/forms/Keypad';
import { OtpField } from '@/components/forms/OtpField';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { ScreenTitle } from '@/components/core/ScreenTitle';
import { useTheme } from '@/theme/ThemeProvider';

const CODE_LENGTH = 6;

export function OtpScreen() {
  const router = useRouter();
  const { spacing, spacingRaw } = useTheme().theme;

  const [code, setCode] = useState('471');
  const complete = code.length === CODE_LENGTH;

  return (
    <Screen scroll={false} header={<ScreenHeader />}>
      <ScreenTitle subhead="Sent to +234 803 114 2208.">Enter your code</ScreenTitle>

      <OtpField
        value={code}
        length={CODE_LENGTH}
        style={{ marginTop: spacingRaw.sectionGapMd }}
        testID="otp"
      />

      {/* The countdown itself is deferred — see NOT_DONE_YET.md §2. */}
      <Button variant="ghost" size="sm" style={{ alignSelf: 'center', marginTop: spacing.xl }}>
        Resend in 0:24
      </Button>

      <View style={{ flex: 1, minHeight: spacing.lg }} />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!complete}
        onPress={() => router.push('/onboarding/pin')}
      >
        {complete ? 'Confirm' : `Enter ${CODE_LENGTH} digits`}
      </Button>

      <Keypad
        decimal={false}
        style={{ marginTop: spacing.lg }}
        onKey={(key) =>
          setCode((current) =>
            key === 'back' ? current.slice(0, -1) : (current + key).slice(0, CODE_LENGTH)
          )
        }
      />
    </Screen>
  );
}
