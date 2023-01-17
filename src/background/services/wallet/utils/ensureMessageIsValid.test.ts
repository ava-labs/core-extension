import { MessageType } from '../../messages/models';
import ensureMessageIsValid from './ensureMessageIsValid';

const getPayload = (without?: string) => {
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
      chainId: 2,
    },
    message: {},
  };

  if (without) {
    delete payload[without];
  }

  return payload;
};

describe('src/background/services/wallet/utils/ensureMessageIsValid.test.ts', () => {
  const typedMessages = [
    { name: 'signTypedData_v3', messageType: MessageType.SIGN_TYPED_DATA_V3 },
    { name: 'signTypedData_v4', messageType: MessageType.SIGN_TYPED_DATA_V4 },
  ];

  describe.each(typedMessages)('$name', ({ messageType }) => {
    it('throws validation error when types is missing from the payload', () => {
      const payload = getPayload('types');

      expect(() => ensureMessageIsValid(messageType, payload, 1)).toThrowError(
        '"types" is required'
      );
    });

    it('throws validation error when types.EIP712Domain is missing from the payload', () => {
      const payload = getPayload('types');

      expect(() =>
        ensureMessageIsValid(messageType, { ...payload, types: {} }, 1)
      ).toThrowError('"types.EIP712Domain" is required');
    });

    it('throws validation error when primaryType is missing from the payload', () => {
      const payload = getPayload('primaryType');

      expect(() => ensureMessageIsValid(messageType, payload, 1)).toThrowError(
        '"primaryType" is required'
      );
    });

    it('throws validation error when domain is missing from the payload', () => {
      const payload = getPayload('domain');

      expect(() => ensureMessageIsValid(messageType, payload, 1)).toThrowError(
        '"domain" is required'
      );
    });

    it('throws validation error when message is missing from the payload', () => {
      const payload = getPayload('message');

      expect(() => ensureMessageIsValid(messageType, payload, 1)).toThrowError(
        '"message" is required'
      );
    });

    it('throws validation error when the chain id does not match the active one', () => {
      const payload = getPayload();

      expect(() => ensureMessageIsValid(messageType, payload, 1)).toThrowError(
        'target chainId does not match the currently active one'
      );
    });

    it('returns without error when payload is valid', () => {
      const payload = getPayload();
      expect(ensureMessageIsValid(messageType, payload, 2)).toBeUndefined();
    });
  });
});
