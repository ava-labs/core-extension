import { useEffect, useState } from 'react';
import {
  GetSupportedChainsResult,
  TransferManager,
} from '@avalabs/unified-asset-transfer';

const EMPTY_MAP = new Map();

export const useSupportedChainsMap = (manager?: TransferManager) => {
  const [chainsMap, setChainsMap] =
    useState<GetSupportedChainsResult>(EMPTY_MAP);

  useEffect(() => {
    if (!manager) {
      return;
    }

    manager
      .getSupportedChains()
      .then(setChainsMap)
      .catch(() => {
        console.error('Error getting supported chains');
        setChainsMap(EMPTY_MAP);
      });
  }, [manager]);

  return chainsMap;
};
