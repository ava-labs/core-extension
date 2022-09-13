import Big from 'big.js';
import BN from 'bn.js';
import { BigNumber } from 'ethers';
import { ExtensionRequest } from '../connections/extensionConnection/models';
import { DeserializableValue } from './deserialize';
import { serialize, SerializableValue } from './serialize';

describe('serialize', () => {
  const request = {
    id: 'id',
    method: ExtensionRequest.ACTION_GET, // doesn't matter for the test
  };
  const bigString =
    '10000000000000000000000000000000000000000000000000000000000000';
  const serializableValues: [
    value: SerializableValue,
    serializedValue: DeserializableValue
  ][] = [
    [new Big(bigString), { type: 'Big', value: bigString }],
    [BigNumber.from(bigString), { type: 'BigNumber', value: bigString }],
    [new BN(bigString), { type: 'BN', value: bigString }],
    [BigInt(bigString), { type: 'BigInt', value: bigString }],
  ];

  // Primatives
  serializableValues.forEach(([value, serializedValue]) => {
    it(`updates the result when it's a ${serializedValue.type}`, () => {
      const response = serialize({
        ...request,
        result: value,
      });
      expect(response.result).toEqual(serializedValue);
    });
  });

  // Object/Array
  serializableValues.forEach(([value, serializedValue]) => {
    it(`updates the object when there's a nested ${serializedValue.type}`, () => {
      const result = {
        v1: value,
        nested: {
          v2: value,
          extraNested: {
            v3: value,
          },
        },
        // extra stuff as a control
        text: 'foo',
        number: 1,
        bool: true,
      };
      const expectedResult = {
        v1: serializedValue,
        nested: {
          v2: serializedValue,
          extraNested: {
            v3: serializedValue,
          },
        },
        text: 'foo',
        number: 1,
        bool: true,
      };
      const response = serialize({
        ...request,
        result,
      });
      expect(response.result).toEqual(expectedResult);
    });

    it(`updates the array when there's a nested ${serializedValue.type}`, () => {
      const result = [
        value,
        [value, 'foo', 1, true],
        // extra stuff as a control
        {
          v1: value,
          nested: { v2: value },
        },
        'foo',
        1,
        true,
      ];
      const expectedResult = [
        serializedValue,
        [serializedValue, 'foo', 1, true],
        {
          v1: serializedValue,
          nested: { v2: serializedValue },
        },
        'foo',
        1,
        true,
      ];
      const response = serialize({
        ...request,
        result,
      });
      expect(response.result).toEqual(expectedResult);
    });
  });
});