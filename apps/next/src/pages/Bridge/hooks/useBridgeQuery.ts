import {
  BRIDGE_QUERY_TOKENS,
  BridgeQueryTokens,
  getBridgePath,
} from '@/config/routes';
import { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';

export type QueryUpdateFn = (payload: Partial<BridgeQueryTokens>) => void;

export function useBridgeQuery() {
  const {
    replace,
    location: { search },
  } = useHistory();

  const searchRef = useRef(search);
  searchRef.current = search;

  const updateQuery = useCallback<QueryUpdateFn>(
    (payload) => {
      const nextSearch = new URLSearchParams(searchRef.current);

      Object.entries(payload).forEach(([tokenName, value]) => {
        nextSearch.set(BRIDGE_QUERY_TOKENS[tokenName], value);
      });

      replace({
        pathname: getBridgePath(),
        search: nextSearch.toString(),
      });
    },
    [replace],
  );

  const searchParams = new URLSearchParams(search);

  return {
    updateQuery,
    ...Object.entries(BRIDGE_QUERY_TOKENS).reduce(
      (params, [tokenName, tokenKey]) => {
        params[tokenName] = searchParams.get(tokenKey) ?? '';
        return params;
      },
      {} as BridgeQueryTokens,
    ),
  };
}
