/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig resolves Astro's `astro:*` virtual modules, so tests can import
// project code freely even though the unit-tested logic in src/lib avoids them.
export default getViteConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      // Only the pure logic in src/lib is unit tested. `.astro` templates and
      // page entry points are exercised by `astro check` + `astro build`, not
      // by Vitest, so they are excluded from the coverage gate.
      include: ['src/lib/**/*.ts'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
