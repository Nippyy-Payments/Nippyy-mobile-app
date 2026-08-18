import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Repo invariants for the navigation contract.
 *
 * These rules are about how the app is wired rather than what it renders, so
 * they are asserted against the source tree. Gesture and hardware-back
 * behaviour still needs a device to confirm end to end, but the ways we could
 * silently break them — disabling the gesture, faking navigation with local
 * state, hiding the tab bar with a flag — are caught here.
 */

const SRC = join(__dirname, '..', '..');
const APP = join(SRC, 'app');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sourceFiles = walk(SRC).filter(
  (f) => /\.tsx?$/.test(f) && !f.includes('__tests__') && !f.includes(`${sep}test${sep}`)
);
const routeFiles = walk(APP).filter((f) => /\.tsx?$/.test(f) && !f.includes('__tests__'));

const read = (file: string) => readFileSync(file, 'utf8');
const rel = (file: string) => relative(SRC, file).split(sep).join('/');

describe('navigation contract', () => {
  it('never disables the swipe-back gesture', () => {
    // iOS swipe-back must work on every pushed screen.
    const offenders = sourceFiles.filter((f) => /gestureEnabled\s*:\s*false/.test(read(f)));
    expect(offenders.map(rel)).toEqual([]);
  });

  it('does not hide the tab bar with a flag', () => {
    // Full-screen flows live outside the (tabs) group, so there is no bar to
    // hide. A tabBarStyle display:none would mean the route tree is wrong.
    const offenders = sourceFiles.filter((f) =>
      /tabBarStyle[\s\S]{0,80}display\s*:\s*['"]none['"]/.test(read(f))
    );
    expect(offenders.map(rel)).toEqual([]);
  });

  it('presents the wallet picker as a modal so back and swipe dismiss it', () => {
    const rootLayout = read(join(APP, '_layout.tsx'));
    expect(rootLayout).toMatch(/name="wallet-picker"[\s\S]{0,120}presentation:\s*'modal'/);
  });

  it('keeps full-screen flows outside the tab group', () => {
    const tabRoutes = routeFiles
      .filter((f) => f.includes('(tabs)'))
      .map((f) => rel(f).replace(/^app\//, ''));

    // Only the four tabs and their layout belong in the group.
    expect(tabRoutes.sort()).toEqual(
      [
        '(tabs)/_layout.tsx',
        '(tabs)/activity.tsx',
        '(tabs)/index.tsx',
        '(tabs)/menu.tsx',
        '(tabs)/wallets.tsx',
      ].sort()
    );
  });

  it('mounts the custom tab bar only in the tab layout', () => {
    const users = sourceFiles.filter(
      (f) => /<TabBar\b/.test(read(f)) && !f.endsWith(join('navigation', 'TabBar.tsx'))
    );
    expect(users.map(rel)).toEqual(['app/(tabs)/_layout.tsx']);
  });

  it('routes every push to a file that exists', () => {
    const known = new Set(
      routeFiles
        .map((f) => rel(f).replace(/^app\//, '').replace(/\.tsx?$/, ''))
        // Route groups do not appear in the URL.
        .map((p) => p.replace(/\([^)]+\)\//g, ''))
        .map((p) => (p.endsWith('/index') ? p.slice(0, -'/index'.length) : p))
        .map((p) => (p === 'index' ? '' : p))
    );

    const missing: string[] = [];
    for (const file of sourceFiles) {
      const pushes = read(file).matchAll(/router\.(?:push|replace|navigate)\('([^']+)'\)/g);
      for (const [, href] of pushes) {
        if (!href) continue;
        const path = href.replace(/^\//, '');
        // A dynamic segment matches any concrete value in that position.
        const matched = [...known].some((route) => {
          const pattern = new RegExp(`^${route.replace(/\[[^\]]+\]/g, '[^/]+')}$`);
          return pattern.test(path);
        });
        if (!matched) missing.push(`${rel(file)} -> ${href}`);
      }
    }

    expect(missing).toEqual([]);
  });

  it('has a route file for every tab the bar renders', () => {
    const bar = read(join(SRC, 'components', 'navigation', 'TabBar.tsx'));
    const declared = [...bar.matchAll(/route:\s*'([^']+)'/g)].map(([, r]) => r);

    expect(declared).toEqual(['index', 'wallets', 'activity', 'menu']);
    for (const route of declared) {
      expect(routeFiles.some((f) => f.endsWith(join('(tabs)', `${route}.tsx`)))).toBe(true);
    }
  });
});
