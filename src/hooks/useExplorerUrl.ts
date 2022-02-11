import { ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import {
  getExplorerLinkAvalanche,
  getExplorerLinkEVM,
} from '@avalabs/wallet-react-components';

export function useExplorerUrl(txId?: string, chain?: ChainIdType) {
  if (!txId) {
    return '';
  }
  return chain === 'C'
    ? getExplorerLinkEVM(txId)
    : getExplorerLinkAvalanche(txId);
}
