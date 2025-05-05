import { NetworkVMType } from '@avalabs/vm-module-types';
import { Account, AccountType } from 'packages/service-worker/src/services/accounts/models';
import { NetworkWithCaipId } from '@core/types';
import { getAddressForChain } from 'packages/utils/src/getAddressForChain';
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
    const address = getAddressForChain(
      { vmName: NetworkVMType.EVM } as NetworkWithCaipId,
      account1,
    );
    expect(address).toBe(account1.addressC);
  });
  it('should return the btc address', () => {
    const address = getAddressForChain(
      { vmName: NetworkVMType.BITCOIN } as NetworkWithCaipId,
      account1,
    );
    expect(address).toBe(account1.addressBTC);
  });
});
