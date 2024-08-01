import { ChainId } from '@avalabs/core-chains-sdk';
import { Account, AccountType } from '@src/background/services/accounts/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';
describe('utils/getAddressForChain', () => {
  const account1: Account = {
    id: 'account1 ID',
    name: 'account1 name',
    addressBTC: 'account1 BTC address',
    addressC: 'account1 C address',
    type: AccountType.PRIMARY,
    index: 0,
    walletId: 'walletId',
  };

  it('should return the c-chain address', () => {
    const address = getAddressForChain(ChainId.AVALANCHE_MAINNET_ID, account1);
    expect(address).toBe(account1.addressC);
  });
  it('should return the btc address', () => {
    const address = getAddressForChain(ChainId.BITCOIN, account1);
    expect(address).toBe(account1.addressBTC);
  });
});
