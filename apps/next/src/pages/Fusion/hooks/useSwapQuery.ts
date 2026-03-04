import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  FUSION_QUERY_TOKENS,
  getFusionPath,
  FusionQueryTokens,
} from '@/config/routes';

type SwapQuery = {
  fromId: string;
  fromQuery: string;
  toId: string;
  toQuery: string;
  userAmount: string;
  useMaxAmount: boolean;
};

type UpdatePayload = Partial<
  Omit<Record<keyof FusionQueryTokens, string>, 'useMaxAmount'>
> & {
  useMaxAmount?: boolean;
};
type UseSwapQuery = () => SwapQuery & {
  update: (payload: UpdatePayload) => void;
};
export const useSwapQuery: UseSwapQuery = () => {
  const { replace } = useHistory();

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const fromId = searchParams.get(FUSION_QUERY_TOKENS.from) ?? '';
  const fromQuery = searchParams.get(FUSION_QUERY_TOKENS.fromQuery) ?? '';
  const toId = searchParams.get(FUSION_QUERY_TOKENS.to) ?? '';
  const toQuery = searchParams.get(FUSION_QUERY_TOKENS.toQuery) ?? '';
  const userAmount = searchParams.get(FUSION_QUERY_TOKENS.userAmount) ?? '';
  const useMaxAmount =
    searchParams.get(FUSION_QUERY_TOKENS.useMaxAmount) === 'true';

  const update = useCallback(
    (payload: UpdatePayload) => {
      const updated = new URLSearchParams(search);

      for (const [k, v] of Object.entries(payload)) {
        updated.set(
          FUSION_QUERY_TOKENS[k],
          typeof v === 'boolean' ? v.toString() : v,
        );
      }

      replace({
        pathname: getFusionPath(),
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
    useMaxAmount,
  };
};
