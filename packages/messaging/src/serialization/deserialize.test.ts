import Big from 'big.js';
import BN from 'bn.js';
import { ExtensionRequest } from '../../../service-worker/src/connections/extensionConnection/models';
import { DeserializableValue, deserializeFromJSON } from './deserialize';
import { SerializableValue } from './serialize';

describe('deserialize', () => {
  const requestDefaults = {
    id: 'id',
    method: ExtensionRequest.ACTION_GET, // doesn't matter for the test
  };
  const bigString =
    '10000000000000000000000000000000000000000000000000000000000000';
  const buffer = Buffer.from('This is a text');
  const serializableValues: [
    value: SerializableValue,
    serializedValue: DeserializableValue,
  ][] = [
    [new Big(bigString), { type: 'Big', value: bigString }],
    [new BN(bigString), { type: 'BN', value: bigString }],
    [BigInt(bigString), { type: 'BigInt', value: bigString }],
    [buffer, { type: 'Buffer', value: Array.from(buffer) }],
  ];

  // Primitives
  serializableValues.forEach(([value, serializedValue]) => {
    it(`updates the result when it's a ${serializedValue.type}`, () => {
      const request = {
        ...requestDefaults,
        params: serializedValue,
      };

      const deserializedRequestJSON = deserializeFromJSON(
        JSON.stringify(request),
      );

      expect(deserializedRequestJSON).toEqual({ ...request, params: value });
    });
  });

  // Object/Array
  serializableValues.forEach(([value, serializedValue]) => {
    it(`updates the object when there's a nested ${serializedValue.type}`, () => {
      const params = {
        v1: serializedValue,
        nested: {
          v2: serializedValue,
          extraNested: {
            v3: serializedValue,
          },
        },
        // extra stuff as a control
        text: 'foo',
        number: 1,
        bool: true,
      };
      const expectedParams = {
        v1: value,
        nested: {
          v2: value,
          extraNested: {
            v3: value,
          },
        },
        text: 'foo',
        number: 1,
        bool: true,
      };

      const request = {
        ...requestDefaults,
        params,
      };

      const deserializedRequestJSON = deserializeFromJSON(
        JSON.stringify(request),
      );

      expect(deserializedRequestJSON).toEqual({
        ...request,
        params: expectedParams,
      });
    });

    it(`updates the array when there's a nested ${serializedValue.type}`, () => {
      const params = [
        serializedValue,
        [serializedValue, 'foo', 1, true],
        {
          v1: serializedValue,
          nested: { v2: serializedValue },
        },
        // extra stuff as a control
        'foo',
        1,
        true,
      ];
      const expectedParams = [
        value,
        [value, 'foo', 1, true],
        {
          v1: value,
          nested: { v2: value },
        },
        'foo',
        1,
        true,
      ];

      const request = {
        ...requestDefaults,
        params,
      };

      const deserializedRequestJSON = deserializeFromJSON(
        JSON.stringify(request),
      );

      expect(deserializedRequestJSON).toEqual({
        ...request,
        params: expectedParams,
      });
    });
  });
});
