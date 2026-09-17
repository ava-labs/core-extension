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
  const assertSafeNumericString: (v: unknown) => asserts v is string = (v) => {
    if (typeof v !== 'string' || v.length > MAX_NUMERIC_STRING_LENGTH) {
      throw new Error('value too large');
    }
  };
  const assertBoundedArray: (v: unknown) => asserts v is number[] = (v) => {
    if (!Array.isArray(v) || v.length > MAX_ARRAY_LENGTH) {
      throw new Error('value too large');
    }
  };

  switch (type) {
    case 'Big':
      assertSafeNumericString(value);
      return new Big(value);
    case 'BN':
      assertSafeNumericString(value);
      return new BN(value);
    case 'BigNumber':
    case 'BigInt':
      assertSafeNumericString(value);
      return BigInt(value);
    case 'Buffer':
      assertBoundedArray(value);
      return Buffer.from(value);
    case 'Uint8Array':
      assertBoundedArray(value);
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
