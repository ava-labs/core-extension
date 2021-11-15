import React, { createContext, useContext } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/models';
import { OptimalRate } from 'paraswap-core';

const SwapContext = createContext<{
  getRate(
    srcTokenAddr: string,
    destTokenAddress: string,
    destDecimals: number,
    srcDecimals: number,
    amount?: string
  ): Promise<OptimalRate>;
  swap(
    srcTokenAddr: string,
    destTokenAddress: string,
    destDecimals: number,
    srcDecimals: number,
    amount: string,
    priceRoute: OptimalRate,
    destAmount,
    gasLimit: string
  ): Promise<string>;
}>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

  function getRate(
    srcTokenAddr: string,
    destTokenAddress: string,
    destDecimals: number,
    srcDecimals: number,
    amount?: string
  ) {
    return request({
      method: ExtensionRequest.SWAP_GET_RATE,
      params: [
        srcTokenAddr,
        destTokenAddress,
        srcDecimals,
        destDecimals,
        amount,
      ],
    });
  }

  function swap(
    srcTokenAddr: string,
    destTokenAddress: string,
    destDecimals: number,
    srcDecimals: number,
    amount: string,
    priceRoute: OptimalRate,
    destAmount,
    gasLimit: string
  ) {
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
      ],
    });
  }

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
