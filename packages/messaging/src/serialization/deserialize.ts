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

function deserializeValue({
  type,
  value,
}: DeserializableValue): SerializableValue {
  switch (type) {
    case 'Big':
      return new Big(value);
    case 'BN':
      return new BN(value);
    case 'BigNumber':
    case 'BigInt':
      return BigInt(value);
    case 'Buffer':
      return Buffer.from(value);
    case 'Uint8Array':
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
    Object.keys(obj).length === 2
  );
}
