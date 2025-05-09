import { getAccountPrivateKeyFromMnemonic } from './getAccountPrivateKeyFromMnemonic';
import {
  DerivationPath,
  getWalletFromMnemonic,
} from '@avalabs/core-wallets-sdk';

jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
  getWalletFromMnemonic: jest.fn(() => ({ path: 'path', privateKey: '0xASD' })),
}));
describe('background/services/secrets/utils/getAccountPrivateKeyFromMnemonic.ts', () => {
  it('should throw an error because the signer is falsy', async () => {
    (getWalletFromMnemonic as jest.Mock).mockReturnValueOnce(undefined);
    try {
      getAccountPrivateKeyFromMnemonic('random', 0, DerivationPath.BIP44);
    } catch (e) {
      expect(e).toEqual(new Error('The requested path is missing'));
    }
  });
  it('should return with a privateKey', () => {
    const privateKey = getAccountPrivateKeyFromMnemonic(
      'random',
      0,
      DerivationPath.BIP44,
    );
    expect(privateKey).toBe('0xASD');
  });
});
