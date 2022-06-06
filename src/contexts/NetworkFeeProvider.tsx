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
import {
  NetworkFee,
  SerializedNetworkFee,
} from '@src/background/services/networkFee/models';
import { networkFeeUpdatedEventListener } from '@src/background/services/networkFee/events/listeners';
import { BigNumber } from 'ethers';

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
        request({
          method: ExtensionRequest.NETWORK_FEE_GET,
        })
      ),
      events().pipe(
        filter(networkFeeUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((result: SerializedNetworkFee) => {
      if (!result) {
        setNetworkFee(null);
      } else {
        setNetworkFee(parseNetworkFee(result));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const getNetworkFeeForNetwork = useCallback(
    async (chainId: number) => {
      const result = await request({
        method: ExtensionRequest.NETWORK_FEE_GET,
        params: [chainId],
      });
      return result && parseNetworkFee(result);
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

function parseNetworkFee(networkFee: SerializedNetworkFee): NetworkFee {
  return {
    displayDecimals: networkFee.displayDecimals,
    low: BigNumber.from(networkFee.low),
    medium: BigNumber.from(networkFee.medium),
    high: BigNumber.from(networkFee.high),
    isFixedFee: networkFee.isFixedFee,
  };
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
