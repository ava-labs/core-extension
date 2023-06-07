import { isBitcoinChainId } from '@src/background/services/network/utils/isBitcoinNetwork';
import { Account } from '@src/background/services/accounts/models';

export function getAddressForChain(chainId: number, account: Account) {
  return isBitcoinChainId(chainId) ? account.addressBTC : account.addressC;
}
