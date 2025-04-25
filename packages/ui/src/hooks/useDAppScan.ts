import { resolve } from '@avalabs/core-utils-sdk';
import Blockaid from '@blockaid/client';
import { FeatureGates } from '@core/service-worker';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';
import { useCallback } from 'react';

export interface BlockaidData {
  status: 'hit' | 'miss';
  url?: string;
  isMalicious?: boolean;
}

export function useDAppScan() {
  const { featureFlags } = useFeatureFlagContext();
  const dAppScanning = useCallback(
    async (dAppURL: string) => {
      if (!featureFlags[FeatureGates.BLOCKAID_DAPP_SCAN]) {
        return undefined;
      }
      const baseURL = process.env.PROXY_URL + '/proxy/blockaid/';

      const blockaid = new Blockaid({
        baseURL,
        apiKey: 'key', // Proxy API will append the actual API key, this here is just so the SDK does not complain
      });
      const [response, error] = await resolve(
        blockaid.site.scan({ url: dAppURL }),
      );

      if (response === null || error) {
        throw new Error('There is an error during requesting the dApp data');
      }

      if (response.status === 'miss') {
        return {
          status: response.status,
        };
      }
      return {
        status: response.status,
        url: response.url || dAppURL,
        isMalicious: response.is_malicious,
      };
    },
    [featureFlags],
  );

  return dAppScanning;
}
