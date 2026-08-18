/**
 * Tailwind / NativeWind theme, fed entirely from src/theme/tokens.ts.
 *
 * Colours resolve through CSS custom properties so one class works in both
 * themes; the variables themselves are generated into global.css by
 * `npm run theme:gen`. Everything else (spacing, radii, sizes, type) is read
 * straight off the tokens.
 *
 * No literal value appears in this file.
 */
import type { Config } from 'tailwindcss';
import {
  lightColors,
  spacing,
  spacingRaw,
  gutter,
  radii,
  size,
  fontFamily,
  typography,
  borderWidth,
  duration,
  layout,
} from './src/theme/tokens';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Mirrors the naming in scripts/gen-theme-css.cjs. */
function colorVars(source: typeof lightColors) {
  const out: Record<string, Record<string, string> | string> = {};
  for (const [group, value] of Object.entries(source)) {
    if (group === 'avatar') continue;
    const entries: Record<string, string> = {};
    for (const key of Object.keys(value as Record<string, string>)) {
      const varName =
        key === 'default'
          ? `--color-${kebab(group)}`
          : `--color-${kebab(group)}-${kebab(key)}`;
      entries[key === 'default' ? 'DEFAULT' : kebab(key)] = `var(${varName})`;
    }
    out[kebab(group)] = entries;
  }
  return out;
}

/** Numeric token maps become px-string scales Tailwind understands. */
const px = (input: Record<string, number>) =>
  Object.fromEntries(Object.entries(input).map(([k, v]) => [k, `${v}px`]));

const flattenSizes = () => {
  const out: Record<string, number> = { tapMin: size.tapMin, rowMin: size.rowMin };
  for (const [group, value] of Object.entries(size)) {
    if (typeof value === 'number') out[kebab(group)] = value;
    else
      for (const [k, v] of Object.entries(value as Record<string, number>))
        out[`${kebab(group)}-${kebab(k)}`] = v;
  }
  return out;
};

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: colorVars(lightColors),
      spacing: {
        ...px(spacing as unknown as Record<string, number>),
        ...px(spacingRaw as unknown as Record<string, number>),
        gutter: `${gutter.default}px`,
        'gutter-tight': `${gutter.tight}px`,
        'gutter-bills': `${gutter.bills}px`,
      },
      borderRadius: px(radii as unknown as Record<string, number>),
      borderWidth: px(borderWidth as unknown as Record<string, number>),
      fontFamily: Object.fromEntries(
        Object.entries(fontFamily).map(([k, v]) => [kebab(k), [v]])
      ),
      fontSize: Object.fromEntries(
        Object.entries(typography)
          .filter(([, v]) => typeof (v as { fontSize?: number }).fontSize === 'number')
          .map(([k, v]) => {
            const role = v as { fontSize: number; lineHeight: number; letterSpacing: number };
            return [
              kebab(k),
              [
                `${role.fontSize}px`,
                {
                  lineHeight: `${role.lineHeight}px`,
                  letterSpacing: `${role.letterSpacing}px`,
                },
              ],
            ];
          })
      ),
      width: px(flattenSizes()),
      height: px(flattenSizes()),
      minHeight: { row: `${size.rowMin}px`, tap: `${size.tapMin}px` },
      maxWidth: { app: `${layout.maxWidth}px` },
      transitionDuration: Object.fromEntries(
        Object.entries(duration).map(([k, v]) => [k, `${v}ms`])
      ),
    },
  },
  plugins: [],
} satisfies Config;
