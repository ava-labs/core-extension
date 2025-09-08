import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  getSwapPath,
  SWAP_QUERY_TOKENS,
  SwapQueryTokens,
} from '@/config/routes';

type Side = 'sell' | 'buy';
type SwapQuery = {
  fromId: string;
  fromQuery: string;
  toId: string;
  toQuery: string;
  userAmount: string;
  side: Side;
};

type UpdatePayload = Partial<
  Record<keyof SwapQueryTokens, string> & { side?: Side }
>;
type UseSwapQuery = () => SwapQuery & {
  update: (payload: UpdatePayload) => void;
};

export const useSwapQuery: UseSwapQuery = () => {
  const { replace } = useHistory();

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const fromId = searchParams.get(SWAP_QUERY_TOKENS.from) ?? '';
  const fromQuery = searchParams.get(SWAP_QUERY_TOKENS.fromQuery) ?? '';
  const toId = searchParams.get(SWAP_QUERY_TOKENS.to) ?? '';
  const toQuery = searchParams.get(SWAP_QUERY_TOKENS.toQuery) ?? '';
  const userAmount = searchParams.get(SWAP_QUERY_TOKENS.userAmount) ?? '';
  const side: Side =
    (searchParams.get(SWAP_QUERY_TOKENS.side) as Side | null) ?? 'sell';

  const update = useCallback(
    (payload: UpdatePayload) => {
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
    userAmount,
    side,
  };
};
