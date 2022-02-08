import {
  AVAX_TOKEN,
  ERC20WithBalance,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
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
  const history = useHistory();

  return ({ token, address, options }: SetSendDataInParams) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        tokenSymbol: token?.symbol || AVAX_TOKEN.symbol,
        tokenAddress: (token as ERC20WithBalance).address ?? '',
        address: address ?? '',
      }).toString()}`,
    });
  };
}
