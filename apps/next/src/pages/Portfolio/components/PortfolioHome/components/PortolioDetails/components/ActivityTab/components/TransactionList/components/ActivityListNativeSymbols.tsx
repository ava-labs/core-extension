import { buildNetworkLookupKeys } from '@core/common';
import { useNativeSymbolForTransactionChain } from '@/hooks/useNativeSymbolForTransactionChain';
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

/** Collapses decimal / hex / eip155 forms so one row resolves native symbol once per chain. */
export function activityListChainKey(
  chainId: string | number | undefined,
): string {
  if (chainId === undefined || String(chainId).trim() === '') {
    return '';
  }
  const keys = buildNetworkLookupKeys(chainId);
  const numeric = keys.find((item): item is number => typeof item === 'number');
  return numeric !== undefined ? String(numeric) : String(chainId).trim();
}

const NativeSymbolsContext = createContext<
  Readonly<Record<string, string | undefined>>
>({});

export function useActivityListNativeSymbol(
  chainId: string | number | undefined,
): string | undefined {
  return useContext(NativeSymbolsContext)[activityListChainKey(chainId)];
}

type ProviderProps = { chainIds: readonly string[]; children: ReactNode };

export const ActivityListNativeSymbolsProvider: FC<ProviderProps> = ({
  chainIds,
  children,
}) => {
  const [symbolsByChain, setSymbolsByChain] = useState<
    Record<string, string | undefined>
  >({});

  return (
    <NativeSymbolsContext.Provider value={symbolsByChain}>
      {chainIds.map((canonicalChainId) => (
        <SubscribeNativeSymbol
          key={canonicalChainId}
          canonicalChainId={canonicalChainId}
          setSymbolsByChain={setSymbolsByChain}
        />
      ))}
      {children}
    </NativeSymbolsContext.Provider>
  );
};

function SubscribeNativeSymbol({
  canonicalChainId,
  setSymbolsByChain,
}: {
  canonicalChainId: string;
  setSymbolsByChain: Dispatch<
    SetStateAction<Record<string, string | undefined>>
  >;
}) {
  const symbol = useNativeSymbolForTransactionChain(canonicalChainId);
  useEffect(() => {
    setSymbolsByChain((previous) =>
      previous[canonicalChainId] === symbol
        ? previous
        : { ...previous, [canonicalChainId]: symbol },
    );
  }, [canonicalChainId, symbol, setSymbolsByChain]);
  return null;
}
