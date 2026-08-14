import { serializeTypedDataPayload } from './serializeTypedDataPayload';

describe('serializeTypedDataPayload', () => {
  it('stringifies BigInt fields so eth_signTypedData_v4 can serialize the payload', () => {
    expect(
      serializeTypedDataPayload({
        domain: { chainId: 1337n, name: 'HyperliquidSignTransaction' },
        message: { nonce: 1710000000000n, amount: '2' },
      }),
    ).toBe(
      JSON.stringify({
        domain: { chainId: '1337', name: 'HyperliquidSignTransaction' },
        message: { nonce: '1710000000000', amount: '2' },
      }),
    );
  });

  it('leaves non-BigInt values unchanged', () => {
    expect(
      serializeTypedDataPayload({
        primaryType: 'HyperliquidTransaction:SendAsset',
        message: { destination: '0xabc' },
      }),
    ).toBe(
      JSON.stringify({
        primaryType: 'HyperliquidTransaction:SendAsset',
        message: { destination: '0xabc' },
      }),
    );
  });
});
