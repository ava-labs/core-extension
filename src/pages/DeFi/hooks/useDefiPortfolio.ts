import { useCallback, useEffect, useState } from 'react';

import { DefiPortfolio } from '@src/background/services/defi/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { GetDefiPortfolioHandler } from '@src/background/services/defi/handlers/getDefiPortfolio';

const EMPTY_PORTFOLIO = {
  protocols: [],
  totalUsdValue: 0,
};

export const useDefiPortfolio = (address?: string) => {
  const { request } = useConnectionContext();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<DefiPortfolio>(EMPTY_PORTFOLIO);

  const fetchPortfolio = useCallback(
    async (address) => {
      setIsLoading(true);

      try {
        const result = await request<GetDefiPortfolioHandler>({
          method: ExtensionRequest.DEFI_GET_PORTFOLIO,
          params: [address],
        });

        return {
          result,
          error: null,
        };
      } catch (error) {
        return {
          result: EMPTY_PORTFOLIO,
          error,
        };
      }
    },
    [request]
  );

  useEffect(() => {
    if (address) {
      fetchPortfolio(address).then(({ result, error }) => {
        setPortfolio(result);
        setHasError(!!error);
        setIsLoading(false);
      });
    }
  }, [address, request, fetchPortfolio]);

  return {
    hasError,
    isLoading,
    portfolio,
  };
};
