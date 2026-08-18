import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

import { useSessionStore } from '@/store/session';

/**
 * Biometric confirmation.
 *
 * Real, not decorative (PORTING_PLAN.md §8.13) — but only offered when the
 * user has turned it on in the security centre AND the device can actually do
 * it. Three things must all hold, and any of them failing falls back to the
 * PIN gate rather than blocking the transfer.
 */
export type BiometricOutcome = 'success' | 'unavailable' | 'failed' | 'cancelled';

export async function isBiometricAvailable(): Promise<boolean> {
  // The browser has no equivalent prompt.
  if (Platform.OS === 'web') return false;

  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);

  return hasHardware && isEnrolled;
}

/** Whether the user has opted in, independent of what the device supports. */
export function isBiometricEnabled(): boolean {
  return useSessionStore.getState().biometricsEnabled;
}

/**
 * Prompts for biometric confirmation.
 *
 * Returns `unavailable` when biometrics are off or unsupported, so the caller
 * can route to the PIN gate instead. It never throws.
 */
export async function confirmWithBiometrics(reason: string): Promise<BiometricOutcome> {
  if (!isBiometricEnabled()) return 'unavailable';
  if (!(await isBiometricAvailable())) return 'unavailable';

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      // The design offers its own PIN screen, so the OS passcode sheet would
      // be a second, competing fallback.
      disableDeviceFallback: true,
      cancelLabel: 'Use PIN instead',
    });

    if (result.success) return 'success';
    return result.error === 'user_cancel' ? 'cancelled' : 'failed';
  } catch {
    return 'unavailable';
  }
}

/**
 * The label the confirm button carries.
 *
 * The design writes "Send £200.40 with Face ID". When biometrics are off the
 * promise would be false, so the label drops the method rather than lying.
 */
export function confirmLabel(action: string, biometricsReady: boolean): string {
  return biometricsReady ? `${action} with Face ID` : action;
}
