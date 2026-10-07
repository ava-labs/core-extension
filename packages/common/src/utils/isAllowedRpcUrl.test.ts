import { isAllowedRpcUrl } from './isAllowedRpcUrl';

describe('isAllowedRpcUrl', () => {
  it('allows public https URLs', () => {
    expect(isAllowedRpcUrl('https://api.avax.network/ext/bc/C/rpc')).toBe(true);
  });

  it('rejects http, private hosts, and malformed URLs on mainnet', () => {
    expect(isAllowedRpcUrl('http://api.avax.network/ext/bc/C/rpc')).toBe(false);
    expect(isAllowedRpcUrl('https://localhost:8545')).toBe(false);
    expect(isAllowedRpcUrl('https://127.0.0.1:8545')).toBe(false);
    expect(isAllowedRpcUrl('http://192.168.1.10:9650/ext/bc/C/rpc')).toBe(
      false,
    );
    expect(isAllowedRpcUrl('https://169.254.169.254/')).toBe(false);
    expect(isAllowedRpcUrl('not a url')).toBe(false);
  });

  it('allows http and private hosts in testnet mode', () => {
    const options = { allowPrivate: true };

    expect(isAllowedRpcUrl('http://127.0.0.1:8545', options)).toBe(true);
    expect(isAllowedRpcUrl('http://localhost:9650/ext/bc/C/rpc', options)).toBe(
      true,
    );
    expect(
      isAllowedRpcUrl('https://192.168.1.10:9650/ext/bc/C/rpc', options),
    ).toBe(true);
    expect(
      isAllowedRpcUrl('http://api.avax-test.network/ext/bc/C/rpc', options),
    ).toBe(true);
  });

  it('still rejects non-http schemes in testnet mode', () => {
    expect(isAllowedRpcUrl('file:///etc/passwd', { allowPrivate: true })).toBe(
      false,
    );
  });
});
