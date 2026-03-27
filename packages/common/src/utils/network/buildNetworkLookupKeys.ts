/**
 * History and RPC payloads may use decimal chain IDs, hex (e.g. 0x2105 → 8453), or CAIP-2.
 * Produces keys suitable for `getNetwork` (numeric chainId, string decimal, eip155:…).
 */
export function buildNetworkLookupKeys(
  chainId: string | number,
): Array<number | string> {
  const trimmedChainId = String(chainId ?? '').trim();
  if (trimmedChainId.length === 0) {
    return [];
  }

  const keys: Array<number | string> = [];
  const seen = new Set<string>();

  const push = (key: number | string) => {
    const isNumber = typeof key === 'number';

    if (isNumber && Number.isNaN(key)) {
      return;
    }

    const marker = isNumber ? `n:${key}` : `s:${key}`;
    if (seen.has(marker)) {
      return;
    }
    seen.add(marker);
    keys.push(key);
  };

  push(trimmedChainId);

  if (trimmedChainId.startsWith('eip155:')) {
    const [, eip155NumericPart] = trimmedChainId.split('eip155:');
    const parsedFromEip155 = Number.parseInt(eip155NumericPart ?? '', 10);
    push(parsedFromEip155);
    return keys;
  }

  if (/^0x[0-9a-fA-F]+$/i.test(trimmedChainId)) {
    const parsedFromHex = Number.parseInt(trimmedChainId, 16);
    push(parsedFromHex);
    push(`eip155:${parsedFromHex}`);
    return keys;
  }

  if (/^\d+$/.test(trimmedChainId)) {
    const parsedFromDecimal = Number.parseInt(trimmedChainId, 10);
    push(parsedFromDecimal);
    push(`eip155:${parsedFromDecimal}`);
  }

  return keys;
}
