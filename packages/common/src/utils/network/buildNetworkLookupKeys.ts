/**
 * History and RPC payloads may use decimal chain IDs, hex (e.g. 0x2105 → 8453), or CAIP-2.
 * Produces keys suitable for `getNetwork` (numeric chainId, string decimal, eip155:…).
 */
export function buildNetworkLookupKeys(
  chainId: string | number,
): Array<number | string> {
  const t = String(chainId ?? '').trim();
  if (t.length === 0) {
    return [];
  }

  const keys: Array<number | string> = [];
  const seen = new Set<string>();

  const push = (key: number | string) => {
    const marker = typeof key === 'number' ? `n:${key}` : `s:${key}`;
    if (seen.has(marker)) {
      return;
    }
    seen.add(marker);
    keys.push(key);
  };

  push(t);

  if (t.startsWith('eip155:')) {
    const suffix = t.slice('eip155:'.length);
    const n = Number.parseInt(suffix, 10);
    if (!Number.isNaN(n)) {
      push(n);
    }
    return keys;
  }

  if (/^0x[0-9a-fA-F]+$/i.test(t)) {
    const n = Number.parseInt(t, 16);
    if (!Number.isNaN(n)) {
      push(n);
      push(`eip155:${n}`);
    }
    return keys;
  }

  if (/^\d+$/.test(t)) {
    const n = Number.parseInt(t, 10);
    if (!Number.isNaN(n)) {
      push(n);
      push(`eip155:${n}`);
    }
  }

  return keys;
}
