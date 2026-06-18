import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';

// Flat config. `prettier` is last so it disables any stylistic rules that would
// fight the formatter — ESLint judges code, Prettier owns layout.
export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'node_modules/', 'coverage/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  prettier,
);
