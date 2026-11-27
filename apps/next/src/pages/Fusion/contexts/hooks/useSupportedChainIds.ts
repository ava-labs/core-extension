import { useEffect, useState } from 'react';
import { GetSupportedChainsResult, TransferManager } from '@avalabs/fusion-sdk';

const EMPTY_MAP = new Map();

export const useSupportedChainsMap = (
  manager?: TransferManager,
  statusRevision = 0,
) => {
  const [chainsMap, setChainsMap] =
    useState<GetSupportedChainsResult>(EMPTY_MAP);

  useEffect(() => {
    if (!manager) {
      return;
    }

    let cancelled = false;

    manager
      .getSupportedChains()
      .then((result) => {
        if (!cancelled) setChainsMap(result);
      })
      .catch(() => {
        if (cancelled) return;

        console.error('Error getting supported chains');
        setChainsMap(EMPTY_MAP);
      });

    return () => {
      cancelled = true;
    };
  }, [manager, statusRevision]);

  return chainsMap;
};
