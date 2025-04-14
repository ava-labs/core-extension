import { useCallback } from 'react';
import { GetRateParams, JupiterQuote, SwapAdapter, SwapParams } from './models';

export const useSolanaSwap: SwapAdapter<JupiterQuote> = () => {
  const getRate = useCallback(async (_params: GetRateParams) => {
    throw 'not implemented yet';
  }, []);

  const swap = useCallback(async (_params: SwapParams<JupiterQuote>) => {
    throw 'not implemented yet';
  }, []);

  return {
    getRate,
    swap,
  };
};
