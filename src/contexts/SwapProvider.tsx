import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/models';
import { OptimalRate } from 'paraswap-core';
import { GasPrice } from '@src/background/services/gas/models';
import { filter } from 'rxjs';
import { gasPriceSwapUpdateListener } from '@src/background/services/swap/events/gasPriceSwapUpdateListener';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { APIError } from 'paraswap';

const SwapContext = createContext<{
  getRate(
    srcTokenAddr: string,
    srcDecimals: number,
    destTokenAddress: string,
    destDecimals: number,
    amount?: string
  ): Promise<{
    optimalRate: OptimalRate | APIError;
    destAmount: string | undefined;
  }>;
  swap(
    srcTokenAddr: string,
    destTokenAddress: string,
    destDecimals: number,
    srcDecimals: number,
    amount: string,
    priceRoute: OptimalRate,
    destAmount,
    gasLimit: string,
    slippage: number
  ): Promise<string>;
  gasPrice?: GasPrice;
}>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [gasPrice, setGasPrice] = useState<GasPrice | undefined>();

  useEffect(() => {
    request({
      method: ExtensionRequest.GAS_GET,
    }).then((res) => {
      setGasPrice({
        ...res,
        bn: new BN(res.bn, 'hex'),
      });
    });
  }, [request]);

  useEffect(() => {
    const subscription = events?.()
      .pipe(filter(gasPriceSwapUpdateListener))
      .subscribe(function (evt) {
        setGasPrice({
          ...evt.value,
          bn: new BN(evt.value.bn, 'hex'),
        });
      });

    return () => {
      subscription?.unsubscribe();
    };
  }, [events]);

  const getRate = useCallback(
    (
      srcTokenAddr: string,
      srcDecimals: number,
      destTokenAddress: string,
      destDecimals: number,
      amount?: string
    ) => {
      return request({
        method: ExtensionRequest.SWAP_GET_RATE,
        params: [
          srcTokenAddr,
          srcDecimals,
          destTokenAddress,
          destDecimals,
          amount,
        ],
      });
    },
    [request]
  );

  const swap = useCallback(
    (
      srcTokenAddr: string,
      destTokenAddress: string,
      destDecimals: number,
      srcDecimals: number,
      amount: string,
      priceRoute: OptimalRate,
      destAmount,
      gasLimit: string,
      slippage: number
    ) => {
      return request({
        method: ExtensionRequest.SWAP_PERFORM,
        params: [
          srcTokenAddr,
          destTokenAddress,
          srcDecimals,
          destDecimals,
          amount,
          priceRoute,
          destAmount,
          gasLimit,
          slippage,
        ],
      });
    },
    [request]
  );

  return (
    <SwapContext.Provider
      value={{
        getRate,
        swap,
        gasPrice,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwapContext() {
  return useContext(SwapContext);
}
