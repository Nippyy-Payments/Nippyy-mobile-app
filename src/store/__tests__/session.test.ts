import { useSessionStore } from '@/store/session';

const reset = () =>
  useSessionStore.setState({
    theme: 'light',
    balanceHidden: false,
    biometricsEnabled: false,
    hasHydrated: true,
  });

describe('session store', () => {
  beforeEach(reset);

  it('defaults to the light, white-paper surface', () => {
    expect(useSessionStore.getState().theme).toBe('light');
  });

  it('toggles the theme without consulting the OS', () => {
    useSessionStore.getState().toggleTheme();
    expect(useSessionStore.getState().theme).toBe('dark');
    useSessionStore.getState().toggleTheme();
    expect(useSessionStore.getState().theme).toBe('light');
  });

  it('holds balance masking globally, not per screen', () => {
    useSessionStore.getState().toggleBalanceHidden();
    expect(useSessionStore.getState().balanceHidden).toBe(true);
  });

  it('never persists the hydration flag', () => {
    // hasHydrated is runtime-only; writing it would make a cold start claim
    // it had already read from disk.
    const persisted = Object.keys(
      useSessionStore.persist.getOptions().partialize!(useSessionStore.getState()) as object
    );
    expect(persisted).not.toContain('hasHydrated');
    expect(persisted.sort()).toEqual(['balanceHidden', 'biometricsEnabled', 'theme']);
  });

  it('keeps biometrics opt-in', () => {
    expect(useSessionStore.getState().biometricsEnabled).toBe(false);
    useSessionStore.getState().setBiometricsEnabled(true);
    expect(useSessionStore.getState().biometricsEnabled).toBe(true);
  });
});
