import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useNetworkContext } from '@core/ui';
import { NetworkWithCaipId } from '@core/types';

import { getTypedDataChainId } from '../lib/getTypedDataChainId';

/**
 * Returns a non-blocking warning message when an EIP-712 request's domain
 * targets a different chain than the network this request is being signed on.
 *
 * A signature is only valid on the chain named in its domain, so a mismatch is
 * a phishing red flag: the user thinks they're signing for one network while
 * the signature is actually bound to another. Returns undefined when there is
 * no domain chainId or it matches the signing network.
 */
export const useTypedDataChainMismatch = (
  data: unknown,
  network: NetworkWithCaipId,
): string | undefined => {
  const { t } = useTranslation();
  const { getNetwork } = useNetworkContext();

  return useMemo(() => {
    const domainChainId = getTypedDataChainId(data);
    if (domainChainId === undefined || domainChainId === network.chainId) {
      return undefined;
    }

    const targetName = getNetwork(domainChainId)?.chainName;

    return targetName
      ? t(
          'This request is for {{target}}, but your selected network is {{active}}. Only sign if you trust this site.',
          { target: targetName, active: network.chainName },
        )
      : t(
          'This request targets a different network (chain ID {{chainId}}) than your selected network {{active}}. Only sign if you trust this site.',
          { chainId: domainChainId, active: network.chainName },
        );
  }, [data, network.chainId, network.chainName, getNetwork, t]);
};
