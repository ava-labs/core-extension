import Big from 'big.js';
import BN from 'bn.js';
import { SerializableValue } from './serialize';

export type DeserializableValue =
  | {
      type: 'Big' | 'BigNumber' | 'BN' | 'BigInt';
      value: string;
    }
  | {
      type: 'Buffer' | 'Uint8Array';
      value: number[];
    };

/**
 * Deserialize complex numbers like `Big`, `BN`, etc. back to their original
 * form after they were serialized with `serializeToJSON`.
 *
 * For example, `{ type: 'BN', value: '100_000_000_000' }` is converted to
 * `new BN(100_000_000_000)`
 */
export function deserializeFromJSON<T>(value?: string): T | undefined {
  if (value === undefined) {
    return value;
  }

  return JSON.parse(value, function (_, element) {
    if (isDeserializable(element)) {
      return deserializeValue(element);
    }

    return element;
  });
}

const VALID_TYPES = new Set<string>([
  'Big',
  'BigNumber',
  'BN',
  'BigInt',
  'Buffer',
  'Uint8Array',
]);
const MAX_NUMERIC_STRING_LENGTH = 1_000;
const MAX_ARRAY_LENGTH = 100_000;

function deserializeValue({
  type,
  value,
}: DeserializableValue): SerializableValue {
  switch (type) {
    case 'Big':
      if (typeof value === 'string' && value.length > MAX_NUMERIC_STRING_LENGTH)
        throw new Error('value too large');
      return new Big(value);
    case 'BN':
      if (typeof value === 'string' && value.length > MAX_NUMERIC_STRING_LENGTH)
        throw new Error('value too large');
      return new BN(value);
    case 'BigNumber':
    case 'BigInt':
      if (typeof value === 'string' && value.length > MAX_NUMERIC_STRING_LENGTH)
        throw new Error('value too large');
      return BigInt(value);
    case 'Buffer':
      if (Array.isArray(value) && value.length > MAX_ARRAY_LENGTH)
        throw new Error('value too large');
      return Buffer.from(value);
    case 'Uint8Array':
      if (Array.isArray(value) && value.length > MAX_ARRAY_LENGTH)
        throw new Error('value too large');
      return Uint8Array.from(value);
    default:
      throw new Error('unhandled serialization');
  }
}

function isDeserializable(obj: unknown): obj is DeserializableValue {
  return (
    typeof obj === 'object' &&
    obj != null &&
    'type' in obj &&
    'value' in obj &&
    Object.keys(obj).length === 2 &&
    VALID_TYPES.has((obj as { type: string }).type)
  );
}
