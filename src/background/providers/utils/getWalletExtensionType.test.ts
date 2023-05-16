import { WalletExtensionType } from '@src/background/services/web3/models';
import { getWalletExtensionType } from './getWalletExtensionType';

describe('src/background/providers/utils/getWalletExtensionType', () => {
  it('returns CORE when isAvalanche is true', () => {
    expect(
      getWalletExtensionType({ isAvalanche: true, isMetaMask: true })
    ).toBe(WalletExtensionType.CORE);
  });

  it('returns RABBY when isRabby is true', () => {
    expect(getWalletExtensionType({ isRabby: true, isMetaMask: true })).toBe(
      WalletExtensionType.RABBY
    );
  });

  it('returns COINBASE when isCoinbaseWallet is true', () => {
    expect(
      getWalletExtensionType({ isCoinbaseWallet: true, isMetaMask: true })
    ).toBe(WalletExtensionType.COINBASE);
  });

  it('returns METAMASK when isMetamask is true', () => {
    expect(getWalletExtensionType({ isMetaMask: true })).toBe(
      WalletExtensionType.METAMASK
    );
  });

  it('returns UNKNOWN', () => {
    expect(getWalletExtensionType({})).toBe(WalletExtensionType.UNKNOWN);
  });
});
