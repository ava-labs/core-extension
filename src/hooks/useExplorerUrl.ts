import { ChainIdType } from '@avalabs/avalanche-wallet-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

export function useExplorerUrl(txId: string, chain?: ChainIdType) {
  const { network } = useNetworkContext();

  if (!network?.config.explorerSiteURL) {
    return '';
  }

  if (chain === 'C') {
    return (
      network?.config.explorerSiteURL?.replace(
        'explorer.',
        'cchain.explorer.'
      ) +
      '/tx/' +
      txId
    );
  }

  return network?.config.explorerSiteURL + '/tx/' + txId;
}
