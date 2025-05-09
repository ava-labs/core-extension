import { AVM, EVM, PVM } from '@avalabs/avalanchejs';
import { Account } from '@core/types';
import getAddressByVM from './getAddressByVM';

describe('src/background/services/wallet/utils/getAddressByVM', () => {
  const accountMock = {
    addressAVM: 'addressAVM',
    addressPVM: 'addressPVM',
    addressCoreEth: 'addressCoreEth',
  } as Account;

  const testData = [
    {
      vm: AVM,
      account: accountMock,
      expectedAddress: accountMock.addressAVM,
    },
    {
      vm: PVM,
      account: accountMock,
      expectedAddress: accountMock.addressPVM,
    },
    {
      vm: EVM,
      account: accountMock,
      expectedAddress: accountMock.addressCoreEth,
    },
  ];

  it('returns undefined if account is not provided', () => {
    expect(getAddressByVM(AVM)).toBeUndefined();
  });

  it.each(testData)(
    'returns the correct address for $VM',
    ({ vm, account, expectedAddress }) => {
      expect(getAddressByVM(vm, account)).toBe(expectedAddress);
    },
  );
});
