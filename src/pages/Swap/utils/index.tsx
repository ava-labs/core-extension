import {
  ERC20WithBalance,
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { TokenIcon as TokenImage } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { APIError } from 'paraswap';

interface GetTokenIconProps {
  token?: TokenWithBalance;
}

export const TokenIcon = ({ token }: GetTokenIconProps) => {
  if (!token) {
    return null;
  }
  if (token.isAvax) {
    return <AvaxTokenIcon height="32px" />;
  }
  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoURI}
      name={token.name}
    />
  );
};

export const getTokenIcon = (token: TokenWithBalance) => {
  if (!token) {
    return null;
  }
  if (token.isAvax) {
    return <AvaxTokenIcon height="32px" />;
  }
  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoURI}
      name={token.name}
    />
  );
};

export const isAvax = (token?: TokenWithBalance) => {
  if (!token || !isAvaxToken(token)) {
    return false;
  }
  return true;
};

export const getMaxValue = (token?: TokenWithBalance, fee?: string) => {
  if (!token || !fee) {
    return;
  }

  if (isAvax(token)) {
    return token.balance.sub(Utils.stringToBN(fee, 18));
  }
  return token.balance;
};

export function isAPIError(rate: any): rate is APIError {
  return typeof rate.message === 'string';
}

export const getTokenAddress = (token?: TokenWithBalance) => {
  if (!token) {
    return undefined;
  }
  return isAvaxToken(token)
    ? token.symbol
    : (token as ERC20WithBalance).address;
};
