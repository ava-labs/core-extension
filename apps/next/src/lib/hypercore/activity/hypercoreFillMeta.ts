const METHOD_PREFIX = 'hypercoreFill:v1:';

export const FILL_ARROW_UP = '\u25B2';
export const FILL_ARROW_DOWN = '\u25BC';

export type HypercoreFillMeta = {
  readonly dir: string;
  readonly px: string;
  readonly closedPnl: string;
  readonly coin: string;
};

export type FillLabel = {
  readonly text: string;
  readonly arrow?: typeof FILL_ARROW_UP | typeof FILL_ARROW_DOWN;
  readonly tone?: 'profit' | 'loss';
};

/** Display ticker with any `dex:` prefix stripped (`xyz:GOLD` → `GOLD`). */
export const tickerOfCoin = (coin: string) => {
  const i = coin.indexOf(':');
  return i === -1 ? coin : coin.slice(i + 1);
};

/** Map a fill's `dir` string into a display label */
export const fillLabel = (dir: string): FillLabel => {
  const d = dir.toLowerCase();
  if (d.includes('close') && d.includes('long')) {
    return { text: 'Long closed', arrow: FILL_ARROW_UP, tone: 'profit' };
  }
  if (d.includes('close') && d.includes('short')) {
    return { text: 'Short closed', arrow: FILL_ARROW_DOWN, tone: 'loss' };
  }
  if (d.includes('open') && (d.includes('long') || d.includes('short'))) {
    return { text: 'Order opened' };
  }
  if (d.includes('cancel')) {
    return { text: 'Order cancelled' };
  }
  return { text: dir };
};

/** Compact USD price for fill rows (`$1,684.7`). */
export const formatHypercoreFillPx = (px: string) => {
  const n = Number.parseFloat(px);
  if (!Number.isFinite(n)) {
    return px;
  }
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
};

export const encodeHypercoreFillMethod = (meta: HypercoreFillMeta) =>
  `${METHOD_PREFIX}${encodeURIComponent(JSON.stringify(meta))}`;

export const parseHypercoreFillMethod = (
  method: string | undefined,
): HypercoreFillMeta | undefined => {
  if (!method?.startsWith(METHOD_PREFIX)) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(
      decodeURIComponent(method.slice(METHOD_PREFIX.length)),
    );
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('dir' in parsed) ||
      !('px' in parsed) ||
      !('closedPnl' in parsed) ||
      !('coin' in parsed)
    ) {
      return undefined;
    }
    const { dir, px, closedPnl, coin } = parsed as Record<string, unknown>;
    if (
      typeof dir !== 'string' ||
      typeof px !== 'string' ||
      typeof closedPnl !== 'string' ||
      typeof coin !== 'string'
    ) {
      return undefined;
    }
    return { dir, px, closedPnl, coin };
  } catch {
    return undefined;
  }
};
