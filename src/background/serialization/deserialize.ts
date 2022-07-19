import Big from 'big.js';
import BN from 'bn.js';
import { BigNumber } from 'ethers';
import { cloneDeep } from 'lodash';
import { SerializableValue } from './serialize';

export type DeserializableValue = {
  type: 'Big' | 'BigNumber' | 'BN' | 'BigInt';
  value: string;
};

/**
 * Deserialize complex numbers like `Big`, `BN`, etc. back to their original
 * form after they were serialized with `serialize`.
 *
 * For example, `{ type: 'BN', value: '100_000_000_000' }` is converted to
 * `new BN(100_000_000_000)`
 */
export function deserialize<T>(value: T): T {
  if (!value) return value;
  value = cloneDeep(value);

  if (isDeserializable(value)) {
    return deserializeValue(value) as any;
  }

  deserializeObject(value);
  return value;
}

function deserializeValue({
  type,
  value,
}: DeserializableValue): SerializableValue {
  switch (type) {
    case 'Big':
      return new Big(value);
    case 'BigNumber':
      return BigNumber.from(value);
    case 'BN':
      return new BN(value);
    case 'BigInt':
      return BigInt(value);
    default:
      throw new Error('unhandled serialization');
  }
}

// Mutates the object/array for performance
function deserializeObject(obj: unknown): void {
  if (obj === null) return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (isDeserializable(item)) {
        // change in place
        obj[i] = deserializeValue(item);
      } else if (typeof item === 'object') {
        // or mutate the object/array
        deserializeObject(item);
      }
    }
  } else if (typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const item = obj[k];
      if (isDeserializable(item)) {
        // change in place
        obj[k] = deserializeValue(item);
      } else if (typeof item === 'object') {
        // or mutate the object/array
        deserializeObject(item);
      }
    }
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
