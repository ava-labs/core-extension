import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  getSwapPath,
  SWAP_QUERY_TOKENS,
  SwapQueryTokens,
} from '@/config/routes';

export const useSwapQuery = () => {
  const { replace } = useHistory();

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const fromId = searchParams.get(SWAP_QUERY_TOKENS.from) ?? '';
  const fromQuery = searchParams.get(SWAP_QUERY_TOKENS.fromQuery) ?? '';
  const toId = searchParams.get(SWAP_QUERY_TOKENS.to) ?? '';
  const toQuery = searchParams.get(SWAP_QUERY_TOKENS.toQuery) ?? '';
  const amount = searchParams.get(SWAP_QUERY_TOKENS.amount) ?? '';

  const update = useCallback(
    (payload: Partial<Record<keyof SwapQueryTokens, string>>) => {
      const updated = new URLSearchParams(search);

      for (const [k, v] of Object.entries(payload)) {
        updated.set(SWAP_QUERY_TOKENS[k], v);
      }

      replace({
        pathname: getSwapPath(),
        search: updated.toString(),
      });
    },
    [replace, search],
  );

  return {
    update,
    fromId,
    fromQuery,
    toId,
    toQuery,
    amount,
  };
};
