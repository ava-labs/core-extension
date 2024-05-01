import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { Account } from '@src/background/services/accounts/models';
import { isPchainNetworkId } from '@src/background/services/network/utils/isAvalanchePchainNetwork';

export function getAddressForChain(chainId: number, account: Account) {
  return isBitcoinChainId(chainId)
    ? account.addressBTC
    : isPchainNetworkId(chainId)
    ? account.addressPVM
    : account.addressC;
}
