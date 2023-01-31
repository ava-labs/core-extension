import { TokenIcon as TokenImage } from '@src/components/common/TokenImage';
import { APIError } from 'paraswap';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { stringToBN } from '@avalabs/utils-sdk';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { BigNumber } from 'ethers';
import { OptimalRate } from 'paraswap-core';
import BN from 'bn.js';

interface GetTokenIconProps {
  token?: TokenWithBalance;
}

export const TokenIcon = ({ token }: GetTokenIconProps) => {
  if (!token) {
    return null;
  }
  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoUri}
      name={token.name}
    />
  );
};

export const getTokenIcon = (token: TokenWithBalance) => {
  if (!token) {
    return null;
  }

  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoUri}
      name={token.name}
    />
  );
};

export const getMaxValue = (token?: TokenWithBalance, fee?: string) => {
  if (!token || !fee) {
    return;
  }

  if (token.type === TokenType.NATIVE) {
    return token.balance.sub(stringToBN(fee, token.decimals));
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
  return token.type === TokenType.NATIVE ? token.symbol : token.address;
};

export const getMaxValueWithGas = ({
  customGasPrice,
  gasLimit,
  avaxPrice,
  tokenDecimals,
  selectedFromToken,
}: {
  customGasPrice: BigNumber;
  gasLimit?: number;
  avaxPrice: number;
  tokenDecimals?: number;
  selectedFromToken: TokenWithBalance;
}) => {
  const newFees = calculateGasAndFees({
    gasPrice: customGasPrice,
    tokenPrice: avaxPrice,
    tokenDecimals,
    gasLimit,
  });

  const max = getMaxValue(selectedFromToken, newFees.fee);
  return max;
};

export const calculateRate = (optimalRate: OptimalRate) => {
  const { destAmount, destDecimals, srcAmount, srcDecimals } = optimalRate;
  const destAmountNumber =
    parseInt(destAmount, 10) / Math.pow(10, destDecimals);
  const sourceAmountNumber =
    parseInt(srcAmount, 10) / Math.pow(10, srcDecimals);
  return destAmountNumber / sourceAmountNumber;
};

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export type DestinationInput = 'from' | 'to' | '';

export interface SwapRate extends OptimalRate {
  status?: number;
  message?: string;
}

export interface Amount {
  bn: BN;
  amount: string;
}
