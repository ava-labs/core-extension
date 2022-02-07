import {
  ERC20WithBalance,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { useHistory, useLocation } from 'react-router-dom';

type SetTokenInParamsOptions = {
  path?: string;
  replace?: boolean;
};

export function useSetTokenInParams() {
  const { pathname } = useLocation();
  const history = useHistory();

  return (token: TokenWithBalance, options?: SetTokenInParamsOptions) => {
    const pushOrReplace = options?.replace ? history.replace : history.push;
    pushOrReplace({
      pathname: options?.path ?? pathname,
      search: `?${new URLSearchParams({
        tokenSymbol: token.symbol,
        tokenAddress: (token as ERC20WithBalance).address ?? '',
      }).toString()}`,
    });
  };
}
