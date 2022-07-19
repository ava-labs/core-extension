import Big from 'big.js';
import BN from 'bn.js';
import { BigNumber } from 'ethers';
import { cloneDeep } from 'lodash';
import { DeserializableValue } from './deserialize';

export type SerializableValue = Big | BigNumber | bigint | BN;

/**
 * Prepare data for JSON serialization by converting complex numbers like `Big`,
 * `BN`, etc. into a format that can be auto-deserialized with
 * `deserialize`.
 *
 * For example, `new BN(100_000_000_000)` is converted to
 * `{ type: 'BN', value: '100_000_000_000' }`
 */
export function serialize<T>(value: T): T {
  if (!value) return value;
  value = cloneDeep(value);

  if (isSerializable(value)) {
    return serializeValue(value) as any;
  }

  serializeObject(value);
  return value;
}

function serializeValue(value: SerializableValue): DeserializableValue {
  if (value instanceof Big) {
    return { type: 'Big', value: value.toFixed() };
  } else if (value instanceof BigNumber) {
    return { type: 'BigNumber', value: value.toString() };
  } else if (value instanceof BN) {
    return { type: 'BN', value: value.toString() };
  } else if (typeof value === 'bigint') {
    return { type: 'BigInt', value: value.toString() };
  } else {
    throw new Error('unhandled serialization');
  }
}

// Mutates the object/array for performance
function serializeObject(obj: unknown): void {
  if (obj === null) return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (isSerializable(item)) {
        // change in place
        obj[i] = serializeValue(item);
      } else if (typeof item === 'object') {
        // or mutate the object/array
        serializeObject(item);
      }
    }
  } else if (typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const item = obj[k];
      if (isSerializable(item)) {
        // change in place
        obj[k] = serializeValue(item);
      } else if (typeof item === 'object') {
        // or mutate the object/array
        serializeObject(item);
      }
    }
  }
}

function isSerializable(value: unknown): value is SerializableValue {
  return (
    value instanceof Big ||
    value instanceof BigNumber ||
    value instanceof BN ||
    typeof value === 'bigint'
  );
}
