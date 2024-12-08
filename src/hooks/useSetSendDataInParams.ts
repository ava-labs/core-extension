import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type SetSendDataInParams = {
  token?: TokenWithBalance;
  address?: string;
  amount?: string;
  options?: {
    path?: string;
    replace?: boolean;
  };
};

export function useSetSendDataInParams() {
  const { pathname } = useLocation();
  const { network } = useNetworkContext();
  const history = useHistory();

  const setSendDataInParams = useCallback(
    ({ token, address, options, amount }: SetSendDataInParams) => {
      const pushOrReplace = options?.replace ? history.replace : history.push;
      pushOrReplace({
        pathname: options?.path ?? pathname,
        search: `?${new URLSearchParams({
          tokenSymbol: token?.symbol || network?.networkToken.symbol || '',
          tokenAddress: token?.type === TokenType.ERC20 ? token?.address : '',
          amount: amount ?? '',
          address: address ?? '',
        }).toString()}`,
      });
    },
    [history, network?.networkToken.symbol, pathname],
  );

  return setSendDataInParams;
}
