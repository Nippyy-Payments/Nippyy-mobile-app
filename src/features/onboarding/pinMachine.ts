export const PIN_LENGTH = 4;

export type PinMode = 'create' | 'gate';

export type PinPhase = 'entry' | 'confirm';

export type PinState = {
  phase: PinPhase;
  /** What was entered on the first pass, while confirming. */
  firstEntry: string;
  mismatch: boolean;
};

export type PinOutcome =
  | { type: 'continue'; state: PinState }
  | { type: 'complete'; pin: string };

export const initialPinState: PinState = {
  phase: 'entry',
  firstEntry: '',
  mismatch: false,
};

/** Applies one keypad press to the entered digits. */
export function applyPinKey(current: string, key: string): string {
  if (key === 'back') return current.slice(0, -1);
  return (current + key).slice(0, PIN_LENGTH);
}

/**
 * Decides what happens once four digits are in.
 *
 * Kept as a pure function rather than living inside the screen's effects:
 * the two-pass confirmation is the part with real rules — a mismatch must
 * never be accepted — and those rules are worth testing directly, without a
 * renderer, timers or a keypad in the way.
 */
export function settlePin(state: PinState, value: string, mode: PinMode): PinOutcome {
  if (mode === 'gate') {
    return { type: 'complete', pin: value };
  }

  if (state.phase === 'entry') {
    return {
      type: 'continue',
      state: { phase: 'confirm', firstEntry: value, mismatch: false },
    };
  }

  if (value === state.firstEntry) {
    return { type: 'complete', pin: value };
  }

  // Start over rather than completing with a PIN the user did not mean.
  return {
    type: 'continue',
    state: { phase: 'entry', firstEntry: '', mismatch: true },
  };
}

/** The heading and sub-copy for the current step. */
export function pinCopy(state: PinState, mode: PinMode): { title: string; body: string } {
  if (mode === 'gate') {
    return {
      title: 'Enter your PIN',
      body: 'Four digits to confirm this transfer.',
    };
  }

  if (state.phase === 'confirm') {
    return {
      title: 'Confirm your PIN',
      body: 'Type it once more so we know it stuck.',
    };
  }

  return {
    title: 'Create a PIN',
    body: 'Four digits. You will use it to confirm every transfer.',
  };
}
