/**
 * eth_signTypedData_v4 params must be JSON strings. Hyperliquid (and some other
 * EIP-712 payloads) carry BigInt fields that JSON.stringify rejects without a
 * replacer — convert them to decimal strings.
 */
export const serializeTypedDataPayload = (payload: unknown) =>
  JSON.stringify(payload, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
