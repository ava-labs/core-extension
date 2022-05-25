import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { concat, filter, from, map } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { networkFeeUpdatedEventListener } from '@src/background/services/networkFee/events/listeners';
import { BigNumber } from 'ethers';

const NetworkFeeContext = createContext<{
  networkFee: NetworkFee | null;
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
    ).subscribe((result: NetworkFee) => {
      if (!result) {
        setNetworkFee(null);
      } else {
        setNetworkFee({
          displayDecimals: result.displayDecimals,
          low: BigNumber.from(result.low),
          medium: BigNumber.from(result.medium),
          high: BigNumber.from(result.high),
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  return (
    <NetworkFeeContext.Provider
      value={{
        networkFee,
      }}
    >
      {children}
    </NetworkFeeContext.Provider>
  );
}

export function useNetworkFeeContext() {
  return useContext(NetworkFeeContext);
}
