import { createContext, useCallback, useContext } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { APIError } from 'paraswap';
import { BigNumber } from 'ethers';
import { PerformSwapHandler } from '@src/background/services/swap/handlers/performSwap';
import { GetSwapRateHandler } from '@src/background/services/swap/handlers/getSwapRate';

const SwapContext = createContext<{
  getRate(
    srcTokenAddr: string,
    srcDecimals: number,
    destTokenAddress: string,
    destDecimals: number,
    amount: string,
    swapSide: SwapSide
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
    gasLimit: number,
    gasPrice: BigNumber,
    slippage: number
  ): Promise<{
    swapTxHash: string;
    approveTxHash: string;
  }>;
}>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

  const getRate = useCallback(
    (
      srcTokenAddr: string,
      srcDecimals: number,
      destTokenAddress: string,
      destDecimals: number,
      amount: string,
      swapSide: SwapSide
    ) => {
      return request<GetSwapRateHandler>({
        method: ExtensionRequest.SWAP_GET_RATE,
        params: [
          srcTokenAddr,
          srcDecimals,
          destTokenAddress,
          destDecimals,
          amount,
          swapSide,
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
      gasLimit: number,
      gasPrice: BigNumber,
      slippage: number
    ) => {
      return request<PerformSwapHandler>({
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
          gasPrice,
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
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}

export function useSwapContext() {
  return useContext(SwapContext);
}
