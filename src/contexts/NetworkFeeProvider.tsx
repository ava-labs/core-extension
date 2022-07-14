import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { concat, filter, from, map } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { networkFeeUpdatedEventListener } from '@src/background/services/networkFee/events/listeners';
import { GetNetworkFeeHandler } from '@src/background/services/networkFee/handlers/getNetworkFee';

const NetworkFeeContext = createContext<{
  networkFee: NetworkFee | null;
  getNetworkFeeForNetwork: (chainId: number) => Promise<NetworkFee | null>;
}>({} as any);

export function NetworkFeeContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [networkFee, setNetworkFee] = useState<NetworkFee | null>(null);

  useEffect(() => {
    if (!request || !events) {
      return;
    }
    const subscription = concat(
      from(
        request<GetNetworkFeeHandler>({
          method: ExtensionRequest.NETWORK_FEE_GET,
        })
      ),
      events().pipe(
        filter(networkFeeUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((result) => {
      if (!result) {
        setNetworkFee(null);
      } else {
        setNetworkFee(result);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const getNetworkFeeForNetwork = useCallback(
    async (chainId: number) => {
      const result = await request<GetNetworkFeeHandler>({
        method: ExtensionRequest.NETWORK_FEE_GET,
        params: [chainId],
      });
      return result;
    },
    [request]
  );

  return (
    <NetworkFeeContext.Provider
      value={{
        networkFee,
        getNetworkFeeForNetwork,
      }}
    >
      {children}
    </NetworkFeeContext.Provider>
  );
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
