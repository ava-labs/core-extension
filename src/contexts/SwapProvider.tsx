import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { OptimalRate, SwapSide } from 'paraswap-core';
import { GasPrice } from '@src/background/services/networkFee/models';
import { APIError } from 'paraswap';
import { hexToBN } from '@src/utils/hexToBN';

const SwapContext = createContext<{
  getRate(
    srcTokenAddr: string,
    srcDecimals: number,
    destTokenAddress: string,
    destDecimals: number,
    amount?: string,
    swapSide?: SwapSide
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
    gasPrice: GasPrice,
    slippage: number
  ): Promise<string>;
  gasPrice?: GasPrice;
}>({} as any);

export function SwapContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();
  const [gasPrice, setGasPrice] = useState<GasPrice | undefined>();

  useEffect(() => {
    request({
      method: ExtensionRequest.NETWORK_FEE_GET,
    }).then((res) => {
      setGasPrice({
        ...res,
        bn: hexToBN(res.bn),
      });
    });
  }, [request]);

  useEffect(() => {
    const interval = setInterval(() => {
      request({
        method: ExtensionRequest.NETWORK_FEE_GET,
      }).then((res) => {
        setGasPrice({
          ...res,
          bn: hexToBN(res.bn),
        });
      });
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [request]);

  const getRate = useCallback(
    (
      srcTokenAddr: string,
      srcDecimals: number,
      destTokenAddress: string,
      destDecimals: number,
      amount?: string,
      swapSide?: SwapSide
    ) => {
      return request({
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
      gasLimit: string,
      gasPrice: GasPrice,
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
