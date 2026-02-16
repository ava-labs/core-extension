import { useEffect, useState } from 'react';
import { TransferManager } from '@avalabs/unified-asset-transfer';

export const useSupportedChainIds = (manager?: TransferManager) => {
  const [chainIds, setChainIds] = useState<string[]>([]);

  useEffect(() => {
    if (!manager) {
      return;
    }

    manager
      .getSupportedChains()
      .then((supportedChainIds) => setChainIds(supportedChainIds.map(String)))
      .catch(() => {
        console.error('Error getting supported chains');
        setChainIds([]);
      });
  }, [manager]);

  return chainIds;
};
