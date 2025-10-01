import {
  BRIDGE_QUERY_TOKENS,
  BridgeQueryTokens,
  getBridgePath,
} from '@/config/routes';
import {
  createContext,
  FC,
  isValidElement,
  ReactNode,
  use,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';

export type BridgeQueryContext = BridgeQueryTokens & {
  updateQuery: QueryUpdateFn;
};

const BridgeQueryContext = createContext<BridgeQueryContext | undefined>(
  undefined,
);
export type QueryUpdateFn = (payload: Partial<BridgeQueryTokens>) => void;

type Props = {
  children: (context: BridgeQueryContext) => ReactNode | ReactNode;
};

export const BridgeQueryProvider: FC<Props> = ({ children }) => {
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
        nextSearch.set(BRIDGE_QUERY_TOKENS[tokenName], value ?? '');
      });

      replace({
        pathname: getBridgePath(),
        search: nextSearch.toString(),
      });
    },
    [replace],
  );

  const contextValue = useMemo<BridgeQueryContext>(() => {
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
  }, [search, updateQuery]);

  return (
    <BridgeQueryContext value={contextValue}>
      {isValidElement(children) ? children : children(contextValue)}
    </BridgeQueryContext>
  );
};

export const useBridgeQuery = () => {
  const context = use(BridgeQueryContext);
  if (!context) {
    throw new Error('useBridgeQuery must be used within a BridgeQueryProvider');
  }
  return context;
};
