// React 19 only enables act() support when a test environment opts in. Without
// this, any state update from an async handler warns even though it is awaited.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;


// Fonts are real files at runtime; in tests they only need to resolve.
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
