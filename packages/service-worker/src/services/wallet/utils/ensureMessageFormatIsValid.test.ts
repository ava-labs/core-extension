import { MessageType } from '@core/types';
import ensureMessageFormatIsValid from './ensureMessageFormatIsValid';

const getPayload = (without?: string, withHexChainId?: boolean) => {
  const payload = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
      ],
      Foo: [{ name: 'name', type: 'string' }],
    },
    primaryType: 'Primary Type',
    domain: {
      chainId: withHexChainId ? '0x2' : 2,
    },
    message: {},
  };

  if (without) {
    delete payload[without];
  }

  return payload;
};

describe('src/background/services/wallet/utils/ensureMessageFormatIsValid.test.ts', () => {
  const typedMessages = [
    { name: 'signTypedData_v3', messageType: MessageType.SIGN_TYPED_DATA_V3 },
    { name: 'signTypedData_v4', messageType: MessageType.SIGN_TYPED_DATA_V4 },
  ];

  describe.each(typedMessages)('$name', ({ messageType }) => {
    it('throws validation error when types is missing from the payload', () => {
      const payload = getPayload('types');

      expect(() => ensureMessageFormatIsValid(messageType, payload, 1)).toThrow(
        '"types" is required',
      );
    });

    it('throws validation error when types.EIP712Domain is missing from the payload', () => {
      const payload = getPayload('types');

      expect(() =>
        ensureMessageFormatIsValid(messageType, { ...payload, types: {} }, 1),
      ).toThrow('"types.EIP712Domain" is required');
    });

    it('throws validation error when primaryType is missing from the payload', () => {
      const payload = getPayload('primaryType');

      expect(() => ensureMessageFormatIsValid(messageType, payload, 1)).toThrow(
        '"primaryType" is required',
      );
    });

    it('throws validation error when domain is missing from the payload', () => {
      const payload = getPayload('domain');

      expect(() => ensureMessageFormatIsValid(messageType, payload, 1)).toThrow(
        '"domain" is required',
      );
    });

    it('throws validation error when message is missing from the payload', () => {
      const payload = getPayload('message');

      expect(() => ensureMessageFormatIsValid(messageType, payload, 1)).toThrow(
        '"message" is required',
      );
    });

    it('throws validation error when the chain id does not match the active one', () => {
      const payload = getPayload();
      const payloadWithHexChainId = getPayload(undefined, true);

      expect(() => ensureMessageFormatIsValid(messageType, payload, 1)).toThrow(
        'target chainId does not match the currently active one',
      );
      expect(() =>
        ensureMessageFormatIsValid(messageType, payloadWithHexChainId, 1),
      ).toThrow('target chainId does not match the currently active one');
    });

    describe('bool coercion (bounty #82203)', () => {
      const permitPayload = (allowed: unknown) => ({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'chainId', type: 'uint256' },
          ],
          Permit: [
            { name: 'holder', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'expiry', type: 'uint256' },
            { name: 'allowed', type: 'bool' },
          ],
        },
        primaryType: 'Permit',
        domain: { name: 'Dai Stablecoin', chainId: 1 },
        message: {
          holder: '0x1111111111111111111111111111111111111111',
          spender: '0x2222222222222222222222222222222222222222',
          nonce: 0,
          expiry: 0,
          allowed,
        },
      });

      it.each([
        ['the string "false"', 'false'],
        ['the string "true"', 'true'],
        ['a number', 1],
        ['an empty string', ''],
      ])('rejects a bool field given %s', (_label, allowed) => {
        expect(() =>
          ensureMessageFormatIsValid(messageType, permitPayload(allowed), 1),
        ).toThrow('"allowed" is declared as bool but is not a boolean');
      });

      it.each([true, false])('accepts the real boolean %s', (allowed) => {
        expect(
          ensureMessageFormatIsValid(messageType, permitPayload(allowed), 1),
        ).toBeUndefined();
      });

      it('walks nested structs and arrays', () => {
        const payload = {
          types: {
            EIP712Domain: [{ name: 'chainId', type: 'uint256' }],
            Outer: [
              { name: 'inners', type: 'Inner[]' },
              { name: 'flags', type: 'bool[]' },
            ],
            Inner: [{ name: 'enabled', type: 'bool' }],
          },
          primaryType: 'Outer',
          domain: { chainId: 1 },
          message: {
            inners: [{ enabled: true }, { enabled: 'false' }],
            flags: [true, false],
          },
        };

        expect(() =>
          ensureMessageFormatIsValid(messageType, payload, 1),
        ).toThrow(
          '"inners[1].enabled" is declared as bool but is not a boolean',
        );
      });

      it('rejects a coerced entry inside a bool array', () => {
        const payload = {
          types: {
            EIP712Domain: [{ name: 'chainId', type: 'uint256' }],
            Outer: [{ name: 'flags', type: 'bool[]' }],
          },
          primaryType: 'Outer',
          domain: { chainId: 1 },
          message: { flags: [true, 'false'] },
        };

        expect(() =>
          ensureMessageFormatIsValid(messageType, payload, 1),
        ).toThrow('"flags[1]" is declared as bool but is not a boolean');
      });
    });

    it('returns without error when payload is valid', () => {
      const payload = getPayload();
      const payloadWithHexChainId = getPayload(undefined, true);

      expect(
        ensureMessageFormatIsValid(messageType, payload, 2),
      ).toBeUndefined();
      expect(
        ensureMessageFormatIsValid(messageType, payloadWithHexChainId, 2),
      ).toBeUndefined();
    });
  });
});
