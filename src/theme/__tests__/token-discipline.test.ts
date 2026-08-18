import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * The rule the whole port rests on: every colour traces to a token.
 *
 * Asserted against the source tree rather than trusted, because a single
 * hardcoded hex is invisible in review and breaks dark mode silently.
 */

const SRC = join(__dirname, '..', '..');

/** Where raw values legitimately live. */
const ALLOWED = [
  join('theme', 'tokens.ts'),
  // Fixtures describe data, not styling.
  join('lib', 'api', 'client.ts'),
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(SRC).filter(
  (file) =>
    /\.tsx?$/.test(file) &&
    !file.includes('__tests__') &&
    !file.includes(`${sep}test${sep}`) &&
    !ALLOWED.some((allowed) => file.endsWith(allowed))
);

const rel = (file: string) => relative(SRC, file).split(sep).join('/');

describe('token discipline', () => {
  it('has no hardcoded hex colours outside the token file', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      source.split('\n').forEach((line, index) => {
        // SVG path data legitimately contains letters and digits, never a #.
        const match = line.match(/#[0-9A-Fa-f]{3,8}\b/);
        if (match) offenders.push(`${rel(file)}:${index + 1} ${match[0]}`);
      });
    }

    expect(offenders).toEqual([]);
  });

  it('has no hardcoded rgb/rgba colours outside the token file', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      source.split('\n').forEach((line, index) => {
        const match = line.match(/rgba?\(/);
        if (match) offenders.push(`${rel(file)}:${index + 1}`);
      });
    }

    expect(offenders).toEqual([]);
  });

  it('never reaches into the raw colour scales from a component', () => {
    // Components use semantic aliases; the scales are private to tokens.ts.
    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      if (/\b(blue|ink|gray|green|amber|red)\[\d+\]/.test(source)) offenders.push(rel(file));
    }

    expect(offenders).toEqual([]);
  });

  it('sets no shadow props at a call site', () => {
    // Shadows go through shadow(), which resolves per platform.
    const offenders: string[] = [];

    for (const file of files) {
      if (file.endsWith(join('theme', 'shadows.ts'))) continue;
      const source = readFileSync(file, 'utf8');
      const match = source.match(/\b(shadowOffset|shadowOpacity|shadowRadius|elevation)\s*:/);
      if (match) offenders.push(`${rel(file)} ${match[1]}`);
    }

    expect(offenders).toEqual([]);
  });
});
