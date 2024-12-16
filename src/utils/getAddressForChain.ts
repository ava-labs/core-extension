import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { Account } from '@src/background/services/accounts/models';
import { isPchainNetworkId } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { isXchainNetworkId } from '@src/background/services/network/utils/isAvalancheXchainNetwork';

export function getAddressForChain(chainId: number, account: Partial<Account>) {
  return isBitcoinChainId(chainId)
    ? account.addressBTC
    : isPchainNetworkId(chainId)
      ? account.addressPVM
      : isXchainNetworkId(chainId)
        ? account.addressAVM
        : account.addressC;
}
