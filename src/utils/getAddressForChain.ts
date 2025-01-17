import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { Account } from '@src/background/services/accounts/models';
import { isPchainNetworkId } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { isXchainNetworkId } from '@src/background/services/network/utils/isAvalancheXchainNetwork';
import { getNameSpaceFromScope } from './caipConversion';

export function getAddressForChain(
  chainId: number,
  account: Partial<Account>,
  caipId?: string,
) {
  if (isBitcoinChainId(chainId)) {
    return account.addressBTC;
  }
  if (isPchainNetworkId(chainId)) {
    return account.addressPVM;
  }
  if (isXchainNetworkId(chainId)) {
    return account.addressAVM;
  }
  if (getNameSpaceFromScope(caipId) === 'hvm') {
    return account.addressHVM;
  }
  return account.addressC;
}
