/** E2E coverage: matching constants (see ../e2e-testid-coverage.mjs). */
/** Feature folder names that are too generic to match from spec text (false positives). */
export const AMBIGUOUS_FEATURE_DIRS = new Set([
  'Error',
  'Banner',
  'Button',
  'Carousel',
  'CommonTable',
  'CopyButton',
  'CoreLogoLink',
  'Loading',
]);

/** Tokens shared by many folder names — do not use alone to match a feature (e.g. "Landing Page" → \bpage\b). */
export const GENERIC_FEATURE_TOKENS = new Set([
  'page',
  'tab',
  'tabs',
  'header',
  'grid',
  'list',
  'card',
  'row',
  'form',
  'button',
  'link',
  'table',
  'dialog',
  'modal',
  'drawer',
  'menu',
  'bar',
  'panel',
  'item',
  'cell',
  'icon',
  'layout',
  'content',
  'section',
]);
