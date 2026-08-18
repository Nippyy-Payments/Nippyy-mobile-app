import type { ReactNode } from 'react';
import { Circle, Path, Rect } from 'react-native-svg';

/**
 * The app's icon set, ported from the design's inline SVG.
 *
 * The source substitutes Lucide at a 2px rounded stroke on a 24x24 box; the
 * design system records this as a substitution, to be swapped for nippyy's
 * own set if one exists.
 *
 * Two porting notes:
 *
 *  - react-native-svg has no `currentColor`, so a renderer takes the resolved
 *    colour. Stroke icons leave their elements bare and inherit stroke, fill
 *    and joins from the wrapping `G` in `Icon`; only genuinely filled shapes
 *    set their own props, which is why every renderer receives the colour.
 *  - Path data is transcribed verbatim from the source. Do not "tidy" it.
 */
export type IconRenderer = (color: string) => ReactNode;

export const icons = {
  /* --- actions ------------------------------------------------------ */
  send: () => (
    <>
      <Path d="M22 2L11 13" />
      <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>
  ),
  plus: () => <Path d="M12 5v14M5 12h14" />,
  minus: () => <Path d="M5 12h14" />,
  edit: () => (
    <>
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
    </>
  ),
  copy: () => (
    <>
      <Rect x="9" y="9" width="11" height="11" rx="2" />
      <Path d="M5 15V5a2 2 0 012-2h10" />
    </>
  ),
  trash: () => (
    <>
      <Path d="M9 4h6l1 3H8l1-3z" />
      <Path d="M5 7h14l-1 13H6L5 7z" />
    </>
  ),
  swap: () => <Path d="M7 4v16M7 20l-3-3M7 4l3 3M17 20V4M17 4l3 3M17 20l-3-3" />,
  convert: () => (
    <>
      <Path d="M17 1l4 4-4 4" />
      <Path d="M3 11V9a4 4 0 014-4h14" />
      <Path d="M7 23l-4-4 4-4" />
      <Path d="M21 13v2a4 4 0 01-4 4H3" />
    </>
  ),
  share: () => (
    <>
      <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <Path d="M16 6l-4-4-4 4M12 2v13" />
    </>
  ),
  search: () => (
    <>
      <Circle cx="11" cy="11" r="7" />
      <Path d="M20 20l-4.5-4.5" />
    </>
  ),

  /* --- navigation & affordances -------------------------------------- */
  arrowLeft: () => <Path d="M19 12H5M12 19l-7-7 7-7" />,
  chevronRight: () => <Path d="M9 18l6-6-6-6" />,
  chevronDown: () => <Path d="M6 9l6 6 6-6" />,
  external: () => (
    <>
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <Path d="M15 3h6v6" />
      <Path d="M10 14L21 3" />
    </>
  ),
  checkMark: () => <Path d="M20 6L9 17l-5-5" />,
  backspace: () => (
    <>
      <Path d="M21 5H9l-6 7 6 7h12a2 2 0 002-2V7a2 2 0 00-2-2z" />
      <Path d="M16 9l-5 6M11 9l5 6" />
    </>
  ),
  down: () => <Path d="M12 5v14M5 12l7 7 7-7" />,

  /* --- money & finance ----------------------------------------------- */
  bill: () => (
    <>
      <Path d="M9 8h6M9 12h6M9 16h4" />
      <Path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    </>
  ),
  card: () => (
    <>
      <Rect x="3" y="5" width="18" height="14" rx="2" />
      <Path d="M3 10h18" />
    </>
  ),
  bank: () => (
    <>
      <Path d="M3 10l9-6 9 6" />
      <Path d="M5 10v10h14V10" />
      <Path d="M9 20v-6h6v6" />
    </>
  ),
  coin: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M15 9.5A3 3 0 0012 8h-.5a2.5 2.5 0 000 5h1a2.5 2.5 0 010 5H12a3 3 0 01-3-1.5" />
      <Path d="M12 6v12" />
    </>
  ),
  rate: () => (
    <>
      <Path d="M3 17l6-6 4 4 8-8" />
      <Path d="M21 3h-6M21 3v6" />
    </>
  ),
  chart: () => <Path d="M4 20h4V10H4zM10 20h4V4h-4zM16 20h4v-7h-4z" />,

  /* --- status & feedback ---------------------------------------------- */
  check: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M8.5 12l2.3 2.3 4.7-4.8" />
    </>
  ),
  plusCirc: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 8v8M8 12h8" />
    </>
  ),
  warn: () => (
    <>
      <Path d="M12 9v4M12 17h.01" />
      <Path d="M10.3 3.9L2.6 17.3A1.9 1.9 0 004.3 20h15.4a1.9 1.9 0 001.7-2.7L13.7 3.9a1.9 1.9 0 00-3.4 0z" />
    </>
  ),
  info: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 8v.01M11 12h1v4h1" />
    </>
  ),
  clock: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 8v4l2.5 1.5" />
    </>
  ),
  bell: () => (
    <>
      <Path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.7 21a2 2 0 01-3.4 0" />
    </>
  ),

  /* --- security -------------------------------------------------------- */
  shield: () => (
    <>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <Path d="M9 12l2 2 4-4" />
    </>
  ),
  lock: () => (
    <>
      <Rect x="3" y="11" width="18" height="11" rx="2" />
      <Path d="M7 11V7a5 5 0 0110 0v4" />
    </>
  ),
  faceid: () => (
    <>
      <Path d="M7 3H5a2 2 0 00-2 2v2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M3 17v2a2 2 0 002 2h2" />
      <Circle cx="12" cy="11" r="3" />
      <Path d="M8.5 16a4 4 0 017 0" />
    </>
  ),
  eye: () => (
    <>
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <Circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: () => (
    <>
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <Circle cx="12" cy="12" r="3" />
      <Path d="M3 21L21 3" />
    </>
  ),
  device: () => (
    <>
      <Rect x="5" y="2" width="14" height="20" rx="2" />
      <Path d="M12 18h.01" />
    </>
  ),

  /* --- people, support & content --------------------------------------- */
  people: () => (
    <>
      <Circle cx="9" cy="8" r="3.4" />
      <Path d="M2.6 20a6.4 6.4 0 0112.8 0" />
      <Path d="M16 5.4a3.4 3.4 0 010 6.4" />
    </>
  ),
  help: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M9.1 9a3 3 0 015.8 1c0 2-3 2.2-3 4" />
      <Path d="M12 18h.01" />
    </>
  ),
  doc: () => (
    <>
      <Rect x="4" y="3" width="16" height="18" rx="2" />
      <Path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  chat: () => (
    <Path d="M21 11.5a8.4 8.4 0 01-9 8.4 9.3 9.3 0 01-3.3-.6L3 21l1.8-4.9A8.4 8.4 0 0112 3a8.4 8.4 0 019 8.5z" />
  ),
  mail: () => (
    <>
      <Rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <Path d="M3 7l9 6 9-6" />
    </>
  ),
  headset: () => (
    <>
      <Path d="M4 15v-3a8 8 0 0116 0v3" />
      <Path d="M4 15a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 15a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" />
    </>
  ),
  globe: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18" />
    </>
  ),
  moon: () => <Path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,

  /* --- tab bar ---------------------------------------------------------- */
  tabHome: () => (
    <>
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <Path d="M9 22V12h6v10" />
    </>
  ),
  tabWallets: () => (
    <>
      <Path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <Path d="M3 5v14a2 2 0 002 2h16v-5" />
      <Path d="M18 12a2 2 0 000 4h4v-4z" />
    </>
  ),
  tabHistory: () => (
    <>
      <Path d="M3 3v5h5" />
      <Path d="M3.05 13A9 9 0 106 5.3L3 8" />
      <Path d="M12 7v5l4 2" />
    </>
  ),
  tabAccount: () => (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21v-1a7 7 0 0114 0v1" />
    </>
  ),

  /* --- bill categories --------------------------------------------------- */
  billAirtime: () => (
    <>
      <Rect x="7" y="2" width="10" height="20" rx="2.5" />
      <Path d="M11 18h2" />
    </>
  ),
  billPower: () => <Path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />,
  billTv: () => (
    <>
      <Rect x="2" y="7" width="20" height="13" rx="2" />
      <Path d="M8 3l4 4 4-4" />
    </>
  ),
  billNet: (c) => (
    <>
      <Path d="M5 13a10 10 0 0114 0M8.5 16.5a5 5 0 017 0M2 9.5a15 15 0 0120 0" />
      <Circle cx="12" cy="20" r="1" fill={c} stroke="none" />
    </>
  ),
  billWater: () => <Path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  billSchool: () => (
    <>
      <Path d="M22 9L12 4 2 9l10 5 10-5z" />
      <Path d="M6 11v5a6 3 0 0012 0v-5" />
    </>
  ),

  /* --- social: solid marks, not strokes ----------------------------------- */
  twitter: (c) => (
    <Path
      fill={c}
      stroke="none"
      d="M18.9 2.6h3.4l-7.4 8.5L23 21.4h-6.8l-5.3-6.9-6.1 6.9H1.4l7.9-9L1.2 2.6H8l5 6.5 5.9-6.5zm-1.2 16.8h1.9L6.5 4.5H4.5l13.2 14.9z"
    />
  ),
  instagram: (c) => (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="5" />
      <Circle cx="12" cy="12" r="4" />
      <Circle cx="17.2" cy="6.8" r="1.2" fill={c} stroke="none" />
    </>
  ),
  facebook: (c) => (
    <Path
      fill={c}
      stroke="none"
      d="M13.5 21v-8h2.8l.4-3.2h-3.2V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3V13h2.8v8h3.4z"
    />
  ),
  linkedin: (c) => (
    <Path
      fill={c}
      stroke="none"
      d="M6.9 8.6H3.6V21h3.3V8.6zM5.2 3a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM21 14c0-3.4-1.8-5.7-4.6-5.7-1.5 0-2.6.8-3 1.6h-.1V8.6H10V21h3.3v-6.4c0-1.7.5-2.8 2-2.8s2 1.3 2 2.9V21H21v-7z"
    />
  ),
} satisfies Record<string, IconRenderer>;

export type IconName = keyof typeof icons;
