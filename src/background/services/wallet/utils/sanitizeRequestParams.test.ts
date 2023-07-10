import { arrayify, hexlify } from 'ethers/lib/utils';
import { MessageType } from '../../messages/models';
import {
  filterUnusedTypes,
  sanitizeRequestParams,
} from './sanitizeRequestParams';

describe('src/background/services/wallet/utils/filterPayload.test.ts', () => {
  const address = '0x9eBB82bCAAf8c36E956a9526B5ce3248F2d567bD';

  it('should return the data as is if the MessageType is not MessageType.SIGN_TYPED_DATA_V3 or MessageType.SIGN_TYPED_DATA_V4', () => {
    const requestParam = {
      data: { test: 'hello' },
      from: 'testFrom',
    };
    const payload = sanitizeRequestParams(MessageType.ETH_SIGN, requestParam);
    expect(payload).toEqual(requestParam);
  });

  describe('filterUnusedTypes', () => {
    const types = {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
      Person: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'wallet',
          type: 'address',
        },
      ],
      Mail: [
        {
          name: 'from',
          type: 'Person',
        },
        {
          name: 'to',
          type: 'Person',
        },
        {
          name: 'contents',
          type: 'string',
        },
      ],
    };

    const message = {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    };

    const typedMessage = {
      types,
      primaryType: 'Mail',
      domain: {},
      message,
    };

    it('should return everything from types when all types are used in message', () => {
      const payload = filterUnusedTypes(typedMessage);
      expect(payload).toEqual(types);
    });
    it('should filter the unused type', () => {
      const payload = filterUnusedTypes({
        types: {
          ...types,
          fake: [
            {
              name: 'should be removed',
              type: 'test',
            },
          ],
        },
        primaryType: 'Mail',
        domain: {},
        message,
      });
      expect(payload).toEqual(types);
    });
    it('should throw an error if primaryType cannot be found in types', () => {
      try {
        filterUnusedTypes({
          types: {
            ...types,
          },
          primaryType: 'Fake',
          domain: {},
          message,
        });
      } catch (error) {
        expect(error).toEqual(
          new Error('No matching type for primaryType found')
        );
      }
    });
  });

  describe('Handle Array typeData:eth_signTypedData and eth_signTypedData_v1', () => {
    const arrayTypedDataRequests = [
      MessageType.SIGN_TYPED_DATA,
      MessageType.SIGN_TYPED_DATA_V1,
    ];
    const requestParams = {
      data: [
        {
          type: 'string',
          name: 'message',
          value: 'Hello Playground!',
        },
        {
          type: 'uint256',
          name: 'number',
          value: 42,
        },
      ],
      from: address,
    };

    describe('sanitizer of "bool" type', () => {
      it('should return as is when it is value is valid', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const request = {
            ...requestParams,
            data: [
              {
                type: 'bool',
                name: 'message',
                value: true,
              },
            ],
          };
          const result = sanitizeRequestParams(requestType, request);
          expect(result).toEqual(request);
        });
      });

      it('should remove the typed data when type does not match', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'bool',
                name: 'message',
                value: 'Hello',
              },
            ],
          });
          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });

    describe('sanitizer of "string" type', () => {
      it('should return as is when it is value is valid', () => {
        const request = {
          ...requestParams,
          data: [
            {
              type: 'string',
              name: 'message',
              value: 'Test message',
            },
          ],
        };
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, request);

          expect(result).toEqual(request);
        });
      });

      it('should remove the typed data when type does not match', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'string',
                name: 'number',
                value: 42,
              },
            ],
          });
          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });

    describe('sanitizer of "bytes" type', () => {
      it('should return sanitized value when it is value is valid', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'bytes',
                name: 'number',
                value: 42,
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [
              {
                type: 'bytes',
                name: 'number',
                value: hexlify(arrayify(42)),
              },
            ],
          });
        });
      });

      it('should remove the typed data when type does not match', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'bytes',
                name: 'message',
                value: 'Good Morning',
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });

    describe('sanitizer of "uint" type', () => {
      it('should return sanitized value when it is value is valid', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'uint256',
                name: 'number',
                value: 42,
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [
              {
                type: 'uint256',
                name: 'number',
                value: '42',
              },
            ],
          });
        });
      });

      it('should remove the typed data when type does not match', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'uint256',
                name: 'message',
                value: 'Good Afternoon',
              },
            ],
          });
          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });

    describe('sanitizer of "int" type', () => {
      it('should return sanitized value when it is value is valid', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'int256',
                name: 'number',
                value: 123,
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [
              {
                type: 'int256',
                name: 'number',
                value: '123',
              },
            ],
          });
        });
      });

      it('should remove the typed data  when type does not match', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'int256',
                name: 'message',
                value: 'Good Evening',
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });

    describe('sanitizer of "address" type', () => {
      it('should return sanitized value when it is value is valid', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'address',
                name: 'message',
                value: address,
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [
              {
                type: 'address',
                name: 'message',
                value: address.toLowerCase(),
              },
            ],
          });
        });
      });

      it('should remove the typed data when type does not match', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'address',
                name: 'message 2',
                value: 'notAddress',
              },
            ],
          });

          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });

    describe('sanitizer of "array" type', () => {
      it('should return sanitized value when it is value is valid', () => {
        const dataContent = {
          type: 'int256[]',
          name: 'message',
          value: [40],
        };

        const request = {
          ...requestParams,
          data: [dataContent],
        };
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, request);

          expect(result).toEqual({
            ...request,
            data: [
              {
                ...dataContent,
                value: ['40'],
              },
            ],
          });
        });
      });

      it('should return sanitized value when array length match the type', () => {
        const request = {
          ...requestParams,
          data: [
            {
              type: 'string[2]',
              name: 'message',
              value: ['one', 'two'],
            },
          ],
        };
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, request);

          expect(result).toEqual(request);
        });
      });

      it('should throw error when array length does not match the type', () => {
        const type = 'string[2]';
        const request = {
          ...requestParams,
          data: [
            {
              type,
              name: 'message',
              value: ['one', 'two', 'three'],
            },
          ],
        };

        arrayTypedDataRequests.forEach((requestType) => {
          try {
            sanitizeRequestParams(requestType, request);
            fail('Shoulf not get here');
          } catch (error) {
            expect(error).toEqual(
              new Error(`Array length does not match for ${type}`)
            );
          }
        });
      });

      it('should remove typed data when type is array but the value is not an array', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'bytes[]',
                name: 'message',
                value: 'not number',
              },
            ],
          });
          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });

      it('should remove typed data when value in the array do not match the type', () => {
        arrayTypedDataRequests.forEach((requestType) => {
          const result = sanitizeRequestParams(requestType, {
            ...requestParams,
            data: [
              {
                type: 'int256[]',
                name: 'message 2',
                value: ['Good Night', 123],
              },
            ],
          });
          expect(result).toEqual({
            ...requestParams,
            data: [],
          });
        });
      });
    });
  });

  describe('Handle object-typed data (eth_signTypedData_v3 and eth_signTypedData_v4)', () => {
    const objectTypedDataRequests = [
      MessageType.SIGN_TYPED_DATA_V3,
      MessageType.SIGN_TYPED_DATA_V4,
    ];

    const types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Request: [{ name: 'text', type: 'string' }],
    };

    const primaryType = 'Request';

    const domain = {
      name: 'EIP-712 Test',
      version: '1',
      chainId: '1',
      verifyingContract: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    };

    const EIP712Object = {
      types,
      domain,
      primaryType,
      message: {
        text: 'This is correct',
      },
    };

    const EIP712ObjectSanitized = {
      from: address,
      data: {
        types,
        domain,
        primaryType,
        message: { text: 'This is correct' },
      },
    };

    it('should return expected results when input is valid', () => {
      objectTypedDataRequests.forEach((requestType) => {
        const result = sanitizeRequestParams(requestType, {
          data: EIP712Object,
          from: address,
        });
        expect(result).toEqual(EIP712ObjectSanitized);
      });
    });

    it('should filter out properties not specified by types schema', () => {
      objectTypedDataRequests.forEach((requestType) => {
        const result = sanitizeRequestParams(requestType, {
          data: {
            ...EIP712Object,
            message: {
              ...EIP712Object.message,
              '': 'This should be removed',
              'text ': 'This should be removed',
              ' text': 'This should be removed',
            },
          },
          from: address,
        });
        expect(result).toEqual(EIP712ObjectSanitized);
      });
    });

    it('should filter out unused types', () => {
      objectTypedDataRequests.forEach((requestType) => {
        const result = sanitizeRequestParams(requestType, {
          data: {
            ...EIP712Object,
            types: {
              ...EIP712Object.types,
              Fake: [{ name: 'number', type: 'bytes' }],
            },
          },
          from: address,
        });
        expect(result).toEqual(EIP712ObjectSanitized);
      });
    });

    it('should return expected results when types includes nested types', () => {
      const addressForWallet = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
      const typesForRequest = {
        EIP712Domain: types.EIP712Domain,
        Group: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'members',
            type: 'Person[]',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Group',
          },
          {
            name: 'contents',
            type: 'string',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallets',
            type: 'address[]',
          },
        ],
      };
      const requestData = {
        types: typesForRequest,
        domain,
        primaryType: 'Mail',
        message: {
          contents: 'Hello, Bob!',
          from: {
            name: 'Cow',
            wallets: [addressForWallet],
          },
          to: {
            name: 'Test',
            members: [
              {
                name: 'Bob',
                wallets: [addressForWallet],
              },
            ],
          },
        },
      };

      objectTypedDataRequests.forEach((requestType) => {
        const result = sanitizeRequestParams(requestType, {
          data: requestData,
          from: address,
        });
        expect(result).toEqual({
          from: address,
          data: requestData,
        });
      });
    });
  });
});
