import { TokenWithBalance } from '@src/background/services/balances/models';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type SetSendDataInParams = {
  token?: TokenWithBalance;
  address?: string;
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
    ({ token, address, options }: SetSendDataInParams) => {
      const pushOrReplace = options?.replace ? history.replace : history.push;
      pushOrReplace({
        pathname: options?.path ?? pathname,
        search: `?${new URLSearchParams({
          tokenSymbol: token?.symbol || network?.networkToken.symbol || '',
          tokenAddress: token?.isERC20 ? token?.address : '',
          address: address ?? '',
        }).toString()}`,
      });
    },
    [history, network?.networkToken.symbol, pathname]
  );

  return setSendDataInParams;
}
