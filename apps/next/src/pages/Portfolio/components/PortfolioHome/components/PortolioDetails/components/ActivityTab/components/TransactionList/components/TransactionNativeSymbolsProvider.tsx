import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from 'react';

import { useNativeSymbolForTransactionChain } from '@/hooks/useNativeSymbolForTransactionChain';

const TransactionNativeSymbolsContext = createContext<
  Readonly<Record<string, string | undefined>>
>({});

export function useTransactionNativeSymbols(): Readonly<
  Record<string, string | undefined>
> {
  return useContext(TransactionNativeSymbolsContext);
}

type ProviderProps = {
  canonicalChainIds: readonly string[];
  children: ReactNode;
};

export const TransactionNativeSymbolsProvider: FC<ProviderProps> = ({
  canonicalChainIds,
  children,
}) => {
  const [symbols, setSymbols] = useState<Record<string, string | undefined>>(
    {},
  );

  return (
    <TransactionNativeSymbolsContext.Provider value={symbols}>
      {canonicalChainIds.map((chainKey) => (
        <TransactionNativeSymbolLoader
          key={chainKey}
          canonicalChainId={chainKey}
          setSymbols={setSymbols}
        />
      ))}
      {children}
    </TransactionNativeSymbolsContext.Provider>
  );
};

type LoaderProps = {
  canonicalChainId: string;
  setSymbols: Dispatch<SetStateAction<Record<string, string | undefined>>>;
};

const TransactionNativeSymbolLoader: FC<LoaderProps> = ({
  canonicalChainId,
  setSymbols,
}) => {
  const symbol = useNativeSymbolForTransactionChain(canonicalChainId);
  useEffect(() => {
    setSymbols((previous) =>
      previous[canonicalChainId] === symbol
        ? previous
        : { ...previous, [canonicalChainId]: symbol },
    );
  }, [canonicalChainId, symbol, setSymbols]);
  return null;
};
