import * as React from 'react';
import {
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { TokenIcon as TokenImage } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';
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

export const getMaxValue = (
  token?: TokenWithBalance,
  gasLimit?: string,
  gasPrice?: GasPrice
) => {
  if (!token) {
    return;
  }

  if (isAvax(token) && gasPrice && gasLimit) {
    const gasCost = Utils.bnToBig(gasPrice.bn, token.denomination)
      .times(gasLimit)
      .round();
    return token.balance.sub(new BN(gasCost.toString()));
  }
  return token.balance;
};

export function isAPIError(rate: any): rate is APIError {
  return typeof rate.message === 'string';
}
