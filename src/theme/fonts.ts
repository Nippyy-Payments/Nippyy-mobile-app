import { fontFamily } from './tokens';

/**
 * The two families the design fixes: Montserrat for display and headings,
 * Space Grotesk for UI text and every monetary figure.
 *
 * Loaded as real static TTFs rather than the source's Google Fonts CSS
 * `@import`, so they resolve identically on iOS, Android and web. Nothing
 * ever falls back to the system font — the splash is held until these load.
 *
 * Imported by exact file rather than from the package root on purpose: the
 * package index re-exports every weight, so a named import from it drags all
 * 23 faces (~6MB, italics included) into the bundle. These seven are the only
 * ones the design uses.
 *
 * The source CSS also requests Montserrat 800; nothing in the design uses it.
 * No italic appears anywhere in the design, and Space Grotesk ships none —
 * never synthesise one.
 *
 * Keys must match `fontFamily` in tokens.ts, which is what every type role
 * names.
 */
export const fontMap = {
  [fontFamily.displayMedium]: require('@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.ttf'),
  [fontFamily.displaySemiBold]: require('@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf'),
  [fontFamily.displayBold]: require('@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf'),
  [fontFamily.sansRegular]: require('@expo-google-fonts/space-grotesk/400Regular/SpaceGrotesk_400Regular.ttf'),
  [fontFamily.sansMedium]: require('@expo-google-fonts/space-grotesk/500Medium/SpaceGrotesk_500Medium.ttf'),
  [fontFamily.sansSemiBold]: require('@expo-google-fonts/space-grotesk/600SemiBold/SpaceGrotesk_600SemiBold.ttf'),
  [fontFamily.sansBold]: require('@expo-google-fonts/space-grotesk/700Bold/SpaceGrotesk_700Bold.ttf'),
} as const;
