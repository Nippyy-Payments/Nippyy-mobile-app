import { fontMap } from '@/theme/fonts';
import {
  darkColors,
  fontFamily,
  lightColors,
  shadows,
  typography,
  type ColorTokens,
} from '@/theme/tokens';
import { textStyles, typeRoles } from '@/theme/typography';

/** Every leaf key path in a nested token object. */
function paths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  if (Array.isArray(value)) return value.flatMap((v, i) => paths(v, `${prefix}[${i}]`));
  return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
}

describe('colour tokens', () => {
  it('restates every alias in dark, so no alias silently keeps a light value', () => {
    // A CSS alias resolves at its declaration site: re-pointing a scale does
    // not move the aliases built on it. Both themes must have the same shape.
    expect(paths(darkColors)).toEqual(paths(lightColors));
  });

  it('actually differs from light where the design says it should', () => {
    expect(darkColors.surface.page).not.toBe(lightColors.surface.page);
    expect(darkColors.text.strong).not.toBe(lightColors.text.strong);
    expect(darkColors.border.subtle).not.toBe(lightColors.border.subtle);
  });

  it('keeps money-out as ink rather than red — sending is not an error', () => {
    expect(lightColors.money.out).toBe(lightColors.text.strong);
    expect(lightColors.money.out).not.toBe(lightColors.status.danger);
  });

  it('uses the light 400 steps for small indicators', () => {
    // At 6-8px a 500-weight fill reads almost black, which is why these exist.
    expect(lightColors.indicator.success).not.toBe(lightColors.status.success);
  });

  it('resolves every colour to a concrete value', () => {
    for (const theme of [lightColors, darkColors] as ColorTokens[]) {
      for (const value of paths(theme).map((p) =>
        p.split(/[.[\]]/).filter(Boolean).reduce<any>((acc, k) => acc[k], theme)
      )) {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^(#[0-9A-Fa-f]{6}|rgba?\()/);
      }
    }
  });
});

describe('type scale', () => {
  it('resolves em tracking and unitless leading to absolute px', () => {
    for (const [name, style] of Object.entries(textStyles)) {
      expect(typeof style.fontSize).toBe('number');
      expect(typeof style.lineHeight).toBe('number');
      expect(typeof style.letterSpacing).toBe('number');
      expect(style.lineHeight!).toBeGreaterThanOrEqual(style.fontSize!);
      expect(name && style.fontFamily).toBeTruthy();
    }
  });

  it('names a font family per weight instead of a numeric weight', () => {
    // Static font files cannot be synthetically weighted without smearing.
    for (const style of Object.values(textStyles)) {
      expect(style.fontWeight).toBeUndefined();
      expect(Object.values(fontFamily)).toContain(style.fontFamily);
    }
  });

  it('loads exactly the families the roles reference', () => {
    const loaded = new Set(Object.keys(fontMap));
    for (const style of Object.values(textStyles)) {
      expect(loaded.has(style.fontFamily as string)).toBe(true);
    }
  });

  it('covers every role declared in tokens', () => {
    const flat = paths(typography).map((p) => p.replace(/\.(fontFamily|fontSize|lineHeight|letterSpacing)$/, ''));
    expect(new Set(flat).size).toBe(Object.keys(typeRoles).length);
  });
});

describe('shadows', () => {
  it('keeps elevation off by default — separation comes from tone and hairlines', () => {
    expect(shadows.none.android.elevation).toBe(0);
    expect(shadows.none.ios.shadowOpacity).toBe(0);
    expect(shadows.none.web.boxShadow).toBe('none');
  });

  it('carries per-platform values for every step', () => {
    for (const token of Object.values(shadows)) {
      expect(token.ios).toBeDefined();
      expect(token.android).toBeDefined();
      expect(token.web).toBeDefined();
    }
  });
});
