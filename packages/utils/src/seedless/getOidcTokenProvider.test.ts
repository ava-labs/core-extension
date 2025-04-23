import { SeedlessAuthProvider } from '../../../service-worker/src/services/wallet/models';
import { authenticateWithApple } from './authenticateWithApple';
import { authenticateWithGoogle } from './authenticateWithGoogle';
import { getOidcTokenProvider } from './getOidcTokenProvider';

describe('src/utils/seedless/getOidcTokenProvider', () => {
  it('should get unsupported error', () => {
    expect(() => getOidcTokenProvider()).toThrow(
      'Unsupported provider: unknown',
    );
  });
  it('should get the provider function', () => {
    expect(getOidcTokenProvider(SeedlessAuthProvider.Google)).toEqual(
      authenticateWithGoogle,
    );
  });
  it('should get the provider function', () => {
    expect(getOidcTokenProvider(SeedlessAuthProvider.Apple)).toEqual(
      authenticateWithApple,
    );
  });
});
