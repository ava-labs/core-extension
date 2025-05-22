import { AVM, EVM, PVM, VM } from '@avalabs/avalanchejs';
import { Account } from '@core/types';

const getAddressByVM = (vm: VM, account?: Account) => {
  if (!account) {
    return;
  }

  if (vm === AVM) {
    return account.addressAVM;
  } else if (vm === PVM) {
    return account.addressPVM;
  } else if (vm === EVM) {
    return account.addressCoreEth;
  }
};

export default getAddressByVM;
